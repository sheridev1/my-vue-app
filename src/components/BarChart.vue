<template>
  <div>
    <!-- Bar Chart -->
    <div class="row">
      <div class="col-6">
        <div class="text-h5 text-bold">Users Data</div>
        <div v-if="loading">
          <q-skeleton type="rect" class="q-ml-lg q-mt-md" width="350px" height="250px" />
        </div>
        <div v-else>
          <canvas ref="barChart" width="250" height="250"></canvas>

        </div>
      </div>
      <div class="col-6">
        <div class="text-h5 text-bold">Product Data</div>
        <div v-if="visible">
          <q-skeleton type="rect" class="q-mt-md" width="250px" height="250px"  style="margin-left:100px; border-radius:50%"/>
        </div>
        <div v-else>
           <canvas ref="pieChart" width="250" height="250"></canvas> 
          <!-- <q-skeleton type="rect" class="q-mt-md" width="250px" height="250px"  style="margin-left:100px; border-radius:50%"/> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import Chart from "chart.js/auto";
import { storeToRefs } from "pinia";
import { useProductsStore } from "../store/products";
import { getCartStore } from "../store/addtocart";

// Initialize stores
const productStore = useProductsStore();
const cartStore = getCartStore();
const { fetchProducts, products ,visible} = storeToRefs(productStore);
const { getAllUsers, allusers ,loading } = storeToRefs(cartStore);


const totalUsers = computed(() => allusers.value.length);
const totalProducts = computed(() => products.value.length);
// References for chart canvases
const barChart = ref(null);
const pieChart = ref(null);

// Reactive data for charts
const usersByRole = ref({});
const productsByCategory = ref({});

// Function to render Bar Chart
const renderBarChart = () => {
  const barCtx = barChart.value.getContext("2d");
  new Chart(barCtx, {
    type: "bar",
    data: {
      labels: Object.keys(usersByRole.value),
      datasets: [
        {
          label: "Users by Role",
          data: Object.values(usersByRole.value),
          backgroundColor: ["#41B883", "#E46651", "#00D8FF"],
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  });
};

// Function to render Pie Chart
const renderPieChart = () => {
  const ctx = pieChart.value.getContext("2d");
  new Chart(ctx, {
    type: "pie",
    data: {
      labels: Object.keys(productsByCategory.value),
      datasets: [
        {
          label: "Products by Category",
          data: Object.values(productsByCategory.value),
          backgroundColor: ["#41B883", "#E46651", "#00D8FF"],
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  });
};

// Fetch and process user data
const fetchAndProcessUsers = async () => {
  try {
    await cartStore.getAllUsers();
    const userData = allusers.value; // Access the value correctly
    usersByRole.value = userData.reduce((acc, user) => {
      if (!acc[user.role]) {
        acc[user.role] = 0;
      }
      acc[user.role]++;
      return acc;
    }, {});
    renderBarChart();
  } catch (error) {
    console.error("Failed to fetch users:", error);
  }
};

// Fetch and process product data
const fetchAndProcessProducts = async () => {
  try {
    await productStore.fetchProducts();
    const productsData = products.value; // Access the value correctly
    productsByCategory.value = productsData.reduce((acc, product) => {
      if (!acc[product.category]) {
        acc[product.category] = 0;
      }
      acc[product.category]++;
      return acc;
    }, {});
    renderPieChart();
  } catch (error) {
    console.error("Failed to fetch products:", error);
  }
};

// Create charts on mounted
onMounted(() => {
  fetchAndProcessUsers();
  fetchAndProcessProducts();
});
</script>

<style scoped>
/* Add any custom styles here */
</style>
