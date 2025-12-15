import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
// 图片懒加载：图片进入可视区域才加载
import VueLazyload from "vue-lazyload";
// 无限滚动加载
import infiniteScroll from "vue-infinite-scroll";
// 更方便地操作浏览器 Cookie
import VueCookie from "vue-cookie";
// 内容加载时显示占位符的插件
import VueContentPlaceholders from "vue-content-placeholders";
// Element UI 库
import {
  Button,
  Pagination,
  Checkbox,
  Icon,
  Autocomplete,
  Loading,
  Message,
  Notification,
  Steps,
  Step,
  Table,
  TableColumn,
  Input,
  Dialog,
  Select,
  Option,
} from "element-ui";
// 操作 localStorage 的方法
import { getStore } from "@utils/storage";
// 操作用户信息的方法
import { userInfo } from "@api";

Vue.use(VueContentPlaceholders);
Vue.use(Button);
Vue.use(Pagination);
Vue.use(Checkbox);
Vue.use(Icon);
Vue.use(Autocomplete);
Vue.use(Steps);
Vue.use(Step);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Input);
Vue.use(Dialog);
Vue.use(Select);
Vue.use(Option);
Vue.use(Loading.directive);
Vue.use(infiniteScroll);
Vue.use(VueCookie);
Vue.use(VueLazyload, {
  // preLoad: 1.3,
  // error: 'dist/error.png',
  loading: "/images/load.gif",
  // attempt: 1
});

// 将 Element UI 的一些方法挂载到 Vue 上供实例使用
Vue.prototype.$loading = Loading.service;
Vue.prototype.$notify = Notification;
Vue.prototype.$message = Message;

// 关闭生产提示
Vue.config.productionTip = false;

// 不需要登陆的页面
const whiteList = [
  "/home",
  "/goods",
  "/login",
  "/register",
  "/goodsDetails",
  "/thanks",
  "/search",
  "/refreshsearch",
  "/refreshgoods",
];

// router.beforeEach(function (to, from, next) {
//   let params = {
//     params: {
//       token: getStore("token"),
//     },
//   };
//   userInfo(params).then((res) => {
//     if (res.result.state !== 1) {
//       // 没登录
//       if (whiteList.indexOf(to.path) !== -1) {
//         // 白名单
//         next();
//       } else {
//         next("/login");
//       }
//     } else {
//       store.commit("RECORD_USERINFO", { info: res.result });
//       if (to.path === "/login") {
//         //  跳转到
//         next({ path: "/" });
//       }
//       next();
//     }
//   });
// });

/* eslint-disable no-new */
new Vue({
  el: "#app",
  store,
  router,
  render: (h) => h(App),
});
