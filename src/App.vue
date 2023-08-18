<template>
  <div class="main">
    <MainHeader />
    <div class="content">
      <Navtree class="nav" />
      <!-- 临时守卫 -->
      <div class="TempkeyBox" v-show="!is">
        后台管理员密码
        <input type="password"  v-model="Tempkey" placeholder="" @keyup.enter="proofreadKey(Tempkey)"/>
        <button @click="proofreadKey(Tempkey)" >确认</button>
        <div>
          <h3>更新日志 V0.2.3</h3>
          <li>恢复富文本和MD兼容</li>
          <li>添加审核页面</li>
          <li>删除操作会进行二次确认</li>
        </div>
      </div> 
    <!-- 临时守卫 -->
      <div ref="screen" class="screen" v-show="is">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>


<script>
import Navtree from "@/components/Navtree.vue";
import MainHeader from "@/components/MainHeader.vue";
export default {
  data() {
    return {
      is:0,
      Tempkey:"",
    };
  },
  components: {
    Navtree,
    MainHeader,
  },
  created(){
      console.log("isPassword")
      let isPassword=localStorage.getItem("password");
      console.log("isPassword")
      console.log(isPassword);
      if(isPassword==1){
        this.is=1
      }
    },
  methods: {
    scrollTop() {
      this.$refs.screen.scrollTop = 0;
    },
    proofreadKey(Tempkey){
      if(Tempkey=="20000608")
      {
        this.is=1;
        localStorage.setItem("password",1);
      }
      
    }

  },
};
</script>


<style scoped>
.main {
  min-height: 100vh;
  background-color: #f8f8f8;
}
.screen {
  flex: 1;
  background-color: #f8f8f8;
  overflow: overlay; /*auto*/
  padding: 30px;
  height: calc(100vh - 86px);
}
.content {
  display: flex;
}
</style>


<style scoped>
  .TempkeyBox{
    position: absolute;
    left: 40%;
    top:30%;
  }
</style>