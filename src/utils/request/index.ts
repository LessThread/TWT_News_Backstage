import MYRequest from "@/utils/request/request";
import {BASE_URL, TIMEOUT} from "@/utils/request/config";
import qs from 'querystring';

const myRequest = new MYRequest({
    baseURL: BASE_URL,
    timeout: TIMEOUT,
    interceptors: {
        requestInterceptor: (config) => {
            const token = ''
            if (token) {
                const configs = config.headers as any;
                configs.Authorization = `${token}`;
            }
            return config;
        },
        requestInterceptorCatch: (err) => {
            console.log("请求拦截失败")
            return err
        },
        responseInterceptor: (res) => {
            console.log("响应成功的拦截");
            return res;
        },
        responseInterceptorCatch: (err) => {
            console.log("响应失败的拦截");
            return err;
        }
    },
    transformers:[
        (oldData,headers)=>{
            if(headers===undefined){
                headers={}
                headers['Content-Type']='application/x-www-form-urlencoded'
                return qs.stringify(oldData);
            }else{
                switch (headers['Content-Type']) {
                    case 'multipart/form-data':
                        return oldData;
                    case 'application/json':
                        return JSON.stringify(oldData)
                    default:
                        return qs.stringify(oldData);
                }
            }
        }
    ]
})

export default myRequest;
