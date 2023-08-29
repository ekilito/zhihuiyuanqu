<template>
  <div class="building-container">
    <!-- 搜索区域 -->
    <div class="search-container">
      <div class="search-label">企业名称：</div>
      <el-input
        v-model="params.enterpriseName"
        placeholder="请输入内容"
        class="search-main"
        clearable
        @clear="initData"
      />
      <div class="search-label">缴费时间：</div>
      <el-date-picker
        v-model="dateArr"
        type="daterange"
        range-separator="→"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="yyyy-MM-dd"
      />
      <el-button type="primary" @click="referBill">查询</el-button>
    </div>
    <!-- 添加账单弹框 -->
    <el-dialog
      v-if="addForm.id"
      title="查看账单"
      :visible="dialogVisible"
      width="580px"
      @close="closeDialog"
    >
      <span><!-- 表单接口 -->
        <div class="form-container">
          <p>租户名称：{{ addForm.enterpriseName }}<br></p>
          <p>租赁楼宇：{{ addForm.buildingName }}<br></p>
          <p>缴费周期：{{ addForm.startTime }}至{{ addForm.endTime }}<br></p>
          <p>物业费(元/m2): {{ addForm.propertyFeePrice }}<br></p>
          <p>账单金额(元): {{ addForm.paymentAmount }}<br></p>
          <p>支付方式：{{ addForm.paymentMethod }}<br></p>
          <p>缴费时间：{{ addForm.createTime }}<br></p></div></span>
      <template #footer>
        <el-button
          size="mini"
          type="primary"
          @click="dialogVisible = false"
        >确 定</el-button>
      </template>
    </el-dialog>

    <el-dialog
      v-else
      title="增加账单"
      :visible="dialogVisible"
      width="580px"
      @close="closeDialog"
    >
      <span>
        <!-- 增加弹窗 -->
        <div class="form-container">
          <el-form ref="rulesForm" :model="addForm" :rules="addRules">
            <el-form-item label="选择租户" prop="enterpriseId" width="180px">
              <el-select
                v-model="addForm.enterpriseId"
                placeholder="请选择租户"
              >
                <el-option
                  v-for="ele in enterpriseList"
                  :key="ele.id"
                  :value="ele.id"
                  :label="ele.name"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="租赁楼宇" prop="buildingId">
              <el-select
                v-model="addForm.buildingId"
                placeholder="请选择租赁楼宇"
              >
                <el-option
                  v-for="ele in buildingList"
                  :key="ele.id"
                  :value="ele.id"
                  :label="ele.name"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="缴费周期：" prop="dateArr">
              <el-date-picker
                v-model="addForm.dateArr"
                type="daterange"
                range-separator="→"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
              />
            </el-form-item>
            <el-form-item label="支付金额" prop="paymentAmount">
              <el-input
                v-model="addForm.paymentAmount"
                placeholder="请输入支付金额"
                disabled
              />
            </el-form-item>
            <el-form-item label="支付方式" prop="paymentMethod">
              <el-select
                v-model="addForm.paymentMethod"
                placeholder="请选择支付方式"
              >
                <el-option label="微信" value="1" />
                <el-option label="支付宝" value="2" />
                <el-option label="现金" value="3" />
              </el-select>
            </el-form-item>
          </el-form>
        </div>
      </span>
      <template #footer>
        <el-button size="mini" @click="dialogVisible = false">取 消</el-button>
        <el-button
          size="mini"
          type="primary"
          @click="submitForm"
        >确 定</el-button>
      </template>
    </el-dialog>

    <el-button type="primary" @click="addBill">添加账单</el-button>
    <hr>
    <!-- 表格区域 -->
    <div class="table">
      <el-table style="width: 100%" :data="propetyList" stripe>
        <el-table-column type="index" label="序号" />
        <el-table-column label="账单编号" prop="billNumber" width="180" />
        <el-table-column label="企业名称" prop="enterpriseName" />
        <el-table-column label="租赁楼宇" prop="buildingName" width="150" />
        <el-table-column
          label="物业费(元/m²)"
          prop="propertyFeePrice"
          width="120"
        />
        <el-table-column
          label="账单金额(元)"
          prop="paymentAmount"
          width="150"
        />
        <el-table-column label="缴费时间" prop="createTime" width="180" />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button
              size="mini"
              type="text"
              @click="viewBill(scope.row.id)"
            >查看</el-button>
            <el-button
              size="mini"
              type="text"
              @click="delBill(scope.row.id)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- //  表格结束 放分页符 -->
      <div class="page-container">
        <el-pagination
          :current-page="params.page"
          :page-sizes="[10, 20, 30, 50]"
          :page-size="params.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>

<script>
import {
  getPropetyListAPI,
  referEnterpriseAPI,
  referBuildingAPI,
  propetyBudgetAPI,
  delBillAPI,
  viewBillAPI,
  addBillAPI
} from '@/api/propety'
export default {
  data() {
    return {
      dialogVisible: false, // 控制弹框显示与隐藏
      propetyList: [], // 渲染列表
      params: {
        enterpriseName: '', // 企业名称
        page: 1, // 当前页码
        pageSize: 10 // 页面大小
      },
      dateArr: [], // 日期起终时间
      total: 0, // 总条数
      enterpriseList: [],
      buildingList: [],
      //  增加编辑表单
      addForm: {
        enterpriseId: null, // 企业id
        buildingId: null, // 楼宇id
        startTime: '', // 缴费周期-开始时间
        endTime: '', //  缴费周期-结束时间
        paymentAmount: null, // 付款总额
        paymentMethod: null, // 付款方式1微信2支付宝3现金
        dateArr: [] // 日期起终时间
      },
      // 编辑表单规则校验
      addRules: {
        enterpriseId: {
          required: true,
          message: '请选择租户',
          trigger: 'blur'
        },
        buildingId: {
          required: true,
          message: '请选择楼宇',
          trigger: 'blur'
        },
        dateArr: {
          required: true,
          message: '请选择缴费周期',
          trigger: 'blur'
        },
        paymentAmount: {
          required: true,
          message: '请输入支付金额',
          trigger: 'blur'
        },
        paymentMethod: {
          required: true,
          message: '请选择支付方式',
          trigger: 'blur'
        }
      }
    }
  },
  //  对弹出表单框进行侦听
  // 1. 通过事件分别监听一下楼宇什么时候选中 时间什么时候选中  [通过事件绑定回调函数 两个组件分别绑定同一个回调函数]
  // 2. 在事件的回调中判断一下接口必须传参是否都具备了 [非空判断]
  // 3. 如果接口参数都不是空  正常发接口请求  获取计算金额
  // 4. 通过 v-model 进行正常的回填  [通过属性控制它不可编辑]
  watch: {
    addForm: {
      deep: true,
      async handler() {
        // console.log(newVal)
        if (
          this.addForm.enterpriseId !== '' &&
          this.addForm.dateArr.length !== 0
        ) {
          const obj = await propetyBudgetAPI({
            buildingId: this.addForm.buildingId,
            startTime: this.addForm.dateArr[0],
            endTime: this.addForm.dateArr[1]
          })
          this.addForm.paymentAmount = obj.data
        }
      }
    }
  },

  created() {
    // 渲染列表
    this.initData()
  },
  methods: {
    //  列表数据初始化
    async initData() {
      const res = await getPropetyListAPI(this.params)
      // console.log(res)
      this.propetyList = res.data.rows
      this.total = res.data.total
    },
    //  查询账单
    async referBill() {
      const res = await getPropetyListAPI({
        ...this.params,
        start: this.dateArr[0] || '', // 起始时间
        end: this.dateArr[1] || '' //  结束时间
      })
      this.propetyList = res.data.rows
    },
    //  点击增加账单
    async addBill() {
      this.dialogVisible = true
      const res = await referEnterpriseAPI()
      // console.log(res)
      const row = await referBuildingAPI()
      // console.log(row)
      this.enterpriseList = res.data
      this.buildingList = row.data
    },
    //  点击确定
    submitForm() {
      this.$refs.rulesForm.validate(async valid => {
        if (valid) {
          const {
            enterpriseId,
            buildingId,
            startTime,
            endTime,
            paymentAmount,
            paymentMethod
          } = this.addForm
          await addBillAPI({
            enterpriseId,
            buildingId,
            startTime,
            endTime,
            paymentAmount,
            paymentMethod,
            startTime: this.addForm.dateArr[0],
            endTime: this.addForm.dateArr[1]
          })
          this.$message.success('添加成功')
          this.initData()
          this.closeDialog()
        }
      })
    },
    //  关闭弹窗时要做的事
    closeDialog() {
      // 重置表单 + 手动 + resetFields
      this.addForm = {
        enterpriseId: null, // 企业id
        buildingId: null, // 楼宇id
        startTime: '', // 缴费周期-开始时间
        endTime: '', //  缴费周期-结束时间
        paymentAmount: null, // 付款总额
        paymentMethod: null, // 付款方式1微信2支付宝3现金
        dateArr: [] // 日期起终时间
      }
      this.$refs.rulesForm?.resetFields()
      this.dialogVisible = false
    },
    //  分页
    handleSizeChange(val) {
      this.params.pageSize = val
      this.initData()
      // console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      this.params.page = val
      this.initData()
      // console.log(`当前页: ${val}`)
    },
    // 查看账单
    async viewBill(id) {
      // console.log(id)
      const res = await viewBillAPI(id)
      // console.log(res)
      this.addForm = {
        enterpriseName: res.data.enterpriseName, //  企业名字
        buildingName: res.data.buildingName, //  楼宇名字
        startTime: res.data.startTime, // 缴费周期-开始时间
        endTime: res.data.endTime, //  缴费周期-结束时间
        propertyFeePrice: res.data.propertyFeePrice, //  物业费
        paymentAmount: res.data.paymentAmount, // 账单金额
        paymentMethod: res.data.paymentMethodValue, // 付款方式1微信2支付宝3现金
        createTime: res.data.createTime, //  缴费时间
        dateArr: [], // 日期起终时间
        id: id // id
      }
      this.dialogVisible = true
    },
    // 删除账单
    delBill(id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          await delBillAPI(id)
          this.initData()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
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
  border-bottom: 1px solid rgb(237, 237, 237, 0.9);
  padding-bottom: 20px;
  .search-label {
    width: 100px;
    margin-left: 10px;
  }
  .search-main {
    width: 220px;
    margin-right: 10px;
  }
  .el-button {
    margin-left: 15px;
    width: 80px;
  }
}
.page-container {
  padding: 4px 0px;
  text-align: right;
}
</style>
