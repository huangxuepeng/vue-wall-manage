<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 登陆表单区域 -->
      <div>
        <el-form ref="loginFormRef"
                 class="Login_form"
                 :model="loginForm"
                 :rules="loginFormRules">
                <!--头像 -->
            <el-form-item prop="avatar">
                <el-input v-model="loginForm.avatar"
                        placeholder="请上传头像"
                        type="file"
                        accept='image/*'></el-input>
            </el-form-item>
            <!-- 昵称 -->
            <el-form-item prop="nick_name">
                <el-input v-model="loginForm.nick_name"
                        placeholder="请输入昵称"
                        type="text"></el-input>
            </el-form-item>
            <!-- 学号 -->
          <el-form-item prop="student_number">
            <el-input v-model="loginForm.student_number"
                      placeholder="请输入学号"
                      type="text"></el-input>
          </el-form-item>
          <!-- 手机号码 -->
          <el-form-item prop="mobile">
            <el-input v-model="loginForm.mobile"
                      placeholder="手机号码"
                      type="text"></el-input>
          </el-form-item>
            <!-- 邮箱 -->
            <el-form-item prop="email">
                <el-input v-model="loginForm.email"
                        placeholder="请输入邮箱"
                        type="email"
                        autocomplete=on></el-input>
            </el-form-item>
                        <!-- 星座-->
            <el-form-item prop="constellation">
                <el-input v-model="loginForm.constellation"
                        placeholder="请输入星座"
                        type="text"></el-input>
            </el-form-item>
          <!-- 密码 -->
          <el-form-item prop="password">
            <el-input v-model="loginForm.password"
                      placeholder="密码"
                      type="password"
                      id="password"></el-input>
          </el-form-item>
          <!-- 按钮区 -->
          <el-form-item class="btns">
            <el-form-item>
              <el-button type="primary"
                         @click="register">注册</el-button>
              <el-button @click="resetLoginForm">重置</el-button>
              <el-button type="primary"
                         @click="login">登陆</el-button>
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
        nick_name: '',
        mobile: '',
        password: '',
        avatar: '',
        email: '',
        constellation: ''
      },
      loginFormRules: {
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' }
          // { min: 3, max: 16, message: '长度在 3 到 16 个字符', trigger: 'blur' }
        ],
        nick_name: [
            {required: true, message: '请输入您的昵称', trigger: 'blur' }
        ],
        student_number: [
          {required: true, message: '请输入您九位学号', trigger: 'blur'},
          {min: 9, max: 9, message: '学号的长度为九个数字呦', trigger: 'blur'}
        ],
        email: [
          {required: true, message: '请输入您的邮箱', trigger: 'blur'},
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur'},
        ],
        repassword: [
          { required: true, message: '请确认密码', trigger: 'blur'},
        ]
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
    register() {
      // 表单预验证
      this.$refs.loginFormRef.validate(async valid => {
        // console.log(valid);
        if (!valid) return
        /* 解构赋值 把data设置一个别名 res*/
        const { data: res } = await this.$http.post(
          '/user/register',
          this.loginForm
        )
        console.log(res)
        if (res.code !== 200){ 
          this.$Message.error(res.text)
          }
        // /*
        // 将登陆成功之后的token,保存到客户端的sessionStorage中  基于会话的,  localStorage基于本地存储
        // 项目中出了登陆之外的其他api接口,必须在登陆之后才能访问
        // token只应在当前网站打开器件生效,所以将token保存在sessionStorage中
        // */
        else {
          this.$Message.success('注册成功')
          this.$router.push('/login')
        }

        // 当状态码不是200  则证明请求失败，也就是登录失败   直接提示用户登录失败
      })
    },
    login() {
      this.$router.push('/login')
      console.log('登录')
    },
    // 解决上传文件不是图片的弊端
    avatar(event) {
      const target = event.target;
      const files = target.files;
        for (let file of files) {
          let reader = new FileReader();
          reader.onload = e => {
            let img = new Image();
            img.src = e.target.result;
            img.onload = () => {
              //  do something
            };
          };
          //  用于将Blob对象转换成base64编码
          reader.readAsDataURL(file);
        }
      
    },

  }
}
</script>

<style lang="less" scoped>
.login_container {
  height: 100%;
  background: #83d5e4;
}
.login_box {
  width: 450px;
  height: 600px;
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