<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import SearchInput from "../components/SearchInput.vue";
import { getCartStore } from '../store/addtocart';
import slide1 from '../assets/p3.png';
import { removeItemStore } from '../store/remove';
import { storeToRefs } from 'pinia';

const route = useRoute();
const router = useRouter();
const cartStore = getCartStore();
const removeStore = removeItemStore();


const { count,lengthCart} =storeToRefs(cartStore)
// Computed properties
const istoken = computed(() => localStorage.getItem('authToken'));
const opendrawer = computed(() => cartStore.isCartDrawerOpen);
const cartfromserver = computed(() => cartStore.cart);
const Cartloading = computed(() => cartStore.cartLoading);
const noofitem = computed(() => cartStore.cartLength);
const productArray = computed(() => cartStore.productArray);
const message = computed(() => removeStore.message);

const user = computed(() => cartStore.user);
// Methods
const goToLoginPage = () => {
    router.push('/login');
};

const goToSignUpPage = () => {
    router.push('/register');
};

const favourite = () => {
    router.push('/favourite');
};

const signOut = () => {
    cartStore.signOut();
    router.push('/login');
};

const goToContactPage = () => {
    router.push('/contact');
};

const cart = () => {
    cartStore.toggleCartDrawer();
};

const isActiveRoute = (path) => {
    return route.path === path;
};

onMounted(() => {
    cartStore.cartItem();
    cartStore.lengthCart();
    cartStore.isCartDrawerOpen;
});

const update = () => {
    cartStore.updateCart();
};

const Proccedtocart = () => {
    cartStore.toggleCartDrawer();
    router.push('/cart');
};

//checks for error
const hasError = computed(() => {
    return productArray.value.some(item => item.quantityError);
});

watch(productArray, () => {
    lengthCart().value;
});

onMounted(() => {
    if (localStorage.getItem('user')) {
        cartStore.setUser(JSON.parse(localStorage.getItem('user')));
    }
})

</script>

<template>
    <div>
        <q-header reveal elevated class="bg-primary text-black row q-pa-sm ">
            <q-toolbar class="col-2">
                <q-toolbar-title class="text-weight-bold  text-accent text-h4">Exclusive</q-toolbar-title>
            </q-toolbar>
            <div class="col-5 q-pa-sm">
                <nav class="row wrap justify-evenly">
                    <q-btn flat label="Home" outline @click="$router.push('/')"
                        :class="{ 'active-link': isActiveRoute('/') }" />
                    <q-btn label="Contact" flat @click="goToContactPage"
                        :class="{ 'active-link': isActiveRoute('/contact') }" />
                    <q-btn flat label="Login" @click="goToLoginPage"
                        :class="{ 'active-link': isActiveRoute('/login') }" />
                    <q-btn flat label="Sign Up" @click="goToSignUpPage"
                        :class="{ 'active-link': isActiveRoute('/register') }" />
                    <q-btn label="About" flat @click="$router.push('/about')"
                        :class="{ 'active-link': isActiveRoute('/about') }" />
                </nav>
            </div>
            <div class="col-5">
                <div class="row items-center justify-evenly">
                    <SearchInput />
                    <i class="fa-regular fa-heart fa-2x" @click="favourite"></i>
                    <div class="row text-black">
                        <div class="q-mt-sm q-ml-sm">
                            {{ user ? user.username : '' }}
                        </div>
                        <div v-if="user">
                            <q-btn-dropdown color="black" flat style="width: 5px; height:5px">
                                <q-list>
                                    <q-item clickable v-close-popup @click="signOut()">
                                        <q-item-section>
                                            <q-item-label>Sign Out</q-item-label>
                                        </q-item-section>
                                    </q-item>
                                </q-list>
                            </q-btn-dropdown>
                        </div>
                    </div>
                    <div class="row">
                        <i class="fa-solid fa-cart-plus fa-2x" @click="cart"></i>
                        <div class="cart">
                            {{ noofitem }}
                        </div>
                    </div>
                </div>
            </div>
        </q-header>


        <!-- drawer -->
        <q-drawer style="height:500px" :width="500" side="right" v-model="opendrawer" overlay
            transition-show="slide-right" transition-hide="slide-right" class="custom-drawer">
            <q-list>
                <div class="q-pt-md q-ml-md"><i class="fa-solid fa-xmark fa-1.5"
                        @click="cartStore.toggleCartDrawer();"></i>
                </div>
                <q-item-label header class="text-h6 text-black" align="center">My Cart</q-item-label>
                <template v-if="Cartloading">
                    <q-item-label align="center">Loading...</q-item-label>
                </template>
                <template v-else-if="productArray.length > 0">
                    <q-item v-for="(item, index) in productArray" :key="index">
                        <q-item-section class="q-mt-md">
                            <div class="row">
                                <div class="col-4">
                                    <img :src="slide1" width="80px" />
                                </div>
                                <div class="col-3" align="center">
                                    <div class="q-mt-sm text-bold"><q-item-label>{{ item.name }}</q-item-label></div>
                                    <div class="q-mt-sm"><q-item-label caption>${{ item.price }}</q-item-label></div>
                                </div>
                                <div class="col-4  q-ma-none " align="center">
                                    <div> <q-input v-model="item.quantity"
                                            style="width:50px; height:10px; text-align:center;  margin-top:-10px"
                                            :class="{ 'bg-red': item.quantityError }" />
                                    </div>
                                </div>
                                <div class="col-1 q-mt-sm" align="center">

                                    <i class="fa-solid fa-trash" @click="cartStore.removeProduct(index)"></i>
                                </div>
                            </div>
                        </q-item-section>

                    </q-item>
                    <div align="center">
                        <q-btn color="accent" text-color="white" label="UPDATE CART" :disable="hasError" class="q-my-lg"
                            @click="update"></q-btn>
                        <q-btn color="accent" text-color="white" label="PROCEED TO CART" :disable="hasError"
                            class="q-my-lg q-ml-md" @click="Proccedtocart"></q-btn>
                    </div>
                </template>
                <template v-else>
                    <q-item-label align="center">No Products</q-item-label>
                </template>

            </q-list>
        </q-drawer>

    </div>

    <!-- drawer -->

</template>

<style scoped>
.active-link {
    text-decoration: underline;
}

i:hover {
    color: #DB4444;
    scale: 1.1;
    cursor: pointer;
}

nav a {
    font-weight: bold;
    color: #2c3e50;
    text-decoration: none;
    padding: 10px;
    border-radius: 4px;
}

nav a.router-link-exact-active {
    text-decoration: underline;
}

div nav a.router-link-exact-active:hover {
    background-color: transparent;
}

.cart {
    position: absolute;
    width: 20px;
    text-align: center;
    background-color: red;
    border-radius: 100%;
    top: 15%;
    right: 15px;
}

.custom-drawer {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    z-index: 2000;
    /* Adjust z-index if necessary */
}
</style>
