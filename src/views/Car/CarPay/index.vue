<template>
  <div class="building-container">
    <!-- 搜索区域 -->
    <div class="search-container">
      <span class="search-label">车牌号码：</span>
      <el-input v-model="params.carNumber" clearable placeholder="请输入车牌号码" class="search-main" @clear="doSearch" />
      <span class="search-label">缴纳状态：</span>

      <!--
         el-select: 双向绑定收集当前选中的数据
         el-option： 下拉框中的每一项
          label（中文显示）
          value （选中之后赋值给v-model的数据将来传给后端）
     -->
      <el-select v-model="params.paymentStatus">
        <el-option
          v-for="item in payStatusList"
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
        :data="carpayList"
      >
        <el-table-column
          type="index"
          label="序号"
        />
        <el-table-column
          label="车牌号码"
          width="180"
          prop="carNumber"
        />
        <el-table-column
          label="收费类型"
          prop="chargeType"
        ><template #default="scope">
          {{ formatStatusType(scope.row.chargeType) }}
        </template>
        </el-table-column>
        <el-table-column
          label="停车总时常"
          width="120"
          prop="parkingTime"
        />
        <el-table-column
          label="缴纳费用(元)"
          width="120"
          prop="actualCharge"
        />
        <el-table-column
          label="缴纳状态"
          prop="paymentStatus"
        ><template #default="scope">
          {{ formatStatus(scope.row.paymentStatus) }}
        </template>
        </el-table-column>
        <el-table-column
          label="缴纳方式"
          prop="paymentMethod"
        />
        <el-table-column
          label="缴纳时间"
          prop="paymentTime"
        />
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
import { getCarPayListAPI } from '@/api/carpay'
export default {
  name: 'CarPay',
  data() {
    return {
      carpayList: [],
      params: { // 请求参数
        page: 1,
        pageSize: 10,
        carNumber: '',
        paymentStatus: null
      },
      total: 0,
      // 月卡状态
      payStatusList: [
        {
          id: null,
          name: '全部'
        },
        {
          id: 0,
          name: '未缴费'
        },
        {
          id: 1,
          name: '已缴费'
        }
      ]
    }
  },
  created() {
    this.getCarPayList()
  },
  methods: {
    async getCarPayList() {
      const res = await getCarPayListAPI(this.params)
      this.carpayList = res.data.rows
      // console.log(this.carpayList)
      this.total = res.data.total
    },
    formatStatus(status) {
      const statusMap = {
        0: '未缴纳',
        1: '已缴纳'
      }
      return statusMap[status]
    },
    formatStatusType(type) {
      if (type === 'card') {
        return '月卡'
      } else if (type === 'temp') {
        return '临时停车'
      }
    },
    handleSizeChange(val) {
      this.params.pageSize = val
      this.getCarPayList()
      // console.log(`每页 ${val} 条`)
    },

    pageChange(page) {
      this.params.page = page
      this.getCarPayList()
    },
    doSearch() {
      // 1. 重置page为1
      this.params.page = 1
      // 2. 调用获取列表接口
      this.getCarPayList()
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
