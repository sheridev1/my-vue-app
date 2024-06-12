
<template>
    <div class="q-pa-md">
        <div class="text-h3 q-pt-md q-ml-md q-my-md">Favourite Products</div>

        <!-- loader -->
        <template v-if="loading || favoriteLoading">
            <!-- Skeleton Loading -->
            <swiper-container :slides-per-view="5" :space-between="spaceBetween">
                <swiper-slide v-for="n in 5" :key="n" class="swipper">
                    <q-card class="my-card q-ma-sm">
                        <q-skeleton type="rect" width="100%" height="150px" />
                        <q-card-section>
                            <q-skeleton type="text" />
                            <q-skeleton type="text" width="60%" />
                            <q-skeleton type="QRating" />
                        </q-card-section>
                    </q-card>
                </swiper-slide>
            </swiper-container>
        </template>
        <template v-else>
            <div class="full-width row wrap justify-center items-center content-center q-col-gutter-md">
                <div class="col-3 " v-for="item in products" :key="item.id">
                    <q-card class="my-card qcard " style="width:300px;" @click="viewProduct(item._id)">
                        <img :src="slide1" style="height: 250px;" alt="image">
                        <div class="absolute-right column">
                            <q-btn flat round :color="productsFavStore.isProductFavorite(item._id) ? 'red' : 'white'"
                                @click="(event) => { event.stopPropagation(); toggleFavorite(item._id) }"
                                icon="favorite"></q-btn>
                        </div>

                        <q-card-section>
                            <div class="text-h6 text-left">{{ item?.name }}</div>
                            <div class="text-subtitle2 text-left">$ {{ item?.price }}</div>
                            <div class="q-gutter-y-md column">
                                <q-rating v-model="item.rating" size="2em" color="gold-5" icon="star_border" readonly
                                    icon-selected="star"></q-rating>
                            </div>
                        </q-card-section>
                    </q-card>
                </div>
            </div>
            <div class="q-pa-lg flex flex-center">
                <q-pagination v-model="current" :max="maxPage" color="black" active-color="accent" />
            </div>
        </template>
    </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import slide1 from '../assets/p1.png';
import { getFavProductStore } from '../store/favouriteItems';
import { useRouter } from 'vue-router';

// Fav item store
const productsFavStore = getFavProductStore();
const router = useRouter();
const products = computed(() => productsFavStore.products);
const loading = ref(true);
const favoriteLoading = ref(false);

onMounted(async () => {
    loading.value = true;
    await productsFavStore.updateFavoriteProducts();
    loading.value = false;
});

const viewProduct = (id) => {
    router.push({ name: 'ProductDetail', params: { id } });
};

const toggleFavorite = async (id) => {
    favoriteLoading.value = true;
    await productsFavStore.toggleFavorite(id);
    await productsFavStore.updateFavoriteProducts();
    favoriteLoading.value = false;
};
</script>

<style scoped>
.qcard {
    cursor: pointer;
}
</style>
