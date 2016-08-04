import $ from 'jquery'
import _ from 'lodash'

import {getToken,removeToken} from './cookies'

/*
*  request args ,jquery ajax的args
*  { url, method, header, data ...}
*/
function Request(args){
  if(!args.url){
    console.error("url不能为空");
    return;
  }

  var baseConfig = {
    contentType: 'application/json',
    timeout : 5000
  }

  //如果用户没设置下面两个属性则自动设置,如果有设置,将被用户的设置覆盖
  if(args.credentials && args.credentials != 'include'){
    delete args.credentials
    baseConfig.xhrFields = {
      withCredentials: true
    }
    baseConfig.crossDomain = true
  }

  var token = getToken();
  if(token){
    //代表有参数
    if(args.url.indexOf('?') !== -1){
      args.url = `${args.url}&token=${token}`
    }else{
      args.url = `${args.url}?token=${token}`
    }
  }

  const finalConfig = Object.assign({}, baseConfig, args)

  return new Promise((resolve,reject) => {
    console.log(`[RESTACK] sending request to: ${finalConfig.url}`)
    $.ajax(finalConfig).then(
      (data,xhr) =>{
        console.log('[RESTACK] request success')
        resolve(data)
      },
      (err) => {
        switch (err.status){
          case 403:
            if(getToken()){
              alert('您的账号已在其他地方登陆,为了保障账号信息安全,请重新登陆.');
              removeToken()
            }
            window.location.href = '/login'
            break;
          case 401:
            if(getToken()){
              alert('账号或者密码错误.');
              removeToken()
            }
            window.location.href = '/login'
            break
          default:

        }
        console.warn(err)

        reject(err);
      })
  })

}

/**
 * 使用async的请求wrapper
 * @param  {String} url
 * @param  {Object} ajax args
 * @return {Promise}
 */
async function callAPI(endpoint, args) {
  var data;
  // 某些系统不能识别json object
  if(args.data && !args.keepJs) args.data = JSON.stringify(args.data);
  try{
    data = await Request(Object.assign({},args,{url:endpoint}));
  } catch(e) {
    throw e;
  }
  return data;
}


export { Request ,callAPI}
export default callAPI
