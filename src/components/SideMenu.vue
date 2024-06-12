<script setup>
import { ref, onMounted,computed } from "vue";
import { useProductsStore } from "../store/products";
import { useRouter } from "vue-router";


const productsStore = useProductsStore();
const products = computed(() => productsStore.products);


const router = useRouter();
onMounted(() => {
    productsStore.fetchProducts();
    // console.log(props, 'props')
})


const show=(category)=>{
  console.log("catgory side menu", category)
  router.push({ name: 'allproducts', params: { featured:'false', category , page:1} })
  
}
const categories = [
  "Mobile",
  "smartwatch",
  "Assessory",
  "gamingconsole",
];
</script>

<template>
  <div class="row border">
   
    <ul class="col-9 ">
      <li v-for="categorie in categories" :key="categorie"  @click="show(categorie)">{{categorie}}</li>
    </ul>
    <div class="col-3  q-mt-lg ">
      <i class="fa-solid fa-arrow-right q-ml-md"></i>
      <div class="q-mt-sm ">
        <i class="fa-solid fa-arrow-right q-ml-md"></i>
      </div>
      <div class="q-mt-sm ">
        <i class="fa-solid fa-arrow-right q-ml-md"></i>
      </div>
    </div>
  </div>
</template>


<style scoped>
li {
  cursor: pointer;
  text-decoration: none;
  list-style: none;
  font-size: 16px;
  line-height:2rem;
}
.border{
    border-right: 0.5px solid black;
}
</style>