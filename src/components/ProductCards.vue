<script setup>
import { defineProps, onMounted } from "vue";
import { ref, computed ,watch} from "vue";
import { useRouter } from "vue-router";
import { register } from 'swiper/element/bundle';
import { useProductsStore } from '../store/products';
import { Swiper, SwiperSlide } from 'swiper/vue';
import slide1 from '../assets/p3.png'
import slide2 from '../assets/p1.png'
import slide3 from '../assets/p2.png'
import {getFavProductStore} from '../store/favouriteItems'
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

register();
const router = useRouter()
const modules = ref([Pagination])
const spaceBetween = 10;
const star=ref(1)


const props = defineProps({
    featured: Boolean
})


const onProgress = (e) => {
    const [swiper, progress] = e.detail;
};
const imageUrls = [slide1, slide2, slide3, 'https://cdn.quasar.dev/img/mountains.jpg'];
let IMAGEURL = slide1
const productsStore = useProductsStore();
const products = computed(() => productsStore.products);

const productsFavStore=getFavProductStore();

const getFeatured = computed(() => props.featured ? productsStore.filtered : productsStore.products)

const viewProduct = (id) => {
    router.push({ name: 'ProductDetail', params: { id } });
};

const onSlideChange = (e) => {
    console.log('slide changed');
};
onMounted(async () => {
    await productsStore.fetchProducts();
    await productsStore.filterProducts();
})
</script>


<template>
    <div class="q-pa-md q-pb-md">
        <template v-if="products && products.length > 0">
            <swiper-container :slides-per-view="5" :space-between="spaceBetween" @swiperprogress="onProgress"
                @swiperslidechange="onSlideChange">
                <swiper-slide v-for="item in getFeatured" :key="item.id" class="swipper">
                    <q-card class="my-card" @click="viewProduct(item._id)">
                        <img :src="IMAGEURL" alt="image">
                        <div class="absolute-right column">
                            <q-btn flat round :color="productsFavStore.isProductFavorite(item._id) ? 'red' : 'grey'" icon="favorite"
                            @click="(event) => { event.stopPropagation(); productsFavStore.toggleFavorite(item._id) }"></q-btn>
                        </div>

                        <q-card-section>
                            <div class="text-h6">{{ item?.name}}</div>
                            <div class="text-subtitle2 text-left flex row justify-between"  style="font-weight: 300;">$ {{ item?.price }}
                                <div class="" >
                                    {{ item.averageRating }}
                                    <q-rating v-model="star" :max="1" size="2em" color="#ffb302" icon="star_border" readonly
                                    icon-selected="star"></q-rating>
                                </div>
                            </div>
                        </q-card-section>
                    </q-card>
                </swiper-slide>

            </swiper-container>

        </template>
        <template v-else>
            <!-- Skeleton Loading -->
            <swiper-container :slides-per-view="5" :space-between="spaceBetween">
                <swiper-slide v-for="n in 5" :key="n" class="swipper">
                    <q-card class="my-card">
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
    </div>
</template>


<style scoped>
.color {
    background-color: #DB4444;

}

.swipper {
    cursor: pointer;
    width: 1300px;
    height: 320px;
}
</style>