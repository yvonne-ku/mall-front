import http from "./public";
// 登陆
export const userLogin = (params) => {
  return http.fetchPost("/member/login", params);
};
// 退出登陆
export const loginOut = (params) => {
  return http.fetchGet("/member/loginOut", params);
};
// 用户信息
export const userInfo = (params) => {
  return http.fetchGet("/member/checkLogin", params);
};
// 注册账号
export const register = (params) => {
  return http.fetchPost("/member/register", params);
};
// 极验验证码
export const geetest = (params) => {
  return http.fetchGet(
    "/member/geetestInit?t=" + new Date().getTime(),
    params
  );
};
// 请求验证码
export const sendSmsCode = (params) => {
  return http.fetchPost("/member/verify/code/send", params);
};
