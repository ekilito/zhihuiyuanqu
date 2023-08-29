<template>
  <div class="building-container">
    <!-- 搜索区域 -->
    <div class="search-container">
      <el-button type="primary">添加区域</el-button>
    </div>
    <!-- 表格区域 -->
    <div class="table">
      <el-table
        style="width: 100%"
        :data="carAreaList"
      >
        <el-table-column
          type="index"
          label="序号"
          width="100"
        />
        <el-table-column
          label="区域名称"
          width="180"
          prop="areaName"
        />
        <el-table-column
          label="车位数(个)"
          prop="spaceNumber"
        />
        <el-table-column
          label="面积(m²)"
          width="120"
          prop="areaProportion"
        />
        <el-table-column
          label="计费规则"
          width="120"
          prop="ruleName"
        />
        <el-table-column
          label="备注"
          prop="remark"
        />
        <el-table-column
          label="操作"
        >
          <template #default="scope">
            <el-button
              size="mini"
              type="text"
            >编辑</el-button>
            <el-button
              size="mini"
              type="text"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>

    </div>
    <!-- 分页 -->
    <div class="page-container">
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
  </div>
</template>

<script>
import { getAreaListAPI } from '@/api/area'
export default {
  name: 'CarArea',
  data() {
    return {
      carAreaList: [],
      // 请求参数
      params: {
        page: 1,
        pageSize: 10
      },
      total: 0
    }
  },
  created() {
    this.getCarAreaList()
  },
  methods: {
    async getCarAreaList() {
      const res = await getAreaListAPI(this.params)
      this.carAreaList = res.data.rows
      // console.log(this.carAreaList)
      this.total = res.data.total
    },
    handleSizeChange(val) {
      this.params.pageSize = val
      this.getCarAreaList()
      // console.log(`每页 ${val} 条`)
    },

    pageChange(page) {
      this.params.page = page
      this.getCarAreaList()
    }
  }
}
</script>

<style lang="scss" scoped>
.department-container{
  padding:10px;
}
.search-container{
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgb(237,237,237,.9);;
  padding-bottom: 20px;
  .search-label{
    width:100px;
  }
  .search-main{
    width: 220px;
    margin-right: 10px;
  }
}
.page-container{
    padding:4px 0px;
    text-align: right;
  }
</style>
