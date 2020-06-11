<!--
 * @Author: your name
 * @Date: 2020-03-24 14:56:32
 * @LastEditTime: 2020-03-30 17:44:37
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /studyCode/vue_shop/src/App.vue
 -->
<template>
  <div id="app">
    <!-- 路由占位符 -->
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: 'app'
}
</script>

<style>
.el-card {
  margin-top: 15px;
  font-size: 12px;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15) !important;
}
.el-input {
  margin-bottom: 15px;
}
.el-table {
  font-size: 12px;
}

.body-style {
  padding: 20px;
}
.el-pagination {
  margin-top: 15px;
}
/* 解决级联选择器高度太高的问题 */
.el-popper .el-cascader-panel{
  max-height: 250px!important;
}

.el-input__inner{
  background-color: #3f99d9!important;
}

  .el-button{
    background-color:#5ecaee!important;
  }

/*.el-main{*/
/*  background-color: #293a61!important;*/
/*}*/

</style>
