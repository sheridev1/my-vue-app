<script setup>
import ProductCards from './ProductCards.vue';
import { computed, defineProps, onMounted } from 'vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useProductsStore } from '../store/products';



// const props = defineProps(['title','toptitle','countDown','products'])
const props = defineProps({
    title: String,
    toptitle: String,
    countDown: Boolean,
    featured: Boolean
})

const router = useRouter()
const productsStore = useProductsStore();
const products = computed(() => productsStore.products);

onMounted(() => {
    productsStore.fetchProducts();

})





</script>

<template>
    <div class='column  q-gutter-x-md' style="width:100%">
        <div class="top-section row ">
            <div class="row q-gutter-sm">
                <div class="bg-accent rounded-borders" style="height: 40px; width: 20px;"></div>
                <div class="q-mt-md text-h6">{{ toptitle }}</div>
            </div>
        </div>
        <div class="row q-mt-md">
            <div class="col text-h5">{{ title }}</div>
            <div v-show="countDown" class="col-6">
                <div class="q-mt-sm">
                    <vue-countdown class="text-body1" :time="2 * 24 * 60 * 60 * 1000"
                        v-slot="{ days, hours, minutes, seconds }">
                        Time Remaining：{{ days }} days, {{ hours }} hours, {{ minutes }} minutes, {{ seconds }}
                        seconds.
                    </vue-countdown>
                </div>
            </div>
            <div class="col  float-left">
                <div class="q-gutter-sm float-right">
                    <q-btn color="accent" @click="router.push({ name: 'allproducts', params: { featured: featured, page:1 } })"
                        text-color="white" label="View All" class="q-my-lg" style="width:100px; " />
                </div>
            </div>

        </div>


        <div class="row full-width">
            <div class="col  q-mb-sm justify-between">
                <ProductCards :featured="featured" />
            </div>
        </div>


    </div>

</template>



<style scoped>
.red {
    background-color: #DB4444;

}

h1 {
    font-size: 20px;
}
</style>
