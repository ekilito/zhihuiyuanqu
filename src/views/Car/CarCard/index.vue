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
      <el-input
        v-model="params.carNumber"
        clearable
        placeholder="请输入内容"
        class="search-main"
      />
      <span class="search-label">车主姓名：</span>
      <el-input
        v-model="params.personName"
        clearable
        placeholder="请输入内容"
        class="search-main"
      />
      <!-- <span class="search-label">状态：</span>

      <el-select v-model="params.cardStatus">
        <el-option
          v-for="item in cardStatusList"
          :key="item.id"
          :value="item.id"
          :label="item.name"
        />
      </el-select> -->
      <el-button type="primary" class="search-btn" @click="doSearch"
        >查询</el-button
      >
    </div>
    <!-- 新增删除操作区域 -->
    <div class="create-container">
      <el-button type="primary" @click="$router.push('/addCard')"
        >添加车辆</el-button
      >
    </div>
    <!-- 表格区域 -->
    <div class="table">
      <el-table
        style="width: 100%"
        :data="cardList"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column type="index" label="序号" />
        <!-- 通过 prop 渲染 -->
        <el-table-column label="车主名称" prop="personName" />
        <el-table-column label="联系方式" prop="phoneNumber" />
        <el-table-column label="车牌号码" prop="carNumber" />
        <el-table-column label="车辆品牌" prop="carBrand" />
        <!-- <el-table-column label="剩余有效天数" prop="totalEffectiveDate" /> -->
        <!--
        实现目标：
          0 - 有效
          1 - 已过期
      -->
        <!-- <el-table-column
          label="状态"
          prop="cardStatus"
          :formatter="formatStatus"
        /> -->
        <el-table-column label="操作" fixed="right" width="180">
          <!--
             scope 作用域插槽
             scope.row  -> 当前行的数据对象

             如果我们只是想使用插槽渲染模板 #default
             如果我们除了想要使用插槽渲染模板 而且还想要拿到它内部的数据 #default="scope"
             scope 类似于函数的形参
             组件内部会把当前行数数据对象当成一个实参传到scope的位置

             在内部传递实参的时候 实参的格式
             {
              row: 当前行的对象数据
             }

             因为本来传下来的就是一个对象 所以通过解构赋值的方式去取row参数 #default="{row}"
          -->
          <template #default="scope">
            <el-button size="mini" type="text" @click="editCard(scope.row.id)"
              >编辑</el-button
            >
            <el-button size="mini" type="text" @click="delCard(scope.row.id)"
              >删除</el-button
            >
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
    <el-dialog title="添加月卡" width="580px">
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
import { getCardListAPI, delCardAPI, delCardListAPI } from "@/api/card.js";
export default {
  data() {
    return {
      // 请求参数
      params: {
        page: 1, // 默认页数
        pageSize: 5, // 默认条数
        carNumber: null,
        personName: null,
        cardStatus: null,
      },
      // 接收接口返回的月卡列表
      cardList: [],
      total: 0, // 总条数
      // 月卡状态
      cardStatusList: [
        {
          id: null,
          name: "全部",
        },
        {
          id: 0,
          name: "可用",
        },
        {
          id: 1,
          name: "已过期",
        },
      ],
      // 已选择列表
      selectedCarList: [],
    };
  },
  mounted() {
    this.getCardList();
  },
  methods: {
    async getCardList() {
      // 1. 调用接口
      const res = await getCardListAPI(this.params);
      // 2. 把后端的数据赋值给响应式cardList
      this.cardList = res.data.rows;
      this.total = res.data.total;
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
      return row.cardStatus === 0 ? "有效" : "已过期";
    },
    // 分页
    pageChange(page) {
      // console.log(page) // 回调参数 拿到的是当前页
      // 把点击的页数赋值给请求参数页数
      this.params.page = page;
      // 使用最新的请求参数获取列表数据
      this.getCardList();
    },
    // 搜索
    doSearch() {
      // 调用接口之前把页数参数重置为1
      this.params.page = 1;
      this.getCardList();
    },
    // 编辑
    editCard(id) {
      this.$router.push({
        path: "/addCard",
        query: {
          id,
        },
      });
    },
    // 删除逻辑
    delCard(id) {
      // 提示用户
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          // 确认逻辑 调用删除接口 重新渲染 提示成功
          await delCardAPI(id);
          this.getCardList();
          this.$message({
            type: "success",
            message: "删除成功!",
          });
        })
        .catch((error) => {
          console.log(error);
        });
    },
    // 批量删除的逻辑
    handleSelectionChange(rowList) {
      // console.log(rowList) [{...},{...},...]
      // 1. 添加新列 展示多选框
      // 2. 绑定事件 拿到选中的所有对象组成的数组
      // 3. 调用接口需要做的事情 把对象数组的每一项里的id拿到 拼接成逗号分割的写法
      this.selectedCarList = rowList;
    },
    delCartList() {
      this.$confirm("此操作将永久删除选择的月卡, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          // 处理id
          await delCardListAPI(this.selectedCarList.map((item) => item.id));
          this.getCardList();
          this.$message({
            type: "success",
            message: "批量删除成功!",
          });
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.card-container {
  padding: 20px;
  background-color: #fff;
}

.search-container {
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgb(237, 237, 237, 0.9);
  padding-bottom: 20px;
  .search-main {
    width: 220px;
    margin-right: 10px;
  }
  .search-btn {
    margin-left: 20px;
  }
}
.create-container {
  margin: 10px 0px;
}
.page-container {
  padding: 4px 0px;
  text-align: right;
}
.form-container {
  padding: 0px 80px;
}
</style>
