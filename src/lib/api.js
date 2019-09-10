const HTTP = require('./http.js');
const api = {
  login: (params = {}) => {//登录
    return HTTP.ajax({
      url:'/api/user/login',
      method: 'get',
      data: params
    })
  },
  fileUpload: (params = {}) => {//文件上传
    return HTTP.ajax({
      url: '/api/file/upload',
      method: 'post',
      data: params
    })
  },
  addInfo: (params = {}) => {//资料添加
    return HTTP.ajax({
      url:  '/api/house/add',
      method: 'get',
      data: params
    })
  },
  updateInfo:(params={})=>{//资料修改
    return HTTP.ajax({
      url:'/api//house/update',
      method: 'get',
      data: params
    })
  },
  address: (params = {}) => {//地区查询
    return HTTP.ajax({
      url:'/api//house/branch',
      method: 'get',
      data: params
    })
  },
  houselist: (params = {}) => {//获取房屋列表
    return HTTP.ajax({
      url: '/api//house/applet_list',
      method: 'get',
      data: params
    })
  },
}
export default api