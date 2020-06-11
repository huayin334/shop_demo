<!--
 * @Author: your name
 * @Date: 2020-03-24 16:50:28
 * @LastEditTime: 2020-03-24 21:53:59
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /studyCode/vue_shop/src/components/login.vue
 -->
<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区 -->
      <div class="avater_box">
        <img src="../assets/logo.png" alt="" />
      </div>
      <!-- 登录表单区 -->
      <el-form
        ref="loginFromRef"
        :model="loginForm"
        :rules="loginFromRules"
        label-width="80px"
        class="login_form"
      >
        <el-form-item label="用户名：" prop="username">
          <el-input
            v-model="loginForm.username"
            prefix-icon="el-icon-user-solid"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码：" prop="password">
          <el-input
            v-model="loginForm.password"
            prefix-icon="el-icon-view"
            type="password"
          ></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      loginForm: {
        username: "",
        password: ""
      },
      //   这是表单的验证规则对象
      loginFromRules: {
        //验证用户名是否合法
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" }
        ],
        // 验证密码
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 15, message: "长度在 6 到 15 个字符", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    resetLoginForm() {
      // element-ui自带的方法，重置表单
      // 通过设置ref可以获取dom元素和组件
      this.$refs.loginFromRef.resetFields();
    },
    login() {
      // 表单预验证 valid是验证结果 布尔值
      this.$refs.loginFromRef.validate(async valid => {
        console.log(valid);
        // 如果是false直接返回
        if (!valid) return;
        // 如果是true 就发起请求
        // 解构赋值 把结果中的data赋值给res
        const { data: res } = await this.$http.post("login", this.loginForm);
        if (res.meta.status !== 200) {
          this.$message.error("登录失败");
        } else {
          this.$message.success("登录成功");
          //这里使用的是sessionStorage（单个窗口共享，关闭窗口生命周期结束）不是localStorage（多页面共享，除非手动删除，不然一直存在）
          window.sessionStorage.setItem("token", res.data.token);
          //编程式导航跳转
          console.log(this.$router);
          this.$router.push("/home");
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.avater_box {
  height: 130px;
  width: 130px;
  border: 1px solid #eee;
  border-radius: 50%;
  padding: 10px;
  box-shadow: 0 0 10px #ddd;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #eee;
  }
}
.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
.btns {
  display: flex;
  justify-content: center;
  padding-right: 40px;
}

.van-swipe__indicator:not(:last-child){
  position: relative;
  bottom: 10px;
}
.van-swipe__indicator{
  position: relative;
  bottom: 10px;
}
</style>
