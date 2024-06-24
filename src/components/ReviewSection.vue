<template>
    <div>
        <!-- Filter section for reviews -->
        <div class="q-my-md q-ml-xl row justify-between">
            <div class="text-h5">Filter by Reviews</div>
            <div class="row">
                <q-chip v-for="(count, star) in reviewCounts" :key="star" @click="applyFilter(star)" clickable>
                    {{ star }} Star ({{ count }})
                </q-chip>
            </div>
        </div>


        <!-- loader -->
        <div v-if="productStore.visible">
            <swiper-container :slides-per-view="5" :space-between="10">
                <swiper-slide v-for="n in 4" :key="n" class="swipper">
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
        </div>
        <div v-else>
            <div v-if="productStore.errorMessages" class="error text-body1" align="center">
                {{ productStore.errorMessages }}
            </div>
            <div align="center" class="text-bold" v-else-if="filteredReviews.length === 0">
                No comments on this product.
            </div>
        </div>


        <!-- btn -->
        <div>

            <div class="row full-width justify-end">
                <q-btn v-if="!onecommnet && !productStore.visible" color="white" text-color="black" label="Write Review"
                    @click="alert = true" />
                <q-btn v-else-if="!isLoggedIn" color="white" text-color="black" label="Login" @click="logindirect" />
            </div>

            <!-- Testimonial cards -->
            <swiper-container :slides-per-view="5" :space-between="10" style="margin-left: 20px;">
                <swiper-slide v-for="review in filteredReviews" :key="review._id" class="swipper">
                   
                    <q-card class="my-card">
                        <q-card-section>
                            
                            <div class="text-h6 q-mb-xs">{{ review.comment }}</div>
                            <div class="text-h7">{{ review.user.username }}</div>
                            <div class="text-h7 q-mb-xs">{{ formatDate(review.createdAt) }}</div>
                            <div class="row no-wrap items-center">
                                <q-rating size="18px" v-model="review.rating" :max="5" readonly color="accent" />
                            </div>
                        </q-card-section>
                        <img :src="slide1" alt="image">
                    </q-card>
                </swiper-slide>
            </swiper-container>
        </div>

        <!-- Dialogue box -->
        <q-dialog v-model="alert">
            <q-card>
                <q-card-section>
                    <div class="text-h4 text-accent">Add Review</div>
                </q-card-section>
                <div class="row q-pa-md q-gutter-xl justify-center items-center content-center">
                    <q-editor v-model="editor" toolbar-toggle-color="accent" width="500px" />
                    <div class="column">
                        <q-rating v-model="ratingModel" size="3.5em" color="accent" icon="star_border"
                            icon-selected="star" />
                        <q-btn color="white" text-color="black" label="Add Review" @click="addReview" />
                    </div>
                </div>
            </q-card>
        </q-dialog>
    </div>
</template>

<style scoped></style>



<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useProductsStore } from '../store/products';
import { useQuasar } from 'quasar';
import { register } from 'swiper/element/bundle';
import 'swiper/css';
import 'swiper/css/pagination';
import slide1 from '../assets/p3.png';

register();
const router = useRouter();
const route = useRoute();
const editor = ref('');
const ratingModel = ref(0);
const productStore = useProductsStore();
const alert = ref(false);
const $q = useQuasar();
const selectedReviewFilter = ref(null); // State for selected review filter;
let reviewref = ref([]);

const Data = ref({
    product: route.params.id,
    user: localStorage.getItem('id_User')
});

const onecommnet = computed(() => productStore.reviews?.find(x => x.user._id == localStorage.getItem('id_User')) ? true : false);
const isLoggedIn = computed(() => localStorage.getItem('authToken') && localStorage.getItem('id_User'));

const showNotify = (message) => {
    $q.notify({
        message: message,
        color: 'accent'
    });
};

const logindirect = () => {
    router.push({ name: 'login', query: { redirect: 'productDetail', productid: route.params.id } });
};

const addReview = async () => {
    const reviewData = {
        user: localStorage.getItem('id_User'),
        productId: route.params.id,
        rating: ratingModel.value,
        comment: editor.value
    };

    try {
        await productStore.postReview(route.params.id, reviewData);
        showNotify('Review added successfully');
        await productStore.getReviews(route.params.id);
        alert.value = false;
        editor.value = '';
        ratingModel.value = 0;
        productStore.checkUserReview(Data.value);
    } catch (error) {
        showNotify(productStore.errorMessages);
    }
};

onMounted(() => {
    productStore.checkUserReview(Data.value);
});

watch(() => route.params.id, () => {
    productStore.clearReviews();
    productStore.checkUserReview(Data.value);
});

const reviewCounts = computed(() => {
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    productStore.reviews.forEach(item => {
        const rating = Math.floor(item.rating);
        if (counts[rating] !== undefined) {
            counts[rating]++;
        }
    });
    return counts;
});

const filteredReviews = computed(() => {
    if (selectedReviewFilter.value === null) {
        return productStore.reviews;
    } else {
        // console.log("Selected Review", selectedReviewFilter.value);
        // console.log("review rating", productStore.reviews.rating)
        // reviewref=productStore.reviews.filter(review=>Math.floor(review))
        // console.log("REview ref",reviewref.value)

        return productStore.reviews.filter((review) => Math.floor(review.rating) == selectedReviewFilter.value);
    }
});

const applyFilter = (star) => {
    if (selectedReviewFilter.value === star) {
        selectedReviewFilter.value = null; // Reset filter if the same star is selected again
    } else {
        selectedReviewFilter.value = star;


    };
}


const formatDate = (createdAt) => {
    const dateObj = new Date(createdAt);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return dateObj.toLocaleDateString(undefined, options);
};
</script>


<style scoped>
.swipper {
    cursor: pointer;
}
</style>
