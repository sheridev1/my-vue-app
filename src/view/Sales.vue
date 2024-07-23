<template>
    <div class="">
        <div class="text-h6 q-px-lg q-mt-md row justify-between">
            <div>Sales</div>
        </div>

        <!-- Search bar -->
        <div class="row">
            <div style="width: 400px" class="justify-center q-ml-sm q-mb-md">
                <q-input clearable filled color="accent" v-model="searchTerm" label="Search here" />
            </div>
            <div class="q-mt-sm q-ml-md ">
                Total Sales
                {{ orders.length }}
                <div>Total Cost
                    $ {{ totalCost }}
                </div>
            </div>
        </div>

        <!-- Skeleton Loader while fetching orders -->
        <!-- Orders Table -->
        <template v-if="loading">
            <div class="row cart  q-ma-md q-mt-lg"  v-for="i in 5" :key="i" align="center">
                <div class="col-2"><q-skeleton type="QBtn" /></div>
                <div class="col-2"><q-skeleton type="QBtn" /></div>
                <div class="col-2"><q-skeleton type="QBtn" /></div>
                <div class="col-2"><q-skeleton type="QBtn" /></div>
                <div class="col-2"><q-skeleton type="QBtn" /></div>
                <div class="col-2"><q-skeleton type="QBtn" /></div>  
            </div>
        </template>
        <template v-else>
           
            <q-table :rows="filteredOrders" :columns="columns" row-key="_id" class="q-ma-md">
                <template v-slot:body-cell-item="props">
                    <q-td :props="props">{{ props.row.item.map(item => item.product.name).join(', ') }}</q-td>
                </template>
                <template v-slot:body-cell-user="props">
                    <q-td :props="props">{{ props.row.user.username }}</q-td>
                </template>
                <template v-slot:body-cell-address="props">
                    <q-td :props="props">{{ formatAddress(props.row.address) }}</q-td>
                  </template>
            </q-table>
        </template>
    </div>
    
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useQuasar } from "quasar";
import { getOrderStore } from "../store/ordercart";  // Assuming you have an orders store
import axios from 'axios';
import { storeToRefs } from "pinia";

const orderStore=getOrderStore();
const {fetchOrders, loading, orders}=storeToRefs(orderStore)

const $q = useQuasar();
const searchTerm = ref("");

const columns = [
    { name: 'user', label: 'User', field: 'user', align: 'left' },
    { name: 'item', label: 'Items', field: 'item', align: 'left' },
    { name: 'address', label: 'Address', field: 'address', align: 'left' },
    { name: 'paymentMethod', label: 'Payment Method', field: 'paymentMethod', align: 'left' },
    { name: 'finalTotal', label: '$Final Total', field: 'finalTotal', align: 'left' },
    { name: 'notes', label: 'Notes', field: 'notes', align: 'left' }
];


const totalCost=computed(()=>{
    return orders.value.reduce((sum, order) => sum + order.finalTotal, 0);  
})

const filteredOrders = computed(() => {
    return orders.value.filter(order =>
        order.user?.username.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
        order.item.some(item => item.product.name.toLowerCase().includes(searchTerm.value.toLowerCase())
        || order.finalTotal.toString().includes(searchTerm.value))
    );
});

const formatAddress = (address) => {
  return `${address.street}, ${address.city}, ${address.state}, ${address.zipCode}, ${address.country}`;
};

onMounted(() => {
    orderStore.fetchOrders();
   
});
</script>

<style scoped>
.cart {
    width: 98%;
    background-color: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
</style>