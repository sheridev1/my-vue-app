<script setup>
import { useRoute, useRouter } from "vue-router";
import { computed, ref, onMounted, watch } from "vue";
import slide1 from "../assets/p2.png";
import { useProductsStore } from "../store/products";
import { getFavProductStore } from "../store/favouriteItems";

const IMAGEURL = slide1;
const route = useRoute();
const router = useRouter();
const productsStore = useProductsStore();
const productsFavStore = getFavProductStore();
const current = ref(1);
const loading = ref(true);
const star = ref(1);
const sortCriteria = ref("Price Low To High"); // default sorting criteria
const totalProducts = ref(0); // Declaring totalProducts as a ref

const sortedProducts = computed(() => {
  let items;
  if (route.query.category) {
    items = productsStore.limitedCategory;
  } else if (route.query.featured === "true") {
    items = productsStore.featuredProducts;
  } else {
    items = productsStore.limitedProducts;
  }

  return items.slice().sort((a, b) => {
    if (sortCriteria.value === "Price Low To High") {
      return a.price - b.price;
    } else if (sortCriteria.value === "Price High To Low") {
      return b.price - a.price;
    }
    return 0;
  });
});



const maxPage = computed(() => {
  return Math.ceil(totalProducts.value / 3);
});

onMounted(async () => {
  loading.value = true;
  totalProducts.value = await fetchProductsData();
  loading.value = false;
});

const fetchProductsData = async () => {
  let total = 0;
  if (route.query.category) {
    total = await productsStore.filterCategories(route.query.category, current.value);
  } else if (route.query.featured === "true") {
    total = await productsStore.featured(current.value);
    console.log("featured", total)
  } else {
    total = await productsStore.getProduct(current.value);
  }
  return total;
};

// const fetchProductsData = async () => {
//   await productsStore.fetchProducts();
//   await productsStore.filterProducts();
//   await productsStore.filterCategories(route.query.category, current.value);
//   await productsStore.getProduct(current.value);
// };

const viewProduct = (id) => {
  router.push({ name: "ProductDetail", params: { id } });
};

watch(current, async (newPage) => {
  loading.value = true;
  totalProducts.value = await fetchProductsData();
  loading.value = false;
});

const handleRoute = () => {
  console.log("router params", route.query);
  if (route.query.featured === "true") {
    router.push({
      name: "allproducts",
      query: { featured: true, page: current.value },
    });
  } else {
    router.push({
      name: "allproducts",
      query: { category: route.query.category, page: current.value },
    });
  }
};

const sortProducts = (criteria) => {
  sortCriteria.value = criteria;
};
</script>
<template>
  <div class="q-pa-md">
    <div class="q-pt-md q-ml-md q-my-md row justify-between">
      <div class="text-h3">All Products</div>
      <div class="row" align="center">
        <q-btn-dropdown label="Sort by Price">
          <q-list>
            <q-item clickable v-close-popup @click="sortProducts('Price Low To High')">
              <q-item-section>
                <q-item-label>Price Low To High</q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="sortProducts('Price High To Low')">
              <q-item-section>
                <q-item-label>Price High To Low</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </div>
    </div>
    <div class="q-mb-md q-ml-md">
      <span v-if="!loading">Displaying {{ sortedProducts.length }} out of
        {{ totalProducts }} products</span>
    </div>
    <template v-if="loading">
      <div class="full-width row wrap justify-center items-center content-center q-col-gutter-md">
        <div class="col-3" v-for="item in 8" :key="item">
          <q-card class="my-card">
            <q-skeleton height="200px" square />
            <q-card-section>
              <q-skeleton type="text" />
              <q-skeleton type="text" width="60%" />
              <q-skeleton type="QRating" />
            </q-card-section>
          </q-card>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="full-width row wrap justify-center items-center content-center q-col-gutter-md">
        <div class="col-3" v-for="item in sortedProducts" :key="item.id">
          <q-card class="my-card" style="width: 300px" @click="viewProduct(item._id)">
            <img :src="IMAGEURL" style="height: 250px" alt="image" />
            <div class="absolute-right column">
              <q-btn flat round :color="productsFavStore.isProductFavorite(item._id) ? 'red' : 'grey'
                " icon="favorite" @click="(event) => {
                    event.stopPropagation();
                    productsFavStore.toggleFavorite(item._id);
                  }
                  "></q-btn>
            </div>
            <q-card-section>
              <div class="text-h6 text-left">{{ item?.name }}</div>
              <div class="text-subtitle2 text-left flex row justify-between" style="font-weight: 300">
                $
                {{ item?.price }}
                <div class="">
                  {{ item.averageRating }}
                  <q-rating v-model="star" :max="1" size="2em" color="#ffb302" icon="star_border" readonly
                    icon-selected="star"></q-rating>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
      <div class="q-pa-lg flex flex-center">
        <q-pagination v-model="current" :max="maxPage" color="black" active-color="accent"
          @update:model-value="handleRoute" />
      </div>
    </template>
  </div>
</template>

<style scoped>
.my-card {
  cursor: pointer;
}
</style>
