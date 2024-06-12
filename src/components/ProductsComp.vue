<script setup>
import getAllProduct from '../composables/getAllProducts';
import { useRoute, useRouter } from 'vue-router';
import { computed, ref, onMounted, watch } from 'vue';
import slide1 from '../assets/p2.png';
import { useProductsStore } from '../store/products';
import { getFavProductStore } from '../store/favouriteItems';

let IMAGEURL = slide1;
const route = useRoute();
const router = useRouter();
const productsStore = useProductsStore();
const products = computed(() => productsStore.products);
const current = ref(1);
const productsFavStore = getFavProductStore();
const loading = ref(true);

console.log("categoryes", productsStore.limitedCategory);

const getFeatured = computed(() => {
    if (route.params.category) {
        return productsStore.limitedCategory;
    } else if (route.params.featured == 'true') {
        return productsStore.filtered;
    } else {
        return productsStore.limitedProducts;
    }
});

const totalProducts = computed(() => {
    if (route.params.category) {
        return productsStore.limitedCategory.length;
    } else if (route.params.featured == 'true') {
        return productsStore.filtered.length;
    } else {
        return productsStore.products.length;
    }
});

//calculating total number
const maxPage = computed(() => {
    if (route.params.category) {
        const totalFeaturedProducts = productsStore.limitedCategory.length;
        return Math.ceil(totalFeaturedProducts / 8);
    } else if (route.params.featured == 'true') {
        const totalFeaturedProducts = productsStore.filtered.length;
        return Math.ceil(totalFeaturedProducts / 8);
    } else {
        const totalProducts = productsStore.products.length;
        return Math.ceil(totalProducts / 8);
    }
});

onMounted(async () => {
    loading.value = true;
    await productsStore.fetchProducts();
    await productsStore.filterProducts();
    await productsStore.filterCategories(route.params.category, current.value);
    await productsStore.getProduct(current.value);
    loading.value = false;
});

const viewProduct = (id) => {
    router.push({ name: 'ProductDetail', params: { id } });
};

watch(current, async (newPage) => {
    loading.value = true;
    await productsStore.getProduct(newPage);
    loading.value = false;
});

const handleRoute = (val) => {
    router.push({ name: 'allproducts', params: { search: route.params.search, page: current.value } });
}
</script>

<template>
    <div class="q-pa-md">
        <div class="text-h3 q-pt-md q-ml-md q-my-md">All Products</div>
        <div class="q-mb-md q-ml-md">
            <span v-if="!loading">Displaying {{ getFeatured.length }} out of {{ totalProducts }} products</span>
        </div>
        <template v-if="loading">
            <div class="full-width row wrap justify-center items-center content-center q-col-gutter-md">
                <div class="col-3" v-for="item in 8" :key="item">
                    <q-card class="my-card">
                        <q-skeleton height="200px" square />
                        <q-card-section>
                            <q-skeleton type="text" />
                            <q-skeleton type="text" width="60%" />
                            <q-skeleton type="QRating" />
                        </q-card-section>
                    </q-card>
                </div>
            </div>
        </template>
        <template v-else>
            <div class="full-width row wrap justify-center items-center content-center q-col-gutter-md">
                <div class="col-3" v-for="item in getFeatured" :key="item.id">
                    <q-card class="my-card" style="width:300px;" @click="viewProduct(item._id)">
                        <img :src="IMAGEURL" style="height: 250px;" alt="image">
                        <div class="absolute-right column">
                            <q-btn flat round :color="productsFavStore.isProductFavorite(item._id) ? 'red' : 'grey'"
                                icon="favorite"
                                @click="(event) => { event.stopPropagation(); productsFavStore.toggleFavorite(item._id) }"></q-btn>
                        </div>
                        <q-card-section>
                            <div class="text-h6 text-left">{{ item?.name }}</div>
                            <div class="text-subtitle2 text-left">$ {{ item?.price }}</div>
                            <div class="q-gutter-y-md column">
                                <q-rating v-model="item.averageRating" size="2em" color="gold-5" icon="star_border"
                                    readonly icon-selected="star"></q-rating>
                            </div>
                        </q-card-section>
                    </q-card>
                </div>
            </div>
            <div class="q-pa-lg flex flex-center">
                <q-pagination v-model="current" :max="maxPage" color="black" active-color="accent"
                    @update:model-value="handleRoute" />
            </div>
        </template>
    </div>
</template>

<style scoped>
.my-card {
    cursor: pointer;
}
</style>
