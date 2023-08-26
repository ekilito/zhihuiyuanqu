<template>
  <div>行车管理-规则管理</div>
</template>
<template>
  <div class="rule-container">
    <div class="create-container">
      <el-button type="primary" @click="dialogVisible = true">增加停车计费规则</el-button>
      <el-button @click="exportToExcel">导出Excel</el-button>
    </div>
    <!-- 表格区域 -->
    <div class="table">
      <el-table :data="ruleList" style="width: 100%">
        <el-table-column type="index" label="序号" />
        <el-table-column label="计费规则编号" prop="ruleNumber" />
        <el-table-column label="计费规则名称" prop="ruleName" />
        <el-table-column label="免费时长(分钟)" prop="freeDuration" />
        <el-table-column label="收费上线(元)" prop="chargeCeiling" />
        <el-table-column label="计费方式">
          <template #default="scope">
            {{ formatChargeType(scope.row.chargeType) }}
          </template>
        </el-table-column>
        <el-table-column label="计费规则" prop="ruleNameView"/>

        <el-table-column label="操作" fixed="right" width="120">
          <template #default="{row}">
            <el-button size="mini" type="text">编辑</el-button>
            <el-button size="mini" type="text" @click="delRule(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <el-pagination
      layout="total,prev,pager,next"
      :total="total"
      :page-size="params.pageSize"
      @current-change="pageChange"
      >

      </el-pagination>
    </div>
    <!-- 弹框 -->
<el-dialog :visible="dialogVisible" width="680px" title="新增规则" @close="dialogVisible = false">
  <!-- 表单接口 -->
  <div class="form-container">
    <el-form ref="addForm" :model="addForm" :rules="addFormRules" label-position="top">
      <el-form-item label="计费规则编号" prop="ruleNumber">
        <el-input v-model="addForm.ruleNumber" />
      </el-form-item>
      <el-form-item label="计费规则名称" prop="ruleName">
        <el-input v-model="addForm.ruleName" />
      </el-form-item>
      <el-form-item label="计费方式" prop="chargeType">
        <el-radio-group v-model="addForm.chargeType" size="small">
          <el-radio label="duration" border>时长收费</el-radio>
          <el-radio label="turn" border>按次收费</el-radio>
          <el-radio label="partition" border>分段收费</el-radio>
        </el-radio-group>
      </el-form-item>
      <div class="flex-container">
        <el-form-item label="免费时长">
          <el-input v-model="addForm.freeDuration" />
        </el-form-item>
        <el-form-item label="收费上限">
          <el-input v-model="addForm.chargeCeiling" />
        </el-form-item>
      </div>
      <el-form-item label="计费规则">
  <!-- 按时长收费区域 -->
  <div v-if="addForm.chargeType === 'duration'" class="duration">
    每 <el-input v-model="addForm.durationTime" class="input-box" /> 小时 <el-input v-model="addForm.durationPrice" class="input-box" /> 元
    </div>
  <!-- 按次收费区域 -->
  <div v-if="addForm.chargeType === 'turn'" class="turn">
    每次 <el-input v-model="addForm.turnPrice" class="input-box" /> 元
  </div>
  <!-- 按分段收费区域 -->
  <div v-if="addForm.chargeType==='partition'" class="partition">
    <div class="item"><el-input v-model="addForm.partitionFrameTime" class="input-box" />小时内,每小时收费<el-input v-model="addForm.partitionFramePrice" class="input-box" /> 元</div>
      <div class="item">每增加<el-input v-model="addForm.partitionIncreaseTime" class="input-box" />小时,增加<el-input v-model="addForm.partitionIncreasePrice" class="input-box" /> 元</div>
    </div>
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
import { getRuleListAPI, createRuleAPI, delRuleAPI } from '@/api/car'
import { utils, writeFileXLSX } from 'xlsx'
export default {
  name: 'Building',
  data() {
    return {
      ruleList: [], // 规则列表
      params: {
        page: 1, // 默认显示的页面
        pageSize: 10 // 每页默认的条数
      },
      total: 0, // 总条数
      dialogVisible: false,
      addForm: {
        ruleNumber: '', // 计费规则编号
        ruleName: '', // 计费规则名称
        chargeType: 'duration', // 计费规则类型 duration / turn / partition
        chargeCeiling: null,
        freeDuration: null,
        // 时长计费独有字段
        durationTime: null, // 时长计费单位时间
        durationPrice: null, // 时长计费单位价格
        durationType: 'hour',
        // 按次收费独有字段
        turnPrice: null,
        // 分段计费独有字段
        partitionFrameTime: null, // 段内时间
        partitionFramePrice: null, // 段内费用
        partitionIncreaseTime: null, // 超出时间
        partitionIncreasePrice: null // 超出费为收费价钱

      }, // 计费规则表单对象
      addFormRules: {
        ruleNumber: [
          {
            required: true,
            message: '请输入规则编号',
            trigger: 'blur'
          }
        ],
        ruleName: [
          {
            required: true,
            message: '请输入规则名称',
            trigger: 'blur'
          }
        ],
        chargeType: [
          {
            required: true,
            message: '请选择收费类型',
            trigger: 'blur'
          }
        ]
      } // 计费规则校验规则对象
    }
  },
  mounted() {
    this.getRuleList()
  },
  methods: {
  // 获取规则列表
    async getRuleList() {
      const res = await getRuleListAPI(this.params)
      this.ruleList = res.data.rows
      this.total = res.data.total
    },
    pageChange(page) {
      this.params.page = page
      this.getRuleList()
    },
    // 导出excel
    async exportToExcel() {
      // 获取要导出的业务数据
      const res = await getRuleListAPI(this.params)
      // 表头英文字段key
      const tableHeaderKeys = ['ruleNumber', 'ruleName', 'freeDuration', 'chargeCeiling', 'chargeType', 'ruleNameView']
      // 表头中文字段value
      const tableHeaderValues = ['计费规则编号', '计费规则名称', '免费时长(分钟)', '收费上线(元)', '计费方式', '计费规则']
      // 以excel表格的顺序调整后端数据
      const sheetData = res.data.rows.map((item) => {
        const _obj = {} // 存放正确顺序的key-value
        tableHeaderKeys.forEach(key => {
          // 赋值
          // 针对计费规则做处理
          if (key === 'chargeType') {
            _obj[key] = this.formatChargeType(item[key])
          } else {
            _obj[key] = item[key]
          }
        })
        return _obj
      })
      // 创建一个工作表
      const worksheet = utils.json_to_sheet(sheetData)
      // 创建一个新的工作簿
      const workbook = utils.book_new()
      // 把工作表添加到工作簿
      utils.book_append_sheet(workbook, worksheet, 'Data')
      // 改写表头
      utils.sheet_add_aoa(worksheet, [tableHeaderValues], { origin: 'A1' })
      writeFileXLSX(workbook, 'SheetJSVueAoO.xlsx')
    },
    // 适配收费状态
    formatChargeType(type) {
      const TYPEMAP = {
        'duration': '按时长收费',
        'turn': '按次收费',
        'partition': '分段收费'
      }
      return TYPEMAP[type]
    },
    confirmAdd() {
      this.$refs.addForm.validate(async valid => {
        if (valid) {
          await createRuleAPI(this.addForm)
          this.getRuleList()
          this.$message.success('新增规则成功')
          this.dialogVisible = false
        }
      })
    },
    // 删除
    async delRule(id) {
      // console.log(id)
      // 调用接口
      await delRuleAPI(id)
      // 重新获取列表
      this.getRuleList()
      // 提示
      this.$message.success('删除规则成功')
    }
  }
}
</script>

<style lang="scss" scoped>
.rule-container {
  padding: 20px;
  background-color: #fff;
}

.search-container {
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgb(237, 237, 237, .9);
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
