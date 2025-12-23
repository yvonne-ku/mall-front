import http from "./public";

// 首页接口
export const homePanel = (params) => {
    return http.fetchGet('/api/home/panel', params)
}

// 全部商品
export const homeAllGoods = (params) => {
    return http.fetchGet("/api/home/allGoods", params);
};