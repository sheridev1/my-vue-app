<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import slide1 from '../assets/p3.png';
import { useRoute, useRouter } from 'vue-router';
import { getProductStore } from '../store/getproducts';
import { getCartStore } from '../store/addtocart';
import { getOrderStore } from '../store/ordercart';
const route = useRoute();
const router = useRouter();
let IMAGEURL = slide1;
const shape = ref('COD');
const login = ref('false'); //when login is true then he needs to be logged 






const productArray = ref([]);

const productStore = getProductStore();
const cartStore = getCartStore();
const orderStore = getOrderStore();

const firstName = ref('');
const city = ref('');
const state = ref('');
const zip = ref('');
const country = ref('');
const notes = ref('');

const shipping = ref(10)


//Product store
const product = computed(() => productStore.product);
const loading = computed(() => productStore.loading);
const error = computed(() => productStore.error);



//cart Store
const cartArray = computed(() => getCartStore.ordercart);

const istoken = computed(() => localStorage.getItem('authToken'))

const checkLogin = () => {
    login.value = !istoken.value;
};

const logindirect = () => {
    router.push({ name: 'login', query: { redirect: 'order', productid: route.params.id } });
}

//validation
const isFormValid = computed(() => {
    return firstName.value && city.value && state.value && zip.value && country.value && notes.value && productArray.value.length > 0;
});


//get products from api through product id
const getProduct = async (productId, quantity) => {
    const response = await fetch(`http://localhost:5000/api/product/?id=${productId}`);
    const productData = await response.json();
    productArray.value.push({
        id: productId,
        name: productData.myData.name,
        price: productData.myData.price,
        quantity: quantity,
        quantityError: '' // Initialize the error message
    });
    console.log("product Array", productArray)
}

//retriving cart from local
const cartItem = async () => {
    let cart = localStorage.getItem('cart');
    if (!route.params.id) {
        if (cart) {
            cart = JSON.parse(cart);
            // console.log(cart.item);
            for (const item of cart.item) {
                const productId = item.product;
                const quantity = item.quantity;
                try {
                    getProduct(productId, quantity)

                } catch (error) {
                    console.log("Error while fetching", error)
                }
            }
        }
    } else {
        let checkout = localStorage.getItem('checkoutProduct');
        if (checkout) {
            checkout = JSON.parse(checkout);
            // console.log("checkout", checkout.item)
            productArray.value = [];
            const productId = checkout.item[0].product;
            const quantity = checkout.item[0].quantity;
            console.log("productid", checkout.item[0].product)
            try {
                await getProduct(productId, quantity);

            } catch (error) {
                console.log("Error while fetching", error);
            }
        }

    }

}


const fullTotal = () => {
    let final = calculateTotal();
    return final = final + shipping.value
}


const calculateTotal = () => {
    let total = 0;
    for (const item of productArray.value) {
        total += calculateSubTotal(item);
    }
    return total;
};

const calculateSubTotal = (item) => {
    return item.price * item.quantity;
};


//placeOrder
const placeOrder = async () => {
    const id_User = localStorage.getItem('id_User');
    if (!id_User) {
        alert("Please Login")
        return;
    }



    const billingDetails = {
        user: id_User,
        address: {
            street: firstName.value,
            city: city.value,
            state: state.value,
            zipCode: zip.value,
            country: country.value
        },
        paymentMethod: shape.value,
        deliveryCharges: shipping.value, // You can change this value as needed
        notes: notes.value // Add any additional notes here
    };


    //Checking if comes from buy now or add to cart
    if (!route.params.id) {
        // Retrieve the cart data from local storage
        let cart = localStorage.getItem('cart');
        if (cart) {
            cart = JSON.parse(cart);
            cart.user = id_User;
            console.log(cart)
            try {
                await cartStore.addtoCart(cart);
                localStorage.removeItem('cart');
            }
            catch (error) {
                console.log("Error while adding cart item to server ")
            }


        }
        else {
            console.log("No data Avaiable")
            return;
        }

    }
    else {
        //Retrieve the check out data
        let checkout = localStorage.getItem('checkoutProduct');
        console.log(checkout)
        if (checkout) {
            checkout = JSON.parse(checkout);
            checkout.user = id_User;
            try {
                await cartStore.addtoCart(checkout);

            }
            catch (error) {
                console.log("Error while adding buy cart item to server ")
            }
        }
        else {
            console.log("No Data avaiable");
            return;
        }

    }

    try {
        await orderStore.order(billingDetails);
        localStorage.removeItem('checkoutProduct');
        alert("Order placed successfully");

        //clearing data
        productArray.value = [];
        firstName.value = '';
        city.value = '';
        state.value = '';
        zip.value = '';
        country.value = '';
        notes.value = '';


        setTimeout(() => {
            router.push('/')
        }, 1000)


    }
    catch (error) {
        console.log("Error while adding order to server")
    }



}

onMounted(() => {
    checkLogin()
    cartItem();
});


</script>


<template>
    <div class="row q-pa-xl">
        <div class="col-7 q-pl-xl">
            <div class="text-h4  q-my-md">Biling Details</div>
            <template v-if="login">
                <div align="center">

                    <div class="text-body1 q-mt-xl">You need to be logged in</div>
                    <q-btn label="Login" class="q-mt-lg" @click="logindirect" />
                </div>

            </template>
            <template v-else>

                <div class="" style="width: 500px;">
                    <q-input standout v-model="firstName" label="First Name" />
                    <q-input class="q-my-md" standout v-model="city" label="City" />
                    <q-input class="q-my-md" standout v-model="state" label="State" />
                    <q-input class="q-my-md" standout v-model="zip" label="zip code" />
                    <q-input class="q-my-md" standout v-model="country" label="Country" />
                    <q-separator />

                    <q-input class="q-my-md" standout v-model="notes" label="Notes" />
                </div>
            </template>
        </div>
        <div class="col-4">
            <div class="q-my-xl ">
                <div class="column q-my-md " align="center" v-for="(item, index) in productArray" :key="index">

                    <img :src="slide1" width="50px" />
                    <div class="flex items-center grow justify-between" style="flex-grow: 1;">
                        <div class="q-mt-sm q-ml-xs">{{ item.name }}</div>
                        <div>x {{ item.quantity }}</div>
                        <div class="" style="align-text">$ {{ calculateSubTotal(item) }}</div>
                    </div>
                    <q-separator class="q-mt-md" />
                </div>


                <div class="row justify-between">
                    SubTotal
                    <div>$ {{ calculateTotal() }}</div>
                </div>
                <q-separator class="q-mt-md" />
                <div class="row justify-between q-mt-md">
                    Shipping
                    <div>$10</div>

                </div>
                <q-separator class="q-mt-md" />
                <div class="row justify-between q-mt-md">
                    Total
                    <div>$ {{ fullTotal() }}</div>
                </div>
                <div class="column">
                    <div class="text-accent q-mt-md text-bold"> Select Method</div>
                    <q-radio v-model="shape" color="accent" val="COD" label="COD" />
                    <q-radio v-model="shape" color="accent" val="Card" label="Card" />

                </div>
            </div>
            <q-btn color="accent" :disable="!isFormValid" text-color="white" label="Place Order" class="q-mt-sm"
                @click="placeOrder" />
        </div>

    </div>
</template>


<style scoped></style>