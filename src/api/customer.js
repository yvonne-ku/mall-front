import http from "./public";
// 登陆
export const userLogin = (params) => {
  return http.fetchPost("/api/customer-user/login", params);
};
// 退出登陆
export const loginOut = (params) => {
  return http.fetchGet("/api/customer-user/loginOut", params);
};
// 用户信息
export const userInfo = (params) => {
  return http.fetchGet("/api/customer-user/checkLogin", params);
};
// 注册账号
export const register = (params) => {
  return http.fetchPost("/api/customer-user/register", params);
};
// 极验验证码
export const geetest = (params) => {
  return http.fetchGet(
    "/api/customer-user/geetestInit?t=" + new Date().getTime(),
    params
  );
};
// 请求验证码
export const sendSmsCode = (params) => {
  return http.fetchPost("/api/customer-user/verify/code/send", params);
};
