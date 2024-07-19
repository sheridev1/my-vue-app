<script setup>

import { useRouter } from 'vue-router';
import GridComp from './GridComp.vue';

import { defineProps } from 'vue';

const props = defineProps({

    products: {
        type: Array
    }
})

const router = useRouter()



</script>



<template>

    <div class='column  q-gutter-x-md ' style="width:100%">
        <div class="top-section row ">
            <div class="row q-gutter-sm">
                <div class="red rounded-borders" style="height: 40px; width: 20px;"></div>
                <div class="q-mt-md text-h6">Our Products</div>
            </div>
        </div>
        <div class="row q-mt-md">
            <div class="col text-h5">Explore Our Products</div>

            <div class="col  float-left">
                <div class="q-gutter-sm  float-right">
                    <q-btn @click="router.push({ name: 'allproducts', query: { featured: 'false', page:1 } })"
                        style="background: #DB4444; color: white" label="View All" />
                </div>
            </div>
        </div>
        <div class="row full-width" align="center">
            <div class="col q-mb-sm ">
                <GridComp :products="props.products" />
            </div>
        </div>

    </div>

</template>


<style scoped>
.red {
    background-color: #DB4444;

}
</style>
