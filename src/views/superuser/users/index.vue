<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        :placeholder="$t('table.name')"
        v-model="listQuery.name"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="fuzzySearch"
      />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="fuzzySearch">{{ $t('table.search') }}</el-button>
      <el-button v-waves class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">{{ $t('table.add') }}</el-button>
    </div>

    <el-table v-loading.body="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column :label="$t('table.avatar')" align="center" width="80">
        <template slot-scope="scope">
          <div class="avatar-wrapper">
            <img
              :src="scope.row.avatar === '' ? 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif?imageView2/1/w/80/h/80' : scope.row.avatar +'?imageView2/1/w/80/h/80'"
              width="40"
              style="margin-bottom: -7px;"
              class="user-avatar">
          </div>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.nickname')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.nickname }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.roles')" align="center">
        <template slot-scope="scope">
          <el-tag v-for="item in scope.row.roles" :key="item.code" size="mini" class="board-item" style="margin-left: 5px;">
            {{ item.name }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.permissions')" align="center">
        <template slot-scope="scope">
          <el-tag v-for="item in scope.row.permissions" :key="item.code" size="mini" class="board-item" style="margin-left: 5px;">
            {{ item.name }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.created')" width="180px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.c_time | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.updated')" width="180px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.m_time | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('table.actions')" align="center">
        <template slot-scope="scope">
          <el-button v-waves :disabled="scope.row.id === 1" type="primary" size="mini" @click="handleUpdate(scope.row)">{{ $t('table.edit') }}</el-button>
          <el-button v-waves :disabled="scope.row.id === 1" type="danger" size="mini" @click="handleRemove(scope.row)">{{ $t('table.delete') }}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination
        :current-page="listQuery.page"
        :page-sizes="[10,20,30,50]"
        :page-size="listQuery.page_size"
        :total="total"
        background
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange" />
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="768px">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="140px">
        <el-form-item label="账号" prop="account" style="width: 420px;">
          <el-input v-model="temp.account" placeholder="必须英文，不可重复" />
        </el-form-item>
        <el-form-item label="密码" prop="pwd" style="width: 420px;">
          <el-input v-model="temp.pwd" placeholder="默认密码: jiatui999, 不填不处理"/>
        </el-form-item>
        <el-form-item label="角色" prop="roles">
          <el-checkbox :indeterminate="isIndeterminateRole" v-model="checkAllRole" @change="handleCheckAllRoleChange">全选</el-checkbox>
          <div style="margin: 15px 0;" />
          <el-checkbox-group v-model="temp.roles" class="float-left" @change="handleCheckedRoleChange">
            <el-checkbox v-for="item in roleList" :label="item.id" :key="item.id" :value="item.id" border>{{ item.name }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="权限" prop="permissions">
          <el-checkbox :indeterminate="isIndeterminatePermision" v-model="checkAllPermission" @change="handleCheckAllPermissionChange">全选</el-checkbox>
          <div style="margin: 15px 0;" />
          <el-checkbox-group v-model="temp.permissions" class="float-left" @change="handleCheckedPermissionChange">
            <el-checkbox v-for="item in permissionList" :label="item.code" :key="item.code" :value="item.code" border>{{ item.name }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">{{ $t('table.confirm') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { index, create, update, remove } from '@/api/users'
import { index as permissionIndex } from '@/api/permission'
import { all as roleIndex } from '@/api/roles'
import waves from '@/directive/waves' // 水波纹指令
import { j2arr } from '@/utils/index'

export default {
  name: 'UsersIndex',
  directives: {
    waves
  },
  data() {
    return {
      list: [],
      roleList: [],
      permissionList: [],
      total: 0,
      listLoading: false,
      listQuery: {
        page: 1,
        page_size: 10,
        name: null
      },
      dialogFormVisible: false,
      textMap: {
        update: '修改',
        create: '添加'
      },
      dialogStatus: '',
      rules: {
        account: [{ required: true, message: 'account is required', trigger: 'blur' }]
      },
      temp: {
        sid: undefined,
        account: '',
        pwd: '',
        roles: [],
        permissions: []
      },
      checkAllPermission: false,
      isIndeterminatePermision: false,
      checkAllRole: false,
      isIndeterminateRole: false
    }
  },
  created() {
    this.getList()
    this.getRoleList()
    this.getPermissionList()
  },
  methods: {
    getList() {
      this.listLoading = true
      index(this.listQuery).then(response => {
        this.list = response.data.list
        this.total = response.data.total
        this.listLoading = false
      })
    },
    getPermissionList() {
      permissionIndex().then(response => {
        this.permissionList = response.data
      })
    },
    getRoleList() {
      roleIndex().then(response => {
        this.roleList = response.data
      })
    },
    fuzzySearch() {
      this.listQuery.page = 1
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.page_size = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const { account, pwd } = this.temp
          let { permissions, roles } = this.temp
          permissions = permissions.join(',')
          roles = roles.join(',')
          const data = { account, permissions, roles }
          pwd !== '' ? data.pwd = pwd : false
          create(data).then(response => {
            this.getList()
            this.dialogFormVisible = false
            this.$message({
              title: '成功',
              message: '创建成功',
              type: 'success'
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.resetTemp()
      console.log(this.temp)
      console.log(row)
      this.temp = Object.assign({ account: row.nickname }, row)
      this.temp.permissions = j2arr(this.temp.permissions, 'code')
      this.temp.roles = j2arr(this.temp.roles, 'id')
      this.handleCheckedPermissionChange(this.temp.permissions)
      this.handleCheckedRoleChange(this.temp.roles)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const { sid, account, pwd } = this.temp
          let { permissions, roles } = this.temp
          permissions = permissions.join(',')
          roles = roles.join(',')
          const data = { account, permissions, roles }
          pwd !== '' ? data.pwd = pwd : false
          update({ id: sid, pwd, permissions, roles }).then(() => {
            this.getList()
            this.dialogFormVisible = false
            this.$message({
              title: '成功',
              message: '更新成功',
              type: 'success'
            })
          })
        }
      })
    },
    handleRemove(row) {
      const h = this.$createElement
      this.$confirm(h('p', null, [
        h('span', null, '确定删除 '),
        h('i', { style: 'color: #f56c6c' }, row.nickname),
        h('span', null, ' 吗?')]), '危险操作!', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        remove({
          sid: row.sid
        }).then(response => {
          const { page, page_size } = this.listQuery
          if (page * page_size <= this.total && page > 1) {
            this.listQuery.page -= 1
          }
          this.getList()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleCheckAllPermissionChange(val) {
      this.temp.permissions = val ? j2arr(this.permissionList, 'code') : []
      this.isIndeterminatePermision = false
    },
    handleCheckedPermissionChange(value) {
      const checkedCount = value.length
      this.checkAllPermission = checkedCount === this.permissionList.length
      this.isIndeterminatePermision = checkedCount > 0 && checkedCount < this.permissionList.length
    },
    handleCheckAllRoleChange(val) {
      this.temp.roles = val ? j2arr(this.roleList, 'id') : []
      this.isIndeterminateRole = false
    },
    handleCheckedRoleChange(value) {
      const checkedCount = value.length
      this.checkAllRole = checkedCount === this.roleList.length
      this.isIndeterminateRole = checkedCount > 0 && checkedCount < this.roleList.length
    },
    resetTemp() {
      this.temp = {
        sid: undefined,
        account: '',
        pwd: '',
        roles: [],
        permissions: []
      }
      this.checkAllPermission = false
      this.isIndeterminatePermision = false
      this.checkAllRole = false
      this.isIndeterminateRole = false
    }
  }
}
</script>

<style scoped>
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
.float-left .el-checkbox {
  margin-left: 0px !important;
  margin-right: 10px;
  margin-bottom: 10px;
}
</style>
