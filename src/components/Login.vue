<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="../assets/logo.png"
             alt />
      </div>
      <!-- 登陆表单区域 -->
      <div>
        <el-form ref="loginFormRef"
                 class="Login_form"
                 :model="loginForm"
                 :rules="loginFormRules">
          <!-- 用户名 -->
          <el-form-item prop="mobile">
            <el-input v-model="loginForm.mobile"
                      placeholder="mobile"
                      type="text"></el-input>
          </el-form-item>
          <!-- 密码 -->
          <el-form-item prop="password">
            <el-input v-model="loginForm.password"
                      placeholder="password"
                      type="password"></el-input>
          </el-form-item>
          <!-- 按钮区 -->
          <el-form-item class="btns">
            <el-form-item>
              <el-button type="primary"
                         @click="login">登陆</el-button>
              <el-button @click="resetLoginForm">重置</el-button>
              <el-button type="info" plain @click="register">注册</el-button>
            </el-form-item>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 这里是表单的数据绑定对象
      loginForm: {
        mobile: '18088630924',
        password: '12345678'
      },
      loginFormRules: {
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' }
          // { min: 3, max: 16, message: '长度在 3 到 16 个字符', trigger: 'blur' }
        ],
        password: []
      }
    }
  },
  methods: {
    // 点击重置按钮,重置登陆表单
    resetLoginForm() {
      // console.log(this);
      this.$refs.loginFormRef.resetFields()
    },
    logintest() {
      // **************************最后删除
      // console.log('ok')
      this.$router.push('/home')
      console.log('ok')
    },
    login() {
      // 表单预验证
      this.$refs.loginFormRef.validate(async valid => {
        // console.log(valid);
        if (!valid) return
        /* 解构赋值 把data设置一个别名 res*/
        const { data: res } = await this.$http.post(
          '/user/login',
          this.loginForm
        )
        console.log(res)
        if (res.code !== 200){ 
          this.$Message.error('手机号码错误或者密码错误; 您未完成注册, 请注册再登录')
          }
        // /*
        // 将登陆成功之后的token,保存到客户端的sessionStorage中  基于会话的,  localStorage基于本地存储
        // 项目中出了登陆之外的其他api接口,必须在登陆之后才能访问
        // token只应在当前网站打开器件生效,所以将token保存在sessionStorage中
        // */
        else if (res.code === 200) {
          this.$Message.success('登陆成功')
          // console.log(res.data.authToken.accessToken)
          window.sessionStorage.setItem('token', res.data.token)
           window.sessionStorage.setItem('email', res.data.vifyCode)
          // 编程式导航跳转到后台主页,路由地址是 /home
          this.$router.push('/home')
        }

        // 当状态码不是200  则证明请求失败，也就是登录失败   直接提示用户登录失败
      })
    },
    register() {
      this.$router.push('/register')
      console.log('注册')
    }
  }
}
</script>

<style lang="less" scoped>
.login_container {
  height: 100%;
  background: #2ecc71;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  .avatar_box {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #34495e;
    }
  }
}

.Login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  box-sizing: border-box;
  padding: 0 20px;
}

.btns {
  display: flex;
  justify-content: flex-end;
}
</style>