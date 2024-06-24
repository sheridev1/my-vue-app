<script setup>
import { useProductsStore } from '../store/products';
import slide1 from '../assets/p3.png';
import { ref, onMounted } from 'vue';
import { useRouter } from "vue-router";
import { getFavProductStore } from '../store/favouriteItems';
import { QInfiniteScroll, QSpinner } from 'quasar';

const productsFavStore = getFavProductStore();
const productsStore = useProductsStore();
const IMAGEURL = slide1;
const router = useRouter();
let batchSize = 8;
let startIndex = 0;
const loading = ref(false);
const allProducts = ref([]);
const displayedProducts = ref([]);
const star=ref(1)


// Function to navigate to product details
const viewProduct = (id) => {
    router.push({ name: 'ProductDetail', params: { id } });
};
// Fetch products on component mount
const loadInitialProducts = async () => {
    loading.value = true;
    await productsStore.fetchProducts();
    allProducts.value = productsStore.products;
    displayedProducts.value = allProducts.value.slice(0, batchSize);
    loading.value = false;
};

// Load more products as the user scrolls down
const loadMoreProducts = async () => {
    loading.value = true;
    startIndex += batchSize;
    const remainingProducts = allProducts.value.length - (startIndex);
    console.log("remainin", remainingProducts)
   
    displayedProducts.value = allProducts.value.slice(0, startIndex + batchSize);
    console.log("displayed", displayedProducts.value)
    loading.value = false;
};

onMounted(loadInitialProducts);
</script>

<template>
    <div class="full-width row wrap justify-center items-center content-center q-col-gutter-md">
        <template v-if="displayedProducts.length > 0">
            <q-infinite-scroll @load="loadMoreProducts" :offset="10">
                <div class="row wrap justify-center items-center content-center q-col-gutter-md">
                    <div class="col-3" v-for="item in displayedProducts" :key="item.id">
                        <q-card class="my-card" @click="viewProduct(item._id)">
                            <img :src="IMAGEURL" alt="image">
                            <div class="absolute-right column">
                                <q-btn flat round :color="productsFavStore.isProductFavorite(item._id) ? 'red' : 'grey'"
                                    icon="favorite"
                                    @click="(event) => { event.stopPropagation(); productsFavStore.toggleFavorite(item._id) }"></q-btn>
                            </div>
                            <q-card-section>
                                <div class="text-h6 text-left">{{ item?.name }}</div>
                                <div class="text-subtitle2 text-left flex row justify-between"  style="font-weight: 300;">$ {{ item?.price }}
                                    <div class="" >
                                        {{ item.averageRating }}
                                        <q-rating v-model="star" :max="1" size="2em" color="#ffb302" icon="star_border" readonly
                                        icon-selected="star"></q-rating>
                                    </div>
                                </div>
                            </q-card-section>
                        </q-card>
                    </div>
                </div>
                <q-spinner v-if="loading" color="primary" size="40px" />
            </q-infinite-scroll>
        </template>
        <template v-else>
            <div class="col-3" v-for="item in 8" :key="item.id">
                <q-card class="my-card">
                    <q-skeleton height="200px" square />
                    <q-card-section>
                        <q-skeleton type="text" />
                        <q-skeleton type="text" width="60%" />
                        <q-skeleton type="QRating" />
                    </q-card-section>
                </q-card>
            </div>
        </template>
    </div>
</template>

<style scoped>
.color {
    background-color: #DB4444;
}

.my-card {
    cursor: pointer;
}
</style>
