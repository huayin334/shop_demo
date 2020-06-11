/*
 * @Author: your name
 * @Date: 2020-03-24 14:56:32
 * @LastEditTime: 2020-03-30 19:39:38
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /studyCode/vue_shop/src/router/index.js
 */
import Vue from "vue";
import VueRouter from "vue-router";
import Login from "../components/Login.vue";
import Home from "../components/Home.vue";
import Welcome from "../components/Welcome.vue";
import Users from "../components/user/Users.vue";
import Rights from "../components/power/Rights.vue";
import Roles from "../components/power/Roles.vue";
import Cate from "../components/goods/Cate.vue";
import Params from "../components/goods/Params.vue";
import Goods from "../components/goods/Goods.vue";
import Add from "../components/goods/Add.vue";
import Order from "../components/order/Order.vue";
import Report from "../components/report/Report.vue";

// 重写路由的push方法 vue-cli4+的坑 不然跳转不了
// 好像是对的
// const routerPush = VueRouter.prototype.push
// VueRouter.prototype.push = function push(location) {
//   return routerPush.call(this, location).catch(error=> error)
// }

Vue.use(VueRouter);

const routes = [
  {path: "/", redirect: "/login"},
  {path: "/login", component: Login},
  {
    path: "/home",
    component: Home,
    redirect: "/welcome",
    children: [
      {path: "/welcome", component: Welcome},
      {path: "/users", component: Users},
      {path: "/rights", component: Rights},
      {path: "/roles", component: Roles},
      {path: "/categories", component: Cate},
      {path: "/params", component: Params},
      {path: "/goods", component: Goods},
      {path: "/goods/add", component: Add},
      {path: "/orders",component:Order},
      {path: "/reports",component:Report},
    ]
  }
];

const router = new VueRouter({
  routes
});

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to将要访问的路径
  // from代表从哪个路径跳转而来
  // next是一个函数 表示放行 next('/login')强制跳转到登录页
  if (to.path === "/login") return next();
  // 获取token
  const tokenStr = window.sessionStorage.getItem("token");
  if (!tokenStr) return next("/login");
  next();
});
export default router;
