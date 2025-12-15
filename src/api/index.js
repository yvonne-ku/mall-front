import http from "./public";
// 登陆
export const userLogin = (params) => {
  return http.fetchPost("/customer-user/login", params);
};
// 退出登陆
export const loginOut = (params) => {
  return http.fetchGet("/customer-user/loginOut", params);
};
// 用户信息
export const userInfo = (params) => {
  return http.fetchGet("/customer-user/checkLogin", params);
};
// 注册账号
export const register = (params) => {
  return http.fetchPost("/customer-user/register", params);
};
// 上传图片
export const upload = (params) => {
  return http.fetchPost("/customer-user/imageUpload", params);
};
// 修改头像
export const updateheadimage = (params) => {
  return http.fetchPost("/customer-user/updateheadimage", params);
};
// 捐赠列表
export const thanksList = (params) => {
  return http.fetchGet("/customer-user/thanks", params);
};
// 首页接口
export const productHome = (params) => {
  return http.fetchGet("/goods/home", params);
};
// 首页接口
export const navList = (params) => {
  return http.fetchGet("/goods/navList", params);
};
// 推荐板块
export const recommend = (params) => {
  return http.fetchGet("/goods/recommend", params);
};
// 捐赠板块
export const thank = (params) => {
  return http.fetchGet("/goods/thank", params);
};
// 极验验证码
export const geetest = (params) => {
  return http.fetchGet(
    "/customer-user/geetestInit?t=" + new Date().getTime(),
    params
  );
};
export const sendSmsCode = (params) => {
  return http.fetchPost("/customer-user/verify/code/send", params);
};
