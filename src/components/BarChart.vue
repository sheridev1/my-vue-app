<template>
  <div>
    <!-- Bar Chart -->
    <div class="row">

      <div class="col-6">
        <div class="text-h5 text-bold">Users Data {{products}}</div>
        <div>
          <canvas ref="barChart" width="400" height="400"></canvas>
        </div>
      </div>
      <div class="col-6">
        <div class="text-h5 text-bold">Product Data</div>
        <div>
          <canvas ref="pieChart" width="400" height="400"></canvas>
        </div>
      </div>
    </div>


  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import Chart from 'chart.js/auto';
import { storeToRefs } from "pinia";
import { useProductsStore } from "../store/products";
const productStore = useProductsStore();
const {
  addProduct,
  success,
  errorMessages,
  fetchCategories,
  categories,
  companies,
  fetchProducts,
  products,
} = storeToRefs(productStore);


const productData=computed(()=>{ products.value})

console.log("Product Data", productData.value)
// Bar Chart Data
const barChart = ref(null);
const barChartData = {
  labels: ['Admins', 'Editors', 'Clients'],
  datasets: [{
    label: 'User Roles',
    data: [15, 8, 25],
    backgroundColor: ['#41B883', '#E46651', '#00D8FF'],
    borderWidth: 1
  }]
};

// Pie Chart Data
const pieChart = ref(null);
const pieChartData = {
  labels: ['Electronics', 'Clothing', 'Books'],
  datasets: [{
    label: 'Product Count',
    data: [30, 20, 15],
    backgroundColor: ['#41B883', '#E46651', '#00D8FF'],
    borderWidth: 1
  }]
};

// Create Charts on Mounted
onMounted(async() => {
  //fetch Product data
  await productStore.fetchProducts();
  // Bar Chart
  const barCtx = barChart.value.getContext('2d');
  new Chart(barCtx, {
    type: 'bar',
    data: barChartData,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });

  // Pie Chart
  const pieCtx = pieChart.value.getContext('2d');
  new Chart(pieCtx, {
    type: 'pie',
    data: pieChartData,
    options: {
      responsive: true,
      maintainAspectRatio: false,
    }
  });
});
</script>

<style scoped>
/* Add any custom styles here */
</style>
