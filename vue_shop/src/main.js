/*
 * @Author: your name
 * @Date: 2020-03-24 14:56:32
 * @LastEditTime: 2020-03-29 15:45:50
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /studyCode/vue_shop/src/main.js
 */
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import "./plugins/element.js";
// 导入全局样式表
import "./assets/css/global.css";
import TreeTable from "vue-table-with-tree-grid";
//导入富文本编辑器
import VueQuillEditor from "vue-quill-editor";
//导入富文本编辑器对应的样式
import "quill/dist/quill.core.css"; // import styles
import "quill/dist/quill.snow.css"; // for snow theme
import "quill/dist/quill.bubble.css"; // for bubble theme
//导入轻量级进度条
import nprogress from "nprogress";
import "nprogress/nprogress.css";

// 导入axios
import axios from "axios";
// 设置请求的根地址
axios.defaults.baseURL = "http://127.0.0.1:8808/api/private/v1/";
//在request拦截器中展示进度条nprogress.start()
// 相当于在请求之前预处理
// 给axios请求拦截器添加token
axios.interceptors.request.use(config => {
  nprogress.start();
  // 为请求头对象，添加token验证的Authorization字段
  config.headers.Authorization = window.sessionStorage.getItem("token");
  return config;
});
// 在response拦截器中，隐藏进度条nprogress.done()
axios.interceptors.response.use(config => {
  nprogress.done();
  return config;
});
// 把axios赋值给Vue的原型对象上
Vue.prototype.$http = axios;
Vue.use(axios);

Vue.config.productionTip = false;

Vue.component("tree-table", TreeTable);
//注册富文本编辑器为全局可用的组件
Vue.use(VueQuillEditor /* { default global options } */);
new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
