<script setup>
import SideMenu from '../components/SideMenu.vue'
import Carosusel from '../components/Carosusel.vue'
import FlashSaleSection from '../components/FlashSaleSection.vue';
import getSalesProduct from '../composables/getSalesProduct'
import { computed, onMounted, ref } from 'vue';
import ExploreProducts from '../components/ExploreProducts.vue';
import { getCartStore } from '../store/addtocart';
import CategoryComp from '../components/CategoryComp.vue'

</script>

<template>
    <div class=" q-pa-md  " >
        <div class="row q-pt-md ">
            <div class="col-3 ">
                <side-menu />
            </div>
            <div class="col-9 q-px-xl" >
                <Carosusel />
            </div>

        </div>
        <div class="row q-px-xl q-mt-md">
            <CategoryComp/>
        </div>

        <div class="row q-px-xl q-mt-md">
            <FlashSaleSection title="Top products" toptitle="Featured" :countDown=true :featured=true />
        </div>
        <div class="row q-px-xl ">
            <FlashSaleSection title="All Products" toptitle="Products" :countDown=false :featured=false />
        </div>
        <div class="row q-px-xl q-mt-md">
            <ExploreProducts />

        </div>

    </div>


</template>


<style scoped>

</style>