<template>
  <div class="employee-container">
    <!-- 搜索区域 -->
    <div class="search-container">
      <div class="search-label">员工姓名：</div>
      <el-input clearable placeholder="请输入内容" class="search-main" />
      <el-button type="primary">查询</el-button>
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
            <el-button size="mini" type="text">编辑</el-button>
            <el-button size="mini" type="text" @click="delEmployee(scope.row.id)">删除</el-button>
            <el-button size="mini" type="text">重置密码</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="page-container">
      <el-pagination
        layout="total, prev, pager, next"
      />
    </div>
    <!-- 分页器 -->
    <el-pagination
      layout="total, prev, pager, next"
      :page-size="params.pageSize"
      :total="total"
      @current-change="pageChange"
    />
    <!-- 添加员工 -->
    <el-dialog
      title="添加员工"
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
import { getEmployeeListAPI, createEmployeeAPI, delEmployeeAPI } from '@/api/employee'
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
  mounted() {
    this.getEmployeeList() // 渲染列表
  },
  methods: {
    async getEmployeeList() {
      const res = await getEmployeeListAPI(this.params)
      this.employeeList = res.data.rows
      this.total = res.data.total
    },
    pageChange(page) {
      this.params.page = page
      this.getEmployeeList()
    },
    // 关闭弹框
    closeDialog() {
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
    // 添加员工
    async confirmAdd() {
      await this.$refs.addForm.validate()

      // 1. 调用接口
      await createEmployeeAPI(this.addForm)
      // 2. 关闭弹框
      this.dialogVisible = false
      // 3. 重新刷新列表
      this.getEmployeeList()
      // 提示
      this.$message.success('添加员工成功')
      // 4. 清空表单记录
      this.addForm = {
        name: '',
        phonenumber: '',
        roleId: '',
        status: 1,
        userName: ''
      }
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
        this.getEmployeeList()
      })
    },
    // 适配员工状态处理函数
    formatStatus(status) {
      return status === 1 ? '启用' : '禁用'
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
