<script setup>
import BreadCrumbs from '../components/BreadCrumbs.vue';
import { getCartStore } from '../store/addtocart';
import { useRouter, useRoute } from 'vue-router';
import NavBar from "../components/NavBar.vue";
import FooterComp from '../components/FooterComp.vue'

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
</style>