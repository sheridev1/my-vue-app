<template>
    <div>
        <BarChart />
        <div class="row justify-between q-mt-lg">
            <div class="col-3   row justify-around q-py-lg "
                style="width: 200px; height: 90px; border:2px solid black">
                <div>Total Products</div>
                <div>{{ totalProducts }}</div>
            </div>
            <div class="col-3 row justify-around q-py-lg"
                style="width: 200px; height: 90px; border:2px solid black">
                <div>Total Users</div>
                <div>{{ totalUsers }}</div>
            </div>

            <div class="col-3 row justify-around q-py-lg"
                style="width: 200px; height: 90px; border:2px solid black">
                <div>Total Sales</div>
                <div>{{ totalCost }}</div>
            </div>
            <div class="col-3  row justify-around q-py-lg"
                style="width: 200px; height: 90px; border:2px solid black">
                <div>No of Sales</div>
                <div>{{ orders.length }}</div>
            </div>
        </div>
    </div>
</template>

<script setup>
import BarChart from '../components/BarChart.vue';
import { ref, onMounted, computed } from "vue";
import Chart from "chart.js/auto";
import { storeToRefs } from "pinia";
import { useProductsStore } from "../store/products";
import { getCartStore } from "../store/addtocart";
import { getOrderStore } from "../store/ordercart";

// Initialize stores
const productStore = useProductsStore();
const cartStore = getCartStore();

const orderStore = getOrderStore();
const { fetchOrders, orders } = storeToRefs(orderStore)
const { fetchProducts, products, visible } = storeToRefs(productStore);
const { getAllUsers, allusers, loading } = storeToRefs(cartStore);



const totalUsers = computed(() => allusers.value.length);
const totalProducts = computed(() => products.value.length);

const totalCost = computed(() => {
    return orders.value.reduce((sum, order) => sum + order.finalTotal, 0);
})

onMounted(() => {
    orderStore.fetchOrders();

});
</script>