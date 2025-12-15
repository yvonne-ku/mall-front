import axios from "axios";

axios.defaults.timeout = 100000; // 设置请求超时时间为 10 秒
axios.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";  // 设置 POST 请求的 Content-Type 为 application/x-www-form-urlencoded，类似于 name=张三&age=20

export default {
    fetchGet(url, params = {}) {
        return new Promise((resolve, reject) => {
            axios
                .get(url, params)
                .then((res) => {
                    resolve(res.data);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    },
    fetchPost(url, params = {}) {
        return new Promise((resolve, reject) => {
            axios
                .post(url, params)
                .then((res) => {
                    resolve(res.data);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    },
};
