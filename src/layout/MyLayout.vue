<script setup>
import BreadCrumbs from '../components/BreadCrumbs.vue';
import { getCartStore } from '../store/addtocart';
import { useRouter, useRoute } from 'vue-router';
import NavBar from "../components/NavBar.vue";
import FooterComp from '../components/FooterComp.vue'
import FloatingBtn from '../components/FloatingBtn.vue';

const cartStore = getCartStore();
const route=useRoute();
const handleClickOutside = () => {
  cartStore.isCartDrawerOpen = false;
}


console.log("Routes",route.params.id)
</script>

<template>
  <q-layout view="hHh lpR fff">
    <!-- header -->
    <NavBar />
    
    <q-page-container>
      <!-- <BreadCrumbs /> -->
      <div :class="{ 'blur-background': cartStore.isCartDrawerOpen }" @click="handleClickOutside">
        <router-view />
        <FloatingBtn class="floatingbtn" v-if="route.meta.showFloatingButton"/>
      </div>
    </q-page-container>
    <!--footer  -->
    
    <FooterComp />
   
  </q-layout>
</template>






<style scoped>
.blur-background {
  filter: blur(5px);
  /* Adjust the blur value as needed */
  transition: filter 0.3s ease;

}

.floatingbtn{
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
}
</style>