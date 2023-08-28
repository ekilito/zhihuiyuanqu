<template>
  <div class="employee-container">
    <!-- 搜索区域 -->
    <div class="search-container">
      <div class="search-label">员工姓名：</div>
      <el-input clearable placeholder="请输入内容" class="search-main" />
      <el-button type="primary">查询</el-button>
    </div>
    <div class="create-container">
      <el-button type="primary">添加员工</el-button>
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
            {{ scope.row.status }}
          </template>
        </el-table-column>
        <el-table-column label="添加时间" prop="createTime" width="180" />
        <el-table-column label="操作" fixed="right" width="220">
          <template #default="scope">
            <el-button size="mini" type="text">编辑</el-button>
            <el-button size="mini" type="text">删除</el-button>
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
  </div>
</template>

<script>
import { getEmployeeListAPI } from '@/api/employee'
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
      total: 0 // 总条数
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
