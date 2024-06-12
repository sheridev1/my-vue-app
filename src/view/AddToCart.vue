<script setup>
import { getProductStore } from '../store/getproducts';
import slide1 from '../assets/p3.png';
import { useRoute, useRouter } from 'vue-router';
import { ref, onMounted, computed, watch } from 'vue';
import { getCartStore } from '../store/addtocart';
import axios from 'axios';
import { removeItemStore } from '../store/remove';
import { useQuasar } from 'quasar';

let IMAGEURL = slide1
const router = useRouter();
const route = useRoute();
const count = ref(0);

const productStore = getProductStore();
const product = computed(() => productStore.product);
const loading = computed(() => productStore.loading);
const error = computed(() => productStore.error);


const cartStore = getCartStore();
const cartfromserver = computed(() => cartStore.cart);
const Cartloading = computed(() => cartStore.loading);
const noofitem = computed(() => cartStore.cartLength)
const productArray = computed(() => cartStore.productArray)


const removeStore = removeItemStore();
const message = computed(() => removeStore.message)
const $q = useQuasar();

const back = () => {
  router.push('/')
}
const order = () => {
  cartStore.updateCart();
  router.push('/order')
}


const update = () => {
  cartStore.updateCart();
}

const calculateSubTotal = (item) => {
  return item.price * item.quantity;
};



//notification
const showNotify = () => {
  $q.notify({
    message: 'Cart has been updated.',
    color: 'accent'
  })
}

const calculateTotal = () => {
  let total = 0;
  for (const item of productArray.value) {
    total += calculateSubTotal(item);
  }
  return total;
};



onMounted(() => {
  cartStore.cartItem()
  cartStore.lengthCart();
  cartStore.isCartDrawerOpen;
});

watch(productArray, () => {
  cartStore.lengthCart();
})

</script>


<template>
  <div class="q-pa-xl">
    <div class="q-mb-lg">Home / Cart</div>
    <template v-if="Cartloading">

      <div align='center'>
        <div class="row cart">
          <div class="col-3"><q-skeleton type="QBtn" /></div>
          <div class="col-3"><q-skeleton type="QBtn" /></div>
          <div class="col-3"><q-skeleton type="QBtn" /></div>
          <div class="col-3"><q-skeleton type="QBtn" /></div>

        </div>

        <div class="row cart q-mt-lg" v-for="i in 3" :key="i">
          <div class="col-3"><q-skeleton type="QBtn" /></div>
          <div class="col-3"><q-skeleton type="QBtn" /></div>
          <div class="col-3"><q-skeleton type="QBtn" /></div>
          <div class="col-3"><q-skeleton type="QBtn" /></div>


        </div>
      </div>
    </template>



    <!-- Checking condition -->
    <template v-else-if="productArray.length > 0">
      <div align='center'>
        <div class="row cart">
          <div class="col-1">Action</div>
          <div class="col-3">Product</div>
          <div class="col-3">Price</div>
          <div class="col-3">Quantity</div>
          <div class="col-2">SubTotal</div>
        </div>

        <div class="row cart q-mt-lg" v-for="(item, index) in productArray" :key="index">
          <div class="col-1"><i class="fa-solid fa-trash" @click="cartStore.removeProduct(index)"></i></div>

          <div class="col-3 " style="padding-left: 80px;">
            <div class="row " align="center">
              <img :src="slide1" width="50px" />
              <div class="q-mt-sm q-ml-xs">{{ item.name }}</div>
            </div>
          </div>
          <div class="col-3 q-mt-md ">
            <div>${{ item.price }}</div>
          </div>
          <div class="col-3  ">
            <q-input v-model="item.quantity" :dense="dense" style="width:50px; height:10px; text-align:center"
              :class="{ 'bg-red': item.quantityError }" />
          </div>
          <div class="col-2 q-mt-md">$ {{ calculateSubTotal(item) }}</div>
        </div>
      </div>
      <div class="row justify-between">
        <q-btn color="white" text-color="grey" label="RETURN TO SHOP" class="q-my-lg" @click="back" />
        <q-btn color="accent" text-color="white" label="UPDATE CART" :disable="hasError" class="q-my-lg"
          @click="update">
          <q-tooltip v-if="hasError" anchor="center middle" self="center middle" class="bg-accent">
            Product Quantity cannot be zero
          </q-tooltip>

        </q-btn>
      </div>

      <div class="column justify-center items-center">
        <div class="row q-pa-md" style="border: 1px solid black;">
          <div>Sub Total: &nbsp;</div>
          <div>${{ calculateTotal() }}</div>
        </div>
        <q-btn color="accent" text-color="white" label="Procced to Check Out" class="q-my-lg" @click="order" />
      </div>


    </template>
    <template v-else>
      <div class="text-bold text-center"> Cart is Empty</div>
    </template>
  </div>



</template>



<style scoped>
.cart {
  width: 90%;

  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}


.error {
  color: red;
  font-size: 0.8em;
}
</style>