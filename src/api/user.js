import http from "@/utils/request";

export function getCarousel() {
    return http.get({
        url: '/crs/select',
    })
}

export function uploadImg(data) {
    return http.post({
        url: '/imgbed/upload',
        data
    })
}

export function updateCarousel(data) {
    return http.post({
        url: '/crs/update',
        data
    })
}

export function getCategory() {
    return http.get({
        url: '/cate/all',
    })
}

export function postNews(data) {
    return http.post({
        url: '/art/create',
        data
    })
}

export function getNews() {
    return http.get({
        url: '/art/select/summary',
    })
}

export function getCategoryName(id) {
    return http.get({
        url: `/cate/name/${id}`,
    })
}

export function deleteNews(data) {
    return http.post({
        url: '/art/delete',
        data
    })
}

export function changeNewsStatue(data) {
    return http.post({
        url: '/art/update/status',
        data
    })
}

export function updateNews(data) {
    return http.post({
        url: '/art/update',
        data
    })
}

export function getLogCnt() {
    return http.get({
        url: '/log/cnt',
    })
}

export function getPointNews(id) {
    return http.get({
        url: `/art/select/${id}`,
    })
}

export function getLogsByPage(page, size) {
    return http.get({
        url: `/log/select/${page}/${size}`
    })
}

export function addLog(id, o) {

    //这里的axio封装会导致问题，因此直接使用fetch方法
    let formdata = new FormData();
    formdata.append("operation", o);
    formdata.append("articleId", id);
    formdata.append("operator", "admin");

    let myHeaders = new Headers();
    myHeaders.append("User-Agent", "Apifox/1.0.0 (https://apifox.com)");

    let requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow'
    };

    return fetch("https://news.twt.edu.cn/api/log/add", requestOptions)
      .then(response => response.text())
      .then(result => console.log(result))
      .catch(error => console.log('error', error));
}