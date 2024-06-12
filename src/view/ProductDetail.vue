<script setup>
import { onMounted, computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getProductStore } from '../store/getproducts';
import ImageGellary from '../components/ImageGellary.vue';
import FlashSaleSection from '../components/FlashSaleSection.vue';
import ProductCards from '../components/ProductCards.vue';
import { useQuasar } from 'quasar';
import ReviewSection from '../components/ReviewSection.vue';
import { useProductsStore } from '../store/products';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { getCartStore } from '../store/addtocart';


const route = useRoute();
const router = useRouter();
let rating = 5
// let IMAGEURL = img1

const istoken = computed(() => localStorage.getItem('authToken'))
const id_User = computed(() => localStorage.getItem('id_User'))

const productStore = getProductStore();
const productsStore = useProductsStore();
const product = computed(() => productStore.product);
const loading = computed(() => productStore.loading);
const error = computed(() => productStore.error);


//cart store
const cartStore = getCartStore();
const count = computed(() => cartStore.count);
const id = computed(() => route.params.id)
const noofitem=computed(()=> cartStore.cartLength)
// const count = ref(1);
const $q = useQuasar();

const data = ref({
    product: route.params.id,
    user: localStorage.getItem('id_User')
})


//notification
const showNotify = (message) => {
    $q.notify({
        message: message,
        color: 'accent'
    })
}

const loadProduct = async () => {
    const productId = route.params.id;
    if (productId) {
        await productStore.fetchProductById(productId);
    } else {
        console.log("no id")
    }
};

onMounted(() => {
    window.scrollTo(0, 0);
    loadProduct();
    loadReviews();
    
    


});

watch(() => route.params.id, () => {
    productsStore.clearReviews();
    loadProduct();
    loadReviews();
    setTimeout(() => {
        window.scrollTo(0, 0);
    }, 100)
   
    
    // Scroll to the top when the route parameter changes
});


//review Section
const loadReviews = async () => {
    await productsStore.getReviews(route.params.id);
    await productsStore.checkUserReview(data.value)


}

//Asssigning tempory user id
const generateGuestUserId = () => {
    return 'guest_' + Math.random().toString(36).substr(2, 9);
}


//add to cart
const addtocart = (id) => {
    if (count.value >= 1) {
        let param = route.params.id;
        let cart = localStorage.getItem('cart')
        cartStore.localcart(cart, param);
        
        if (cart) {
            showNotify("Product has been added to the cart")
        }
    } else {
        alert("Count is 0")
    }

}


//buy now 
const buynow = () => {
    if (count.value >= 1) {
        const checkout = {
            user: localStorage.getItem('userId'),
            item: [
                {
                    product: route.params.id,
                    quantity: count.value
                }
            ]
        };
        localStorage.setItem('checkoutProduct', JSON.stringify(checkout));
        router.push({ name: 'order', params: { id: route.params.id } });
    } else {
        alert('count is zero')
    }
}

</script>

<template>
    <div>
        <template v-if="product">

            <div class="row  q-mb-lg">
                <div class="col-7 flex items-center justify-center">
                    <ImageGellary />
                </div>
                <div class="col-5 ">
                    <div class="column q-mt-xl" style="margin-top:90px;">
                        <div class="text-h5">{{ product.name }}</div>
                        <div class="row q-mt-md">
                            <q-rating v-model="product.averageRating" size="2em" color="gold-5" icon="star_border"
                                readonly icon-selected="star"></q-rating>
                            <div class="text-body1">| IN STOCK</div>

                        </div>
                        <div class="text-body1 q-my-md">${{ product.price }}</div>
                        <div class="row">
                            <div class="text-bold text-body1 ">Category:&nbsp;&nbsp;</div>
                            <div class="text-body1"> {{ product.category }}</div>
                        </div>

                        <div class="row">
                            <div class="text-bold text-body1 ">Company:&nbsp;&nbsp; </div>
                            <div class="text-body1"> {{ product.company }}</div>

                        </div>
                        <div class="q-pr-xl text-bold text-blue-grey-13" style="text-align:justify; width:550px">
                            PlayStation
                            5 Controller Skin High
                            quality vinyl with air channel adhesive for easy bubble free install & mess free removal
                            Pressure sensitive.</div>
                        <div style="border-bottom: 1px solid black; width:500px" class="q-mt-md"></div>
                        <div class=" row q-mt-md">
                            <div class="q-mt-xs">
                                <q-btn-group push>
                                    <q-btn @click="cartStore.decrementCount">
                                        <i class="fa-solid fa-minus"></i>
                                    </q-btn>
                                    <div class="text-center q-mt-sm" style="width:50px;">{{ count }}</div>
                                    <q-btn push color="accent" @click="cartStore.incrementCount">
                                        <i class="fa-solid fa-plus"></i>
                                    </q-btn>
                                </q-btn-group>
                            </div>
                            <div class=" row q-ml-md">
                                <div class="q-mr-md">
                                    <q-btn color="white" text-color="black" label="Add to Cart" @click="addtocart" />
                                </div>
                                <div>
                                    <q-btn color="white" text-color="black" label="Buy Now" @click="buynow" />
                                </div>

                            </div>
                            
                        </div>
                        <div>
                            <div class="row  q-pa-sm q-mt-sm "
                                style="border: 1px solid black; width:200px; border-bottom:1px solid white; border-radius:5px; border-bottom-left-radius:0px; border-bottom-right-radius:0px;">
                                <i class="fa-solid fa-truck-fast q-mt-xs "></i>
                                <div class="q-ml-md text-bold">Free Delivery</div>
                            </div>
                            <div class="row q-pa-sm"
                                style="border: 1px solid black; width: 200px; border-radius:5px;  border-top-left-radius:0px; border-top-right-radius:0px;">

                                <i class="fa-solid fa-rotate-left q-mt-xs"></i>
                                <div class="q-ml-md text-bold"> Return Delivery</div>

                            </div>


                        </div>
                    </div>
                </div>
            </div>
        </template>
        <template v-else>
            <div style="position:relative;height:200px">
                <q-inner-loading :showing="loading" label="Please wait..." label-class="text-black"
                    label-style="font-size: 1.1em" />
            </div>
        </template>
        <div class="row ">
            <div class="column q-pa-md q-gutter-sm  full-width">
                <div class="text-h4 text-accent q-ml-xl">Add a Review</div>
                <div class="column">
                    <ReviewSection />
                </div>

            </div>

        </div>

        <div class="row q-pa-lg q-mt-xl">
            <FlashSaleSection title="Flash Sales" toptitle="Today's" :countDown="true" />
        </div>

    </div>
</template>