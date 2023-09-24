<template>
    <div class="access">
      <p class="title">日志</p>
      <div>
        <h4>日志总数：{{ LogCnt }}</h4>
  
        <div style="display: flex;margin-top:10px;margin-bottom:20px">
            <p style="align-self: center">选择页码</p>
            <div style="width:25%;left:0;display: inline-block">
              <el-pagination layout="prev, pager, next" 
              :total="(Math.ceil(LogCnt/ LogPageSize))?(Math.ceil((LogCnt/ LogPageSize))*10):(1)" 
              v-model:current-page="CurrentPage"
              />
            </div>
        </div>
  
        <div style="width: 30%;">
            <el-timeline>
              <el-timeline-item
                v-for="(activity, index) in LogList"
                :key="index"
                
              >
              <el-divider content-position="left">{{ activity.releaseTime }}&nbsp;操作人:{{activity.operator}}</el-divider>
                <p></p>
                <p style="font-size: 20px;">{{activity.operation}}&nbsp;文章ID:{{activity.articleId}}</p>
                <br/>
              </el-timeline-item>
            </el-timeline>
        </div>
    </div>

    </div>



  </template>

  <script>
  import { getCategory, uploadImg, postNews, updateNews ,getLogCnt,getLogsByPage,addLog} from "@/api/user";
  import { BASE_URL } from "@/utils/request/config";
  import { onBeforeUnmount, ref, shallowRef, onMounted,watch} from 'vue'
  import {ROOT_URL} from '@/global.js'

  export default{
    setup()
    {
      const LogCnt = ref()
      const CurrentPage = ref(1)
      const LogList = ref([])
      const LogPageSize = 10;
      
      let setLogCont = function(){
        getLogCnt().then(res => {
          LogCnt.value = res.result
        })
      }

      let getLogs = function(){
        getLogsByPage(CurrentPage.value, LogPageSize).then(res => {
          for (let item of res.result){
            LogList.value.push({
              "operator": item.operator,
              "operation": item.operation,
              "articleId": item.articleId,
              "releaseTime": item.releaseTime
            })
          }
          
        })
      }


      //这里不显示文章ID的原因是后端不会返回已删除文章的name
      let getArtName = function(id){
        getPointNews(id).then(res =>{
        })
      }

      onMounted(() => {
        setLogCont()
        getLogs()
      }); 

      watch(CurrentPage, (newValue, oldValue) => {
        getLogsByPage(CurrentPage.value, LogPageSize).then(res => {
          LogList.value = [];
          for (let item of res.result){
            console.log(item)
            LogList.value.push({
              "operator": item.operator,
              "operation": item.operation,
              "articleId": item.articleId,
              "releaseTime": item.releaseTime
            })
          }
        })
      })

      return{
        LogCnt,
        LogList,
        CurrentPage,
        LogPageSize
      }
    }
  }
  </script>
  
  <style scoped>
  .access {
    width: 100%;
    padding: 30px;
    background-color: #ffffff;
    border-radius: 16px;
    box-sizing: border-box;
  }
  .title {
    color: #2a2a2a;
    font-weight: 700;
    font-size: 24px;
    margin-bottom: 30px;
  }
  </style>
  