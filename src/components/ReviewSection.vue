<template>

    <div>
        <div v-if="productStore.visible">
            <swiper-container :slides-per-view="5" :space-between="spaceBetween">
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

            <div v-if="productStore.errorMessages" class="error text-body1" align="center">{{
                productStore.errorMessages }}</div>
            <div align="center" class="text-bold" v-else-if="productStore.reviews.length === 0">No comments on this
                product.</div>
        </div>

        <div>
            <div class="row full-width justify-end ">
                
                <q-btn v-if="!onecommnet && !productStore.visible" color="white" text-color="black" label="Write Review"
                    @click="alert = true" />
                <q-btn v-else-if="!isLoggedIn" color="white" text-color="black" label="Login" @click="logindirect" />
            </div>
            <!-- testimonial cards -->

            <swiper-container :slides-per-view="5" :space-between="10" style="margin-left: 20px;">
                <swiper-slide v-for="n in productStore.reviews" :key="n" class="swipper">
                    <q-card class="my-card">
                        <q-card-section>
                            <div class="text-h6 q-mb-xs">{{ n.comment }}</div>
                            <div class="text-h7">{{ n.user.username }}</div>
                            <div class="row no-wrap items-center">
                                <q-rating size="18px" v-model="n.rating" :max="5" readonly color="accent" />
                            </div>
                        </q-card-section>

                        <img :src="slide1" alt="image">
                    </q-card>
                </swiper-slide>
            </swiper-container>


        </div>





        <!-- dialgue box -->
        <q-dialog v-model="alert">
            <q-card>
                <q-card-section>
                    <div class="text-h4 text-accent">Add Review</div>
                </q-card-section>
                <div class="row q-pa-md q-gutter-xl  justify-center items-center content-center ">
                    <q-editor v-model="editor" toolbar-toggle-color="accent" width="500px" />
                    <div class="column ">
                        <q-rating v-model="ratingModel" size="3.5em" color="accent" icon="star_border"
                            icon-selected="star" />
                        <q-btn color="white" text-color="black" label="Add Review" @click="addReview" />
                    </div>
                </div>
            </q-card>
        </q-dialog>



    </div>
</template>


<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useProductsStore } from '../store/products'
import { useQuasar } from 'quasar';
import { register } from 'swiper/element/bundle';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import slide1 from '../assets/p3.png'


register();
const router = useRouter();
const route = useRoute();
const editor = ref('');
const ratingModel = ref(0);
const productStore = useProductsStore();
const alert = ref(false);
const $q = useQuasar();
const reviews = ref(productStore.reviews);

const Data = ref({
    product: route.params.id,
    user: localStorage.getItem('id_User')

})

const onecommnet = computed(() => productStore.reviews?.find(x => x.user._id == localStorage.getItem('id_User')) ? true : false)

const isLoggedIn = computed(() => localStorage.getItem('authToken') && localStorage.getItem('id_User'));

const showNotify = (message) => {
    $q.notify({
        message: message,
        color: 'accent'
    })
}


const logindirect = () => {
    router.push({ name: 'login', query: { redirect: 'productDetail', productid: route.params.id } });
}


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
        // Refresh reviews to show the newly added review
        await productStore.getReviews(route.params.id);


        alert.value = false;
        editor.value = '';
        ratingModel.value = 0;
        productStore.checkUserReview(Data.value)
    } catch (error) {
        showNotify(productStore.errorMessages);
    }



    // if (productStore.errorMessages) {
    //     showNotify(productStore.errorMessages);
    // } else if (reviews.value.length === 0) {
    //     // console.log("review in file", reviews.value)
    //     showNotify('No comments on this product.');
    // } else {
    //     showNotify('Reviews fetched successfully.');
    // }
    // console.log("Editor", editor.value);
    // console.log("rating", ratingModel);
    // console.log("obj", reviewData)
    // console.log("params", route.params.id)
}



onMounted(() => {
    productStore.checkUserReview(Data.value)

})

watch(() => route.params.id, () => {
    productStore.clearReviews()
    productStore.checkUserReview(Data.value)

})
</script>

<style scoped>
.swipper {
    cursor: pointer;
    width: 1300px;
    height: 400px;
}
</style>