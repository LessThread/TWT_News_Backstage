<template>
    <div class="access">
      <p class="title">日志</p>
    </div>

    <div>
      <h4>日志总数：{{ LogCnt }}</h4>

      <div>
          <div class="example-pagination-block">
            <div class="example-demonstration">选择页码</div>
            <el-pagination layout="prev, pager, next" :total="50" />
          </div>
      </div>

      <div>
          <el-timeline>
            <el-timeline-item
              v-for="(activity, index) in activities"
              :key="index"
              :timestamp="activity.timestamp"
            >
              {{ activity.content }}
            </el-timeline-item>
          </el-timeline>
      </div>

    </div>



  </template>

  <script>
  import { getCategory, uploadImg, postNews, updateNews ,getLogCnt} from "@/api/user";
  import { BASE_URL } from "@/utils/request/config";
  import { onBeforeUnmount, ref, shallowRef, onMounted} from 'vue'
  import {ROOT_URL} from '@/global.js'

  export default{
    setup()
    {
      const LogCnt = ref()
      const LogList = ref([])
      const activities = [
      {
        content: 'Event start',
        timestamp: '2018-04-15',
      },
      {
        content: 'Approved',
        timestamp: '2018-04-13',
      },
      {
        content: 'Success',
        timestamp: '2018-04-11',
      },
    ]
      
      let setLogCont = function(){
        getLogCnt().then(res => {
          LogCnt.value = res.result
        })
      }

      onMounted(() => {
        setLogCont()
      }); 

      return{
        LogCnt,
        activities
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
  