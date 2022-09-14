/**
 *  @FileCreator: StevenGao
 * @Date: 2022/2/15
 */

import http from "@/utils/request";

//this is a GET method demo api function as a demo, plz write the others base on this one.
export function getUserInfo<T>(params:any){
    return http.get<T>({
        url:'/home/getUserInfo',
        showLoading:false,
        params
    })
}

