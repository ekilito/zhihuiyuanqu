<template>
  <div class="card-container">
    <!-- 搜索区域 -->
    <!--
    思路分析：把各种搜索条件当作请求参数发给后端 后端会根据字段对数据库数据做过滤筛选拿到符合条件返回
      1. 表单组件的双向绑定收集到当前的请求数据
      2. 把收集到的表单参数发送接口给后端那符合条件的数据
      3. 把拿到的数据关系显示在列表中

 -->
    <div class="search-container">
      <span class="search-label">车牌号码：</span>
      <el-input v-model="params.carNumber" clearable placeholder="请输入内容" class="search-main" />
      <span class="search-label">车主姓名：</span>
      <el-input v-model="params.personName" clearable placeholder="请输入内容" class="search-main" />
      <span class="search-label">状态：</span>
      <!--
         el-select: 双向绑定收集当前选中的数据
         el-option： 下拉框中的每一项
          label（中文显示）
          value （选中之后赋值给v-model的数据将来传给后端）
     -->
      <el-select v-model="params.cardStatus">
        <el-option
          v-for="item in cardStatusList"
          :key="item.id"
          :value="item.id"
          :label="item.name"
        />
      </el-select>
      <el-button type="primary" class="search-btn" @click="doSearch">查询</el-button>
    </div>
    <!-- 新增删除操作区域 -->
    <div class="create-container">
      <el-button type="primary" @click="$router.push('/addCard')">添加月卡</el-button>
      <el-button>批量删除</el-button>
    </div>
    <!-- 表格区域 -->
    <div class="table">
      <el-table style="width: 100%" :data="cardList">
        <el-table-column type="index" label="序号" />
        <!-- 通过 prop 渲染 -->
        <el-table-column label="车主名称" prop="personName" />
        <el-table-column label="联系方式" prop="phoneNumber" />
        <el-table-column label="车牌号码" prop="carNumber" />
        <el-table-column label="车辆品牌" prop="carBrand" />
        <el-table-column label="剩余有效天数" prop="totalEffectiveDate" />
        <!--
        实现目标：
          0 - 有效
          1 - 已过期
      -->
        <el-table-column label="状态" prop="cardStatus" :formatter="formatStatus" />
        <el-table-column label="操作" fixed="right" width="180">
          <template #default="scope">
            <el-button size="mini" type="text">续费</el-button>
            <el-button size="mini" type="text">查看</el-button>
            <el-button size="mini" type="text">编辑</el-button>
            <el-button size="mini" type="text">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页器 -->
    <!--
   1. 页数分出来 （页数 = 总条数 / 每页条数）
   2. 点击每页的时候获取当前页的数据重新渲染到table上
-->
    <div class="page-container">
      <el-pagination
        layout="total, prev, pager, next"
        :page-size="params.pageSize"
        :total="total"
        @current-change="pageChange"
      />
    </div>
    <!-- 添加弹框 -->
    <el-dialog
      title="添加月卡"
      width="580px"
    >
      <!-- 表单接口 -->
      <div class="form-container">
        <!-- <el-form ref="addForm" :model="addForm" :rules="addFormRules">
          <el-form-item label="楼宇名称" prop="name">
            <el-input v-model="addForm.name" />
          </el-form-item>
          <el-form-item label="楼宇层数" prop="floors">
            <el-input v-model="addForm.floors" />
          </el-form-item>
          <el-form-item label="在管面积" prop="area">
            <el-input v-model="addForm.area" />
          </el-form-item>
          <el-form-item label="物业费" prop="propertyFeePrice">
            <el-input v-model="addForm.propertyFeePrice" />
          </el-form-item>
        </el-form> -->
      </div>
      <template #footer>
        <el-button size="mini">取 消</el-button>
        <el-button size="mini" type="primary">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { getCardListAPI } from '@/api/card.js'
export default {
  data() {
    return {
      // 请求参数
      params: {
        page: 1, // 默认页数
        pageSize: 5, // 默认条数
        carNumber: null,
        personName: null,
        cardStatus: null
      },
      // 接收接口返回的月卡列表
      cardList: [],
      total: 0, // 总条数
      // 月卡状态
      cardStatusList: [
        {
          id: null,
          name: '全部'
        },
        {
          id: 0,
          name: '可用'
        },
        {
          id: 1,
          name: '已过期'
        }
      ]
    }
  },
  mounted() {
    this.getCardList()
  },
  methods: {
    async getCardList() {
      // 1. 调用接口
      const res = await getCardListAPI(this.params)
      // 2. 把后端的数据赋值给响应式cardList
      this.cardList = res.data.rows
      this.total = res.data.total
    },
    // 格式化方法
    formatStatus(row) {
      // console.log(row.cardStatus) // 0 1
      // 解决方法： 通过映射的方式做匹配
      //  const MAP = {
      //    0: '可用',
      //    1: '已过期'
      //  }
      // return的数据就是要渲染到当前列的数据
      //  return MAP[row.cardStatus]
      return row.cardStatus === 0 ? '有效' : '已过期'
    },
    // 分页
    pageChange(page) {
    // console.log(page) // 回调参数 拿到的是当前页
    // 把点击的页数赋值给请求参数页数
      this.params.page = page
      // 使用最新的请求参数获取列表数据
      this.getCardList()
    },
    // 搜索
    doSearch() {
      // 调用接口之前把页数参数重置为1
      this.params.page = 1
      this.getCardList()
    }
  }
}
</script>

<style lang="scss" scoped>
.card-container {
  padding: 20px;
  background-color: #fff;
}

.search-container {
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgb(237, 237, 237, .9);
  padding-bottom: 20px;
  .search-main {
    width: 220px;
    margin-right: 10px;
  }
  .search-btn{
    margin-left:20px;
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
