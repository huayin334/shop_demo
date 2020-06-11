<!--
 * @Author: your name
 * @Date: 2020-03-24 20:28:11
 * @LastEditTime: 2020-03-25 14:26:17
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /studyCode/vue_shop/src/components/Home.vue
 -->
<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div class="he">
        <img src="../assets/logo.png" alt=""/><span>后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header
    >
    <!-- 侧边栏 -->
    <el-container>
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!-- 侧边栏菜单区 -->
        <el-menu
          background-color="#2a3b60"
          text-color="#fff"
          active-text-color="#409Eff"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="$route.path"
        >
          <!-- 一级菜单 -->
          <el-submenu
            :index="item.id + ''"
            v-for="item in menuList"
            :key="item.id"
          >
            <template slot="title">
              <i :class="iconsObj[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/'+subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
            >
              <template slot="title">
                <i :class="iconsObj[subItem.id]"></i>
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item
            >
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 页面主体 -->
      <el-main>
        <!-- welcome是home的子组件 重定向到welcome 占个位置～ -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  export default {
    created() {
      this.getMenuList();
    },
    data() {
      return {
        // 左侧菜单数据
        menuList: [],
        iconsObj: {
          "125": "el-icon-s-custom",
          "103": "el-icon-menu",
          "101": "el-icon-s-claim",
          "102": "el-icon-s-order",
          "145": "el-icon-s-data",
          "110": "el-icon-user",
          "111": "el-icon-user-solid",
          "112": "el-icon-s-check",
          "104": "el-icon-s-grid",
          "115": "el-icon-s-order",
          "121": "el-icon-s-shop",
          "107": "el-icon-s-unfold",
          "146": "el-icon-s-marketing"
        },
        isCollapse: false
      };
    },
    methods: {
      logout() {
        //  清除本地缓存（token）
        window.sessionStorage.clear();
        // 重新跳转到login页面
        this.$router.push("/login");
      },
      async getMenuList() {
        const {data: res} = await this.$http.get("menus");
        // console.log(res.data)
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
        this.menuList = res.data;
      },
      // 点击按钮 切换菜单的折叠与展开
      toggleCollapse() {
        this.isCollapse = !this.isCollapse;
      }
    }
  };
</script>

<style lang="less" scoped>
  .home-container {
    height: 100%;
  }

  .el-header {
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    padding-left: 0;
    align-items: center;

    div {
      display: flex;
      align-items: center;

      img {
        width: auto;
        height: 60px;
      }

      span {
        font-size: 20px;
        color: #ffffff;
        margin-left: 15px;
      }
    }
  }

  .el-aside {
    background-color: #333744;

    .el-menu {
      border-right: 0;
    }
  }

  .el-main {
    background-color: #eaedf1;
  }
  .toggle-button {
    background-color: #4a5064;
    text-align: center;
    color: #ffffff;
    font-size: 10px;
    line-height: 24px;
    letter-spacing: 0.2em;
    cursor: pointer;
  }

  .el-aside,.el-menu,.toggle-button,.he,.el-header{
    background-color: #293a61;
  }
  .he{
    padding: 20px;
    /*width: 80%;*/
  }
  .he img{
    /*border-radius: 20px;*/
    width: 40px!important;
    height: 40px!important;
    /*width: 80%;*/
  }
</style>
