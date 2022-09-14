<template>
  <div class="main">
    <MainHeader />
    <div class="content">
      <Navtree class="nav" />
      <div id="screen" class="screen">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>


<script>
import Navtree from "@/components/Navtree.vue";
import MainHeader from "@/components/MainHeader.vue";
export default {
  components: {
    Navtree,
    MainHeader,
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
}
.content {
  display: flex;
}
</style>
