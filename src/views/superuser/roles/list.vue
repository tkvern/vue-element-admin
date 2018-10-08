<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input :placeholder="$t('table.name')" v-model="listQuery.name" style="width: 200px;" class="filter-item"/>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search">{{ $t('table.search') }}</el-button>
      <el-button v-waves class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">{{ $t('table.add') }}</el-button>
    </div>

    <el-table v-loading.body="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="ID" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Name">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Permission">
        <template slot-scope="scope">
          <span>{{ scope.row.permission }}</span>
        </template>
      </el-table-column>
      <el-table-column width="180px" align="center" label="Created Date">
        <template slot-scope="scope">
          <span>{{ scope.row.c_time | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column width="180px" align="center" label="Updated Date">
        <template slot-scope="scope">
          <span>{{ scope.row.m_time | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="Actions">
        <template slot-scope="scope">
          <el-button v-waves type="primary" size="mini">{{ $t('table.edit') }}</el-button>
          <el-button v-waves :disabled="scope.row.id === 1" type="danger" size="mini" @click="removeData(scope.row)">{{ $t('table.delete') }}</el-button>
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

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="45%">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="70px">
        <el-form-item :label="$t('table.name')" prop="name" style="width: 80%;">
          <el-input v-model="temp.name"/>
        </el-form-item>
        <el-form-item label="权限" prop="permissions">
          <el-checkbox :indeterminate="temp.isIndeterminate" v-model="temp.checkAll" @change="handleCheckAllPermissionChange">全选</el-checkbox>
          <div style="margin: 15px 0;" />
          <el-checkbox-group v-model="temp.permissions" @change="handleCheckedPermissionChange">
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
import { index, create, remove } from '@/api/roles'
import { index as permissionIndex } from '@/api/permission'
import waves from '@/directive/waves' // 水波纹指令
import { j2arr } from '@/utils/index'

export default {
  name: 'RolesList',
  directives: {
    waves
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      permissionList: null,
      total: 0,
      listLoading: false,
      listQuery: {
        page: 1,
        page_size: 50
      },
      dialogFormVisible: false,
      textMap: {
        update: '修改',
        create: '添加'
      },
      dialogStatus: '',
      rules: {
        name: [{ required: true, message: 'name is required', trigger: 'blur' }]
      },
      statusOptions: ['published', 'draft', 'deleted'],
      temp: {
        id: undefined,
        name: '',
        permissions: [],
        checkAll: false,
        isIndeterminate: false
      }
    }
  },
  created() {
    this.getList()
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
          // this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          // this.temp.author = 'vue-element-admin'
          const { name } = this.temp
          let { permissions } = this.temp
          permissions = permissions.join(',')
          create({ name, permissions }).then(response => {
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
    removeData(row) {
      const h = this.$createElement
      this.$confirm(h('p', null, [
        h('span', null, '确定删除 '),
        h('i', { style: 'color: #f56c6c' }, row.name),
        h('span', null, ' 吗?')]), '危险操作!', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        remove({
          id: row.id
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
      this.isIndeterminate = false
    },
    handleCheckedPermissionChange(value) {
      const checkedCount = value.length
      this.temp.checkAll = checkedCount === this.permissionList.length
      this.temp.isIndeterminate = checkedCount > 0 && checkedCount < this.permissionList.length
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        name: '',
        permissions: [],
        checkAll: false,
        isIndeterminate: false
      }
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
</style>
