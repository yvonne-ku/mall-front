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
// 请求验证码
export const sendSmsCode = (params) => {
  return http.fetchPost("/member/verify/code/send", params);
};


// 上传图片
export const uploadAvatarImg = (params) => {
  return http.fetchPost('/member/uploadAvatarImg', params)
}
// 修改头像
export const updateAvatarImg = (params) => {
  return http.fetchPost('/member/updateAvatarImg', params)
}


// 获取用户地址
export const addressList = (params) => {
  return http.fetchPost("/member/addressList", params);
};
// 通过id获取地址
export const getAddress = (params) => {
  return http.fetchPost("/member/address", params);
};
// 修改收货地址
export const addressUpdate = (params) => {
  return http.fetchPost("/member/updateAddress", params);
};
// 添加收货地址
export const addressAdd = (params) => {
  return http.fetchPost("/member/addAddress", params);
};
// 删除收货地址
export const addressDel = (params) => {
  return http.fetchPost("/member/delAddress", params);
};