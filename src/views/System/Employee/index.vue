<template>
  <div class="employee-container">
    <!-- 搜索区域 -->
    <div class="search-container">
      <div class="search-label">员工姓名：</div>
      <el-input v-model="params.name" clearable placeholder="请输入内容" class="search-main" @clear="clearSearch" />
      <el-button type="primary" @click="initData">查询</el-button>
    </div>
    <div class="create-container">
      <el-button type="primary" @click="addEmployee">添加员工</el-button>
    </div>
    <!-- 表格区域 -->
    <div class="table">
      <el-table style="width: 100%" :data="employeeList">
        <el-table-column type="index" label="序号" width="100" />
        <el-table-column label="员工姓名" width="140" prop="name" />
        <el-table-column label="登录账号" width="140" prop="userName" />
        <el-table-column label="联系方式" width="180" prop="phonenumber" />
        <el-table-column label="角色" width="200" prop="roleName" />
        <el-table-column label="状态" width="120">
          <template #default="scope">
            {{ formatStatus(scope.row.status) }}
          </template>
        </el-table-column>
        <el-table-column label="添加时间" prop="createTime" width="180" />
        <el-table-column label="操作" fixed="right" width="220">
          <template #default="scope">
            <el-button size="mini" type="text" @click="edit(scope.row.id)">编辑</el-button>
            <el-button size="mini" type="text" @click="delEmployee(scope.row.id)">删除</el-button>
            <el-button size="mini" type="text" @click="resetPassword(scope.row.id)">重置密码</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="page-container">
      <!-- 分页器 -->
      <el-pagination
        :current-page="params.page"
        layout="total, sizes,prev, pager, next"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="params.pageSize"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="pageChange"
      />
    </div>
    <!-- 添加员工 -->
    <el-dialog
      :title="employeeType"
      width="480px"
      :visible="dialogVisible"
      @close="closeDialog"
      @open="openDialog"
    >
      <!-- 表单接口 -->
      <div class="form-container">
        <el-form ref="addForm" :model="addForm" :rules="addFormRules" label-width="80px">
          <el-form-item label="员工姓名" prop="name">
            <el-input v-model="addForm.name" />
          </el-form-item>
          <el-form-item label="登录账号" prop="userName">
            <el-input v-model="addForm.userName" />
          </el-form-item>
          <el-form-item label="联系方式" prop="phonenumber">
            <el-input v-model="addForm.phonenumber" />
          </el-form-item>
          <el-form-item label="分配角色" prop="roleId">
            <el-select v-model="addForm.roleId" placeholder="请选择角色">
              <el-option
                v-for="item in roleList"
                :key="item.roleId"
                :label="item.roleName"
                :value="item.roleId"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="员工状态" prop="status">
            <el-radio-group v-model="addForm.status">
              <el-radio :label="0">禁用</el-radio>
              <el-radio :label="1">启用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <el-button size="mini" @click="dialogVisible = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="confirmAdd">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { getEmployeeListAPI, createEmployeeAPI, delEmployeeAPI, userdetailsAPI, editUserAPI, resetPasswordAPI } from '@/api/employee'
import { getRoleListAPI } from '@/api/system'
export default {
  name: 'Employee',
  data() {
    return {
      employeeList: [], // 表单数据
      params: {
        page: 1,
        pageSize: 10,
        name: '' // 员工姓名
      },
      total: 0, // 总条数
      dialogVisible: false, // 控制弹框打开关闭
      roleList: [], // 角色列表
      addForm: {
        name: '',
        phonenumber: '',
        roleId: '',
        status: 1,
        userName: ''
      },
      addFormRules: {
        name: [
          { required: true, message: '请输入员工姓名', trigger: 'blur' }
        ],
        userName: [
          { required: true, message: '请输入登录账号', trigger: 'blur' }
        ],
        phonenumber: [
          { required: true, message: '请输入联系方式', trigger: 'blur' }
        ],
        roleId: [
          { required: true, message: '请分配角色', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择员工状态', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    employeeType() {
      if (this.addForm.id) {
        return '编辑员工'
      } else {
        return '添加员工'
      }
    }

  },
  created() {
    this.initData()
  },
  methods: {
  // 初始化渲染列表
    async initData() {
      const res = await getEmployeeListAPI(this.params)
      // console.log(res)
      this.employeeList = res.data.rows
      this.total = res.data.total
    },
    handleSizeChange(val) {
      this.params.pageSize = val
      this.initData()
      // console.log(`每页 ${val} 条`)
    },

    pageChange(page) {
      this.params.page = page
      this.initData()
    },
    // 关闭弹框
    closeDialog() {
      this.addForm = {
        name: '',
        phonenumber: '',
        roleId: '',
        status: null,
        userName: ''
      }
      this.$refs.addForm.resetFields()
      this.dialogVisible = false
    },

    // 打开弹框
    addEmployee() {
      this.dialogVisible = true
    },
    // 当打开的弹框的时候触发
    async openDialog() {
      const res = await getRoleListAPI()
      this.roleList = res.data
    },
    // 添加员工 / 编辑
    async confirmAdd() {
      await this.$refs.addForm.validate()

      if (this.addForm.id) {
        await editUserAPI(this.addForm)
        this.$message.success('编辑成功')
      } else {
        // 1. 调用接口
        await createEmployeeAPI(this.addForm)
        // 提示
        this.$message.success('添加员工成功')
      }
      // 2. 关闭弹框
      this.dialogVisible = false
      // 3. 重新刷新列表
      this.initData()

      // 4. 清空表单记录
      this.closeDialog()
    },
    // 删除员工
    delEmployee(id) {
      this.$confirm('删除员工后将不可登录，确认删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await delEmployeeAPI(id)
        this.$message({
          type: 'success',
          message: '删除员工成功'
        })
        this.initData()
      })
    },
    // 适配员工状态处理函数
    formatStatus(status) {
      return status === 1 ? '启用' : '禁用'
    },
    // 点击x重新拉取全部企业
    clearSearch() {
      this.initData()
    },
    // 点击编辑
    async edit(id) {
      this.dialogVisible = true
      const res = await userdetailsAPI(id)
      // const row = await getRoleListAPI()
      // this.roleList = row.data
      // console.log(res)
      this.addForm = {
        name: res.data.name,
        phonenumber: res.data.phonenumber,
        roleName: res.data.roleName,
        roleId: res.data.roleId,
        status: res.data.status,
        userName: res.data.userName,
        id: id
      }
    },
    //  重置密码
    resetPassword(id) {
      this.$confirm('是否重置密码为123456?', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          await resetPasswordAPI(id)
          this.$message({
            type: 'success',
            message: '重置成功!'
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消重置'
          })
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.employee-container {
  padding: 10px;
}

.search-container {
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgb(237, 237, 237, .9);
  ;
  padding-bottom: 20px;

  .search-label {
    width: 100px;
  }

  .search-main {
    width: 220px;
    margin-right: 10px;
  }
}
.create-container{
  margin: 10px 0px;
}
.page-container{
  padding:4px 0px;
  text-align: right;
}
.form-container{
  padding:0px 80px;
}
</style>
