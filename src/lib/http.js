import axios from 'axios';
const Qs = require('qs')
// 请求发送之前的拦截器
axios.interceptors.request.use(config => {
 /*    config.headers['If-Modified-Since'] = '0' */
    return config
}, error => {
    return Promise.reject(error)
})
/*  axios.default.baseUrl=""; */
// 请求响应拦截器
axios.interceptors.response.use(res => {
    return Promise.resolve(res)
}, error => {
    return Promise.reject(error)
})

export function ajax(amount) {
    /* context.commit(types.SWITCH_LOADING, true) */
    return new Promise(function (resolve, reject) {
        if (typeof amount === 'string') { //只传url默认get请求
            axios.get(amount).then((response) => {
                if (response.status === 200) {
                    resolve(response.data)
                }
            })
        } else if (amount.method === 'get') {
            axios.get(amount.url, {
                params: amount.data,
                paramsSerializer: params => {
                    return Qs.stringify(params, { indices: false })
                  }
            }).then((response) => {
                if (response.status === 200) {
                    resolve(response.data)
                }
            })

        } else if (amount.method === 'post') {
            axios.post(amount.url, amount.data).then((response) => {
                if (response.status === 200) {
                    resolve(response.data)
                }
            })
        }else{
            reject();
        }
    })
}