<template>
  <div class="login-container">
    <div class="bg-circle">
      <img class="lt" src="https://img.axureshop.com/7a/4a/a8/7a4aa826e79b40d086fba67fb100e0f9/images/0登陆页/u3.png" alt="">
      <img class="lb" src="https://img.axureshop.com/7a/4a/a8/7a4aa826e79b40d086fba67fb100e0f9/images/0登陆页/u5.png" alt="">
      <img class="rt" src="https://img.axureshop.com/7a/4a/a8/7a4aa826e79b40d086fba67fb100e0f9/images/0登陆页/u4.png" alt="">
    </div>
    <div class="main">
      <img src="~@/assets/we+.png" alt="">
      <el-card shadow="never">
        <div class="title">
          <img src="~@/assets/yq.png" alt="">
          <h2> we+智慧园区</h2>
        </div>
        <!--
             基础校验
            el-form  :model="表单对象"  :rules="规则对象"
            el-form-item  prop属性指定一下要使用哪条规则
            el-input v-model双向绑定

            统一校验
            1. 获取表单的实例对象
            2. 调用validate方法
            -->
        <!--登录表单-->
        <el-form ref="loginForm" :model="loginForm" :rules="loginRules">

          <el-form-item prop="username">
            <el-input v-model="loginForm.username" placeholder="账号">
              <template #prefix>
                <img src="https://img.axureshop.com/7a/4a/a8/7a4aa826e79b40d086fba67fb100e0f9/images/0登陆页/u13.png" alt="">
              </template>
            </el-input>
          </el-form-item>

          <el-form-item prop="password">
            <el-input v-model="loginForm.password" show-password placeholder="密码">
              <template #prefix>
                <img src="https://img.axureshop.com/7a/4a/a8/7a4aa826e79b40d086fba67fb100e0f9/images/0登陆页/u17.png" alt="">
              </template>
            </el-input>
          </el-form-item>

          <el-form-item>
            <el-input v-model="code" placeholder="验证码">
              <template #prefix>
                <img src="https://img.axureshop.com/7a/4a/a8/7a4aa826e79b40d086fba67fb100e0f9/images/0登陆页/u21.png" alt="">
              </template>
              <template #append>
                <span>1 3 2 3</span>
              </template>
            </el-input>
          </el-form-item>

          <!-- 如果当前为true，点击登录时，表示要记住，把当前的用户名和密码存入本地
               组件初始化的时候，从本地取账号和密码，把账号密码存入用来双向绑定的form身上
               如果当前用户没有记住，状态为false，点击登录的时候要把之前的数据清空
           -->
          <el-form-item>
            <el-checkbox v-model="remember">记住我</el-checkbox>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" class="login-btn" @click="doLogin()">登录</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script>
const FORMDATA_KEY = 'form_key'
export default {
  name: 'Login',
  data() {
    return {
      code: '',
      loginForm: {
        username: '',
        password: ''
      },

      remember: false,
      // 校验规则
      loginRules: {
        username: [
          { required: true, message: '账号不能为空', trigger: 'blur' }
          /* { pattern: /^1[3-9]\d{9}$/, message: '账号格式不正确', trigger: 'blur' } */
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 6, max: 16, message: '密码长度6-16位', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '验证码不能为空', trigger: 'blur' },
          { pattern: /^\d{4}$/, message: '验证码是四位数字', trigger: 'blur' }
        ]
        /*   remember: [
          {
            // 自定义校验函数(校验规则, 要校验的值, 成功或失败的回调函数)
            validator: (rule, value, callback) => {
              // rule 检验规则
              // value 校验的值
              // callback 函数
              // 成功执行callback 失败也执行callback(错误对象 new Error(错误信息))
              value ? callback() : callback(new Error('未勾选用户协议'))
            }
          }
        ], */

      }
    }
  },
  // 组件初始化调用
  created() {
    // 去本地取一下之前存入的账号和密码 如果取到了则赋值操作
    const cacheFormStr = localStorage.getItem(FORMDATA_KEY)
    if (cacheFormStr) {
      const cacheFormData = JSON.parse(cacheFormStr)
      this.loginForm.username = cacheFormData.username
      this.loginForm.password = cacheFormData.password
    }
  },

  methods: {
    async doLogin() {
      // 所有的表单项都通过校验 valid（res）才为true 负责就是false
      const res = await this.$refs.loginForm.validate()
      if (res) {
        // 补充remeber逻辑 记住我
        if (this.remember) {
          localStorage.setItem(FORMDATA_KEY, JSON.stringify(this.loginForm))
        } else {
          localStorage.removeItem(FORMDATA_KEY)
        }

        // 异步
        await this.$store.dispatch('user/doLogin', this.loginForm)
        // 如果登录成功，跳转到首页
        this.$router.push('/')
        // 提示用户登录成功
        this.$message({
          type: 'success',
          message: '登陆成功'
        })
      }
    }
  }
}

</script>
<style scoped lang="scss">
.login-container {
  position: relative;
  height: 100%;
  background-image: linear-gradient(45deg,#98a1fc,#62b0fc );
  overflow: hidden;

  // 三个圆形图片的位置
  .bg-circle {
    .lt {
      position: absolute;
      left: 40px;
      top: 40px;
      opacity: 0.2;
    }
    .lb {
      position: absolute;
      left: -280px;
      bottom: -280px;
    }
    .rt {
      position: absolute;
      right: -100px;
      top: -250px;
    }
  }

  // 主体内容
  .main {
    // 水平和垂直居中
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    align-items: center;

    // 登录卡片
    .el-card {
      margin-left: 20px;
      opacity: 0.95;
      border-radius: 20px;

      // 卡片标题
      .title {
        display: flex;
        justify-content: center;
        align-items: center;

        font-size: 23px;
        font-weight: 700;
        font-style: normal;
        color: rgb(67, 141, 238);

        img {
          width: 50px;
          height: 42px;
          margin-right: 10px;
        }
      }

      // 登录表单文本框
      .el-input {
        width: 350px;
        height: 44px;

        // 文本框内容
        ::v-deep .el-input__inner {
          background-color: #f4f5fb;
          height: 44px;
        }

        // 文本框头部图标样式
        img {
          width: 20px;
          height: 20px;
          margin-top: 12px;
        }

        // 文本框尾部验证码样式
        ::v-deep .el-input-group__append {
          font-family: 'Arial Negreta', 'Arial Normal', 'Arial';
          font-weight: 700;
          font-size: 16px;
          color: #FF7733;
          // height: 44px;
        }
      }

      // 复选款样式
      .el-checkbox {
        color:#606266;
      }

      // 登录按钮样式
      .login-btn {
        width: 350px;
        &:hover {
          background: #FF7733;
          border: 0;
        }
      }
    }
  }
}
</style>
