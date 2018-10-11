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

    <el-table v-loading.body="listLoading" :data="list" border fit highlight-current-row style="width: 100%;">
      <el-table-column align="center" label="ID" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="PID" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.pid }}</span>
        </template>
      </el-table-column>
      <el-table-column align="left" label="Permission">
        <template slot-scope="scope">
          <el-tag :type="scope.row.permission.code !== '0' ? '': 'info' " size="mini" class="board-item" style="margin-left: 5px;">
            {{ scope.row.permission.name }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="left" label="Name">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column align="left" label="Title">
        <template slot-scope="scope">
          {{ scope.row.extend.meta.title }}
        </template>
      </el-table-column>
      <el-table-column align="left" label="Path">
        <template slot-scope="scope">
          <span style="color: #409eff">{{ scope.row.extend.path }}</span>
        </template>
      </el-table-column>
      <el-table-column align="left" label="Icon">
        <template slot-scope="scope">
          <svg-icon :icon-class="scope.row.extend.meta.icon" class-name="international-icon" />
          <span style="padding-left: 5px;">{{ scope.row.extend.meta.icon }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Hidden" width="80">
        <template slot-scope="scope">
          <el-tag :type="scope.row.extend.hidden?'success':'info'" size="mini">{{ scope.row.extend.hidden }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="AlwaysShow" width="120">
        <template slot-scope="scope">
          <el-tag :type="scope.row.extend.alwaysShow?'success':'info'" size="mini">{{ scope.row.extend.alwaysShow }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column width="180px" align="center" label="Updated Date">
        <template slot-scope="scope">
          <span>{{ scope.row.m_time | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="Actions">
        <template slot-scope="scope">
          <el-button v-waves type="primary" size="mini" @click="handleUpdate(scope.row)">{{ $t('table.edit') }}</el-button>
          <el-button v-waves type="danger" size="mini" @click="handleRemove(scope.row)">{{ $t('table.delete') }}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination
        :current-page="listQuery.page"
        :page-sizes="[10,20,30,50,100]"
        :page-size="listQuery.page_size"
        :total="total"
        background
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange" />
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="768px">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="140px">
        <el-form-item label="父级菜单(pid)" prop="pid" style="width: 420px;">
          <el-input v-model.number="temp.pid" placeholder="默认0, 表示根菜单" />
        </el-form-item>
        <el-form-item label="序号(sort)" prop="sort" style="width: 420px;">
          <el-input v-model.number="temp.sort" placeholder="默认0, 数值越大越靠前" />
        </el-form-item>
        <el-form-item label="名称(name)" prop="name" style="width: 420px;">
          <el-input v-model="temp.name" placeholder="路由标识(必须英文, 与前端定义一致)" />
        </el-form-item>
        <el-form-item label="路径(path)" prop="path" style="width: 420px;">
          <el-input v-model="temp.path" placeholder="路径(必须英文, 与前端定义一致)" />
        </el-form-item>
        <el-form-item label="标题(title)" prop="title" style="width: 420px;">
          <el-input v-model="temp.title" placeholder="显示文字, 可写中文, 可配置多语言key" />
        </el-form-item>
        <el-form-item label="图标(icon)" prop="icon" style="width: 420px;">
          <el-input v-model="temp.icon" placeholder="图标, 对应前端svg图标资源, 例如: example" />
        </el-form-item>
        <el-form-item label="是否隐藏(hidden)" prop="hidden" style="width: 420px;">
          <el-switch
            v-model="temp.hidden"
            active-text="是"
            inactive-text="否" />
        </el-form-item>
        <el-form-item label="常驻菜单(alwaysShow)" prop="alwaysShow" style="width: 420px;">
          <el-switch
            v-model="temp.alwaysShow"
            active-text="是"
            inactive-text="否" />
        </el-form-item>
        <el-form-item label="可访问权限" prop="permission" class="float-left">
          <el-radio v-model="temp.permission.code" :key="0" label="0" border>无需权限</el-radio>
          <el-radio v-for="item in permissionList" v-model="temp.permission.code" :key="item.code" :label="item.code" border>{{ item.name }}</el-radio>
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
import { index, create, update, remove } from '@/api/menus'
import { index as permissionIndex } from '@/api/permission'
import waves from '@/directive/waves' // 水波纹指令

export default {
  name: 'MenusIndex',
  directives: {
    waves
  },
  data() {
    return {
      list: [],
      permissionList: [],
      total: 0,
      listLoading: false,
      listQuery: {
        page: 1,
        page_size: 100,
        name: null
      },
      dialogFormVisible: false,
      textMap: {
        update: '修改',
        create: '添加'
      },
      dialogStatus: '',
      rules: {
        pid: [{
          required: true,
          message: 'pid is 必填',
          trigger: 'blur'
        }, {
          type: 'number',
          message: 'pid is 必须为数字',
          trigger: ['blur', 'change']
        }],
        sort: [{
          required: true,
          message: 'sort is 必填',
          trigger: 'blur'
        }, {
          type: 'number',
          message: 'sort is 必须为数字',
          trigger: ['blur', 'change']
        }],
        name: [{
          required: true,
          message: 'name is 必填',
          trigger: 'blur'
        }],
        title: [{
          required: true,
          message: 'title is 必填',
          trigger: 'blur'
        }],
        path: [{
          required: true,
          message: 'path is 必填',
          trigger: 'blur'
        }]
      },
      temp: {
        id: undefined,
        pid: null,
        name: '',
        permission: {
          code: '0'
        },
        path: null,
        sort: null,
        title: '',
        hidden: false,
        alwaysShow: true,
        icon: ''
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
        this.list = response.data.map(item => {
          item.extend = JSON.parse(item.extend)
          item.permission = Object.keys(item.permission).length !== 0 ? item.permission : { code: '0', name: '无需权限' }
          return item
        })
        // this.total = response.data.total
        this.listLoading = false
      })
    },
    fuzzySearch() {
      this.listQuery.page = 1
      this.getList()
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
          const { pid, name, sort, path, title, icon, hidden, alwaysShow, permission } = this.temp
          const extend = {
            hidden,
            alwaysShow,
            path,
            meta: {
              title,
              icon
            }
          }
          const data = {
            name,
            pid,
            permission: parseInt(permission.code),
            sort,
            extend: JSON.stringify(extend)
          }
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
      this.temp = Object.assign({
        title: row.extend.meta.title,
        icon: row.extend.meta.icon,
        hidden: row.extend.hidden,
        alwaysShow: row.extend.alwaysShow,
        path: row.extend.path
      }, row)
      this.temp.id = this.temp.id.toString()
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const { id, pid, name, sort, path, title, icon, hidden, alwaysShow, permission } = this.temp
          const extend = {
            hidden,
            alwaysShow,
            path,
            meta: {
              title,
              icon
            }
          }
          const data = {
            id,
            name,
            pid,
            permission: parseInt(permission.code),
            sort,
            extend: JSON.stringify(extend)
          }
          update(data).then(() => {
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
    resetTemp() {
      this.temp = {
        id: undefined,
        pid: null,
        name: '',
        permission: {
          code: '0'
        },
        path: null,
        sort: null,
        hidden: false,
        alwaysShow: true,
        title: '',
        icon: ''
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
.float-left .el-radio {
  margin-left: 0px !important;
  margin-right: 10px;
  margin-bottom: 10px;
}
</style>
