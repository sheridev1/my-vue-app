<template>
  <div class="inputClass">
    <!-- <q-input type="text" debounce="500" v-model="searched" label="What are you looking for?"  >
      <template v-slot:append>
        <q-icon name="search"></q-icon>
      </template>
<q-popup-proxy transition-show="scale" transition-hide="scale">
  <q-list style="width:400px" v-if="searchResults.length">
    <q-item v-for="result in searchResults" :key="result.id" clickable @click="selectResult(result._id)">
      <q-item-section>
        <div class="row justify-between">
          <div class="col-6">
            <div class="row">
              <div class="col-8 ellipsis">
                {{ result.name }}
              </div>
              <div class="col-4">
                <img :src=slide1 alt="image" style="width: 40px; height:40px" />

              </div>
            </div>
          </div>
          <div class="col-6 text-right">
            <div>$ {{ result.price }}</div>
          </div>
        </div>
      </q-item-section>
    </q-item>
  </q-list>
  <div v-else-if="searched ">No products found</div>
  <q-overlay v-if="productsStore.visible && searched && !searchResults">
    <q-spinner-gears />
  </q-overlay>
</q-popup-proxy>
</q-input> -->

    <q-select color="black" bg-color="white" v-model="model" use-input hide-selected fill-input @input="handleInput"
      label="Search here" :options="option" input-debounce="500" option-label="name" @update:modelValue="selectResult"
      @keydown.enter.prevent="navigateToProduct">
      <template v-slot:no-option>
        <q-item>
          <q-item-section class="text-grey">
            No results
          </q-item-section>
        </q-item>
      </template>
    </q-select>

  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { useProductsStore } from '../store/products';
import slide1 from '../assets/p1.png';
import { useRouter } from 'vue-router';

const router = useRouter();
const productsStore = useProductsStore();
const model = ref(null);
const typedValue = ref('');
const selectedOption = ref(null);
const option = ref([])
const showPopup = ref(true);
let debounceTimeout;


const handleSearch = async (val) => {
  console.log("model123", model.value);
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(async () => {
    if (typedValue.value?.length >= 2) { // Change the length to 2 or 3 as needed
      await productsStore.searchProductsByName(typedValue.value);
      option.value = productsStore.searchedProduct;
    }
  }, 500);



  console.log("option value", option.value)
};

const selectResult = (id) => {
  if (model.value) {
    console.log("model", model.value)
    router.push({ name: 'ProductDetail', params: { id: model.value._id } });
  }
}

const handleInput = (value) => {
  typedValue.value = value.target.value;
  // typedValue.value = value.data;
  console.log("Typed value", typedValue);
  handleSearch();
};
const searchResults = computed(() => productsStore.searchedProduct || []);

const navigateToProduct = () => {

  if (typedValue?.value?.trim() !== '') {
    router.push({ name: 'search', params: { search: typedValue.value, page:1} });
  }
  else {
    console.log("model value does not exist")
  }
};


watch(typedValue, () => {
  handleSearch();
});
</script>

<style scoped>
.inputClass {
  width: 300px;
}
</style>
