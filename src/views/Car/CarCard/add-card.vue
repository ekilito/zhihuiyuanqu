<template>
  <div class="add-card">
    <header class="add-header">
      <el-page-header content="增加月卡" @back="$router.back()" />
    </header>
    <main class="add-main">
      <div class="form-container">
        <div class="title">车辆信息</div>
        <!--
         el-form  :model  :rules
         el-form-item  prop指定要用哪条规则
         el-input v-model双向绑定
        -->
        <div class="form">
          <el-form ref="carInfoForm" :model="carInfoForm" :rules="carInfoRules" label-width="100px">
            <el-form-item prop="personName" label="车主姓名">
              <el-input v-model="carInfoForm.personName" />
            </el-form-item>
            <el-form-item prop="phoneNumber" label="联系方式">
              <el-input v-model="carInfoForm.phoneNumber" />
            </el-form-item>
            <el-form-item prop="carNumber" label="车辆号码">
              <el-input v-model="carInfoForm.carNumber" />
            </el-form-item>
            <el-form-item prop="carBrand" label="企业联系人">
              <el-input v-model="carInfoForm.carBrand" />
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="form-container">
        <div class="title">最新一次月卡缴费信息</div>
        <div class="form">
          <el-form ref="feeForm" :model="feeForm" :rules="feeFormRules" label-width="100px">
            <el-form-item prop="payTime" label="有效日期">
              <!-- 日期组件 -->
              <el-date-picker
                v-model="feeForm.payTime"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
              />
            </el-form-item>
            <el-form-item prop="paymentAmount" label="支付金额">
              <el-input v-model="feeForm.paymentAmount" />
            </el-form-item>
            <el-form-item prop="paymentMethod" label="支付方式">
              <el-select v-model="feeForm.paymentMethod">
                <el-option
                  v-for="item in payMethodList"
                  :key="item.id"
                  :value="item.id"
                  :label="item.name"
                />
              </el-select>
            </el-form-item>
          </el-form>
        </div>
      </div>

    </main>
    <footer class="add-footer">
      <div class="btn-container">
        <el-button>重置</el-button>
        <el-button type="primary" @click="confirmAdd">确定</el-button>
      </div>
    </footer>
  </div>
</template>

<script>
import { createCardAPI } from '@/api/card.js'
export default {
  data() {
    const validaeCarNumber = (rule, value, callback) => {
      // value : 用户在表单里输入的最新的数据
      const plateNumberRegex = /^[\u4E00-\u9FA5][\da-zA-Z]{6}$/
      if (plateNumberRegex.test(value)) {
        callback()
      } else {
        callback(new Error('请输入正确的车牌号'))
      }
    }
    return {
      // 车辆信息表单
      carInfoForm: {
        personName: '', // 车主姓名
        phoneNumber: '', // 联系方式
        carNumber: '', // 车牌号码
        carBrand: '' // 车辆品牌
      },
      carInfoRules: {
        personName: [
          {
            required: true, message: '请输入车主姓名', trigger: 'blur'
          }
        ],
        phoneNumber: [
          {
            required: true, message: '请输入联系方式', trigger: 'blur'
          }
        ],
        carNumber: [
          {
            required: true, message: '请输入车辆号码', trigger: 'blur'
          },
          {
            validator: validaeCarNumber, trigger: 'blur'
          }
        ],
        carBrand: [
          {
            required: true, message: '请输入车辆品牌', trigger: 'blur'
          }
        ]
      },
      // 缴费信息表单
      feeForm: {
        payTime: '', // 支付时间
        paymentAmount: null, // 支付金额
        paymentMethod: '' // 支付方式
      },
      // 缴费规则
      feeFormRules: {
        payTime: [
          {
            required: true,
            message: '请选择支付时间'
          }
        ],
        paymentAmount: [
          {
            required: true,
            message: '请输入支付金额',
            trigger: 'blur'
          }
        ],
        paymentMethod: [
          {
            required: true,
            message: '请选择支付方式',
            trigger: 'change'
          }
        ]
      },
      // 支付方式列表
      payMethodList: [
        {
          id: 'Alipay',
          name: '支付宝'
        },
        {
          id: 'WeChat',
          name: '微信'
        },
        {
          id: 'Cash',
          name: '线下'
        }
      ]
    }
  },
  methods: {
    // 确定
    confirmAdd() {
      // 两个表单统一校验
      // 调用实例的validate方法
      // 1. 串行校验 第一个表单校验通过之后开始第二个表单
      // 2. 并行校验 两个表单同时进行校验
      this.$refs.carInfoForm.validate(valid => {
        if (valid) {
          this.$refs.feeForm.validate(async valid => {
            if (valid) {
            // 全部校验通过
            // TODO 确定
              // 二次参数处理
              const payload = {
                ...this.feeForm,
                ...this.carInfoForm,
                // 单独处理时间
                cardStartDate: this.feeForm.payTime[0],
                cardEndDate: this.feeForm.payTime[1]
              }
              // 删掉多余字段
              delete payload.payTime
              await createCardAPI(payload)
              this.$router.back()
            }
          })
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.add-card {
  background-color: #f4f6f8;
  height: 100vh;

  .add-header {
    display: flex;
    align-items: center;
    padding: 0 20px;
    height: 64px;
    background-color: #fff;

    .left {
      span {
        margin-right: 4px;
      }
      .arrow{
        cursor: pointer;
      }
    }

    .right {
      text-align: right;
    }
  }

  .add-main {
    background: #f4f6f8;
    padding: 20px 130px;

    .form-container {
      background-color: #fff;

      .title {
        height: 60px;
        line-height: 60px;
        padding-left: 20px;
      }

      .form {
        margin-bottom: 20px;
        padding: 20px 65px 24px;

        .el-form {
          display: flex;
          flex-wrap: wrap;

          .el-form-item {
            width: 50%;
          }
        }
      }
    }
    .preview{
      img{
        width: 100px;
      }
    }
  }

  .add-footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    padding: 24px 50px;
    color: #000000d9;
    font-size: 14px;
    background: #fff;
    text-align: center;
  }
}
</style>
