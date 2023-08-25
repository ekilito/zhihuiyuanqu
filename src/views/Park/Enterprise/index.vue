<template>
  <div class="building-container">
    <!-- 搜索区域 -->
    <div class="search-container">
      <div class="search-label">企业名称：</div>
      <el-input v-model="params.name" clearable placeholder="请输入内容" class="search-main" @clear="clearSearch" />
      <el-button type="primary" @click="doSearch">查询</el-button>
    </div>
    <div class="create-container">
      <el-button type="primary" @click="$router.push('/addEnterprise')">添加企业</el-button>
    </div>
    <!-- 表格区域 -->
    <div class="table">
      <el-table style="width: 100%" :data="exterpriseList">
        <el-table-column type="index" label="序号" />
        <el-table-column label="企业名称" width="320" prop="name" />
        <el-table-column label="联系人" prop="contact" />
        <el-table-column
          label="联系电话"
          prop="contactNumber"
        />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button size="mini" type="text">添加合同</el-button>
            <el-button size="mini" type="text">查看</el-button>
            <el-button size="mini" type="text" @click="editRent(scope.row.id)">编辑</el-button>
            <el-button size="mini" type="text" @click="delExterprise(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页器 -->
    <div class="page-container">
      <el-pagination
        layout="total, prev, pager, next"
        :total="total"
        :page-size="params.pageSize"
        @current-change="pageChange"
      />
    </div>
  </div>
</template>

<script>
import { getEnterpriseListAPI, delExterpriseAPI } from '@/api/enterprise'
export default {
  data() {
    return {
      exterpriseList: [], // 企业列表
      params: {
        name: '', // 增加字段name 搜索
        page: 1, // 默认显示第一页
        pageSize: 10 // 每页显示的条数
      },
      total: 0 // 总条数 接收接口的总条数
    }
  },

  mounted() {
    this.getExterpriseList()
  },
  methods: {
    // 获取公司列表
    async getExterpriseList() {
      const res = await getEnterpriseListAPI(this.params)
      this.exterpriseList = res.data.rows
      this.total = res.data.total
    },
    // 分页的逻辑
    pageChange(page) {
      // 更改参数
      this.params.page = page
      // 重新获取数据渲染
      this.getExterpriseList()
    },
    // 查询后调方法
    doSearch() {
      this.params.page = 1
      this.getExterpriseList()
    },
    // 点击x重新拉取全部企业
    clearSearch() {
      this.getExterpriseList()
    },
    // 编辑逻辑
    editRent(id) {
      this.$router.push({
        path: '/addenterprise',
        query: {
          id
        }
      })
    },
    delExterprise(id) {
      this.$confirm('确认删除该企业吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await delExterpriseAPI(id)
        this.getExterpriseList()
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.department-container {
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
