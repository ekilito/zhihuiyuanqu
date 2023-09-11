<template>
  <div class="building-container">
    <!-- 搜索区域 -->
    <div class="search-container">
      <span class="search-label">一体杆名称：</span>
      <el-input v-model="params.poleName" clearable placeholder="请输入一体杆名称" class="search-main" @clear="doSearch" />
      <span class="search-label">一体杆编号：</span>
      <el-input v-model="params.poleNumber" clearable placeholder="请输入一体杆编号" class="search-main" @clear="doSearch" />
      <span class="search-label">处置状态：</span>

      <!--
         el-select: 双向绑定收集当前选中的数据
         el-option： 下拉框中的每一项
          label（中文显示）
          value （选中之后赋值给v-model的数据将来传给后端）
     -->
      <el-select v-model="params.handleStatus">
        <el-option
          v-for="item in warnStatusList"
          :key="item.id"
          :value="item.id"
          :label="item.name"
        />
      </el-select>
      <el-button type="primary" style="margin-left: 18px;" @click="doSearch">查询</el-button>
    </div>
    <!-- 表格区域 -->
    <div class="table">
      <el-table
        style="width: 100%"
        :data="warnList"
      >
        <el-table-column
          type="index"
          label="序号"
          width="80"
        />
        <el-table-column
          label="一体杆名称"
          width="180"
          prop="poleName"
        />
        <el-table-column
          label="一体杆编号"
          prop="poleNumber"
        />
        <el-table-column
          label="故障类型"
          width="120"
          prop="errorType"
        />
        <el-table-column
          label="处置状态"
          prop="handleStatus"
        ><template #default="scope">
          {{ formatStatus(scope.row.handleStatus) }}
        </template>
        </el-table-column>
        <el-table-column
          label="告警时间"
          prop="warningTime"
        />
        <el-table-column label="操作">
          <template #default="">
            <el-button
              size="mini"
              type="text"
            >派单</el-button>
            <el-button
              size="mini"
              type="text"
            >详情</el-button>
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
        layout="total,prev, pager, next"
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
import { getWarningListAPI } from '@/api/warning'
export default {
  name: 'RodWarn',
  data() {
    return {
      warnList: [],
      params: { // 请求参数
        page: 1,
        pageSize: 4,
        poleName: '',
        poleNumber: '',
        handleStatus: null
      },
      total: 0,
      // 处置状态 0:未派单,1:已派单,2:已接单,3:已完成
      warnStatusList: [
        {
          id: null,
          name: '全部'
        },
        {
          id: 0,
          name: '未派单'
        },
        {
          id: 1,
          name: '已派单'
        },
        {
          id: 2,
          name: '已接单'
        },
        {
          id: 3,
          name: '已完成'
        }
      ]

    }
  },
  created() {
    this.getWarningList()
  },
  methods: {
    async getWarningList() {
      const res = await getWarningListAPI(this.params)
      this.warnList = res.data.rows
      // console.log(this.carpayList)
      this.total = res.data.total
      //  console.log(this.total)
    },
    formatStatus(status) {
      const statusMap = {
        0: '未派单',
        1: '已派单',
        2: '已接单',
        3: '已完成'
      }
      return statusMap[status]
    },
    // 分页
    handleSizeChange(val) {
      this.params.pageSize = val
      this.getWarningList()
      // console.log(`每页 ${val} 条`)
    },

    pageChange(page) {
      this.params.page = page
      this.getWarningList()
    },
    // 模糊搜索
    doSearch() {
      // 1. 重置page为1
      this.params.page = 1
      // 2. 调用获取列表接口
      this.getWarningList()
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
