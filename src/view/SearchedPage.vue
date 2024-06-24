<script setup>
import { useProductsStore } from '../store/products';
import { computed, onMounted, ref, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import slide1 from '../assets/p2.png';
import { getFavProductStore } from '../store/favouriteItems';

const route = useRoute();
const router = useRouter();
let debounceTimeout;
let IMAGEURL = slide1;
const star=ref(1);
const loading = ref(true);
const productsFavStore = getFavProductStore();
const productsStore = useProductsStore();
const searchResults = computed(() => productsStore.searchedProduct || []);
const sortCriteria = ref('Price Low To High'); // default sorting criteria

const handleSearch = async () => {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(async () => {
        await productsStore.searchProductsByName(route.params.search);
    }, 1500);
};

const viewProduct = (id) => {
    router.push({ name: 'ProductDetail', params: { id } });
};

// Pagination
let itemsPerPage = 4; // Number of items to display per page
let currentPage = ref(1);

const totalItems = computed(() => searchResults.value.length);
const maxPage = computed(() => Math.ceil(totalItems.value / itemsPerPage));

onMounted(() => {
    loading.value = true;
    handleSearch();
    loading.value = false;
});

const sortedAndVisibleResults = computed(() => {
    let sortedResults = searchResults.value.slice().sort((a, b) => {
        if (sortCriteria.value === 'Price Low To High') {
            return a.price - b.price;
        } else if (sortCriteria.value === 'Price High To Low') {
            return b.price - a.price;
        }
        return 0;
    });

    const startIndex = (currentPage.value - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedResults.slice(startIndex, endIndex);
});

const handleRoute = (val) => {
    router.push({ name: 'search', params: { search: route.params.search, page: val } });
};

const sortProducts = (criteria) => {
    sortCriteria.value = criteria;
};

</script>
<template>
    <div class="q-pa-md">
        <div class="text-h3 q-pt-md q-ml-md q-my-md row justify-between">Searched Products
            <div class="row" align="center">
                <q-btn-dropdown label="Sort by Price">
                    <q-list>
                        <q-item clickable v-close-popup @click="() => sortProducts('Price Low To High')">
                            <q-item-section>
                                <q-item-label>Price Low To High</q-item-label>
                            </q-item-section>
                        </q-item>
                        <q-item clickable v-close-popup @click="() => sortProducts('Price High To Low')">
                            <q-item-section>
                                <q-item-label>Price High To Low</q-item-label>
                            </q-item-section>
                        </q-item>
                    </q-list>
                </q-btn-dropdown>
            </div>
        </div>
        
        <div class="q-mb-md q-ml-md">
            <span v-if="searchResults.length > 0" >Displaying {{ sortedAndVisibleResults.length }} out of {{totalItems}} products</span>
        </div>
        <template v-if="searchResults.length > 0">
            <div class="full-width row wrap justify-center items-center content-center q-col-gutter-md">
                <div class="col-3" v-for="item in sortedAndVisibleResults" :key="item.id">
                    <q-card class="my-card" style="width:300px;" @click="viewProduct(item._id)">
                        <img :src="IMAGEURL" style="height: 250px;" alt="image">
                        <div class="absolute-right column">
                            <q-btn flat round :color="productsFavStore.isProductFavorite(item._id) ? 'red' : 'grey'"
                                icon="favorite"
                                @click="(event) => { event.stopPropagation(); productsFavStore.toggleFavorite(item._id) }"></q-btn>
                        </div>
                        <q-card-section>
                            <div class="text-h6 text-left">{{ item?.name }}</div>
                            <div class="text-subtitle2 text-left flex row justify-between" style="font-weight: 300;">$
                                {{ item?.price }}
                                <div class="">
                                    {{ item.averageRating }}
                                    <q-rating v-model="star" :max="1" size="2em" color="#ffb302" icon="star_border" readonly
                                        icon-selected="star"></q-rating>
                                </div>
                            </div>
                        </q-card-section>
                    </q-card>
                </div>
            </div>
            <div class="q-pa-lg flex flex-center">
                <q-pagination v-model="currentPage" :max="maxPage" color="black" active-color="accent"
                    @update:model-value="handleRoute" />
            </div>
        </template>
        <template v-else>
            <div class="full-width row wrap justify-center items-center content-center q-col-gutter-md">
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
            </div>
        </template>
    </div>
</template>

<style scoped>
.my-card {
    cursor: pointer;
}
</style>

<style scoped>
.my-card {
    cursor: pointer;
}
</style>
