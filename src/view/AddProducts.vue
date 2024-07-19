<template>
  <div>
    <div class="text-h6 q-px-lg q-mt-md row justify-between">
      <div>Add Products</div>
      <q-btn color="white" text-color="black" label="Add Product" @click="openPopup(null)" />
    </div>

    <!-- Search bar -->
    <div class="row ">
      <div style="width: 400px" class="justify-center q-ml-sm q-mb-md">
        <q-input clearable filled color="accent" v-model="searchTerm" label="Search here" />
      </div>
      <div class="q-mt-md q-ml-md">
        Total Products
        {{ totalProducts }}
      </div>
    </div>

    <template v-if="visible">

      <div align='center'>
        <div class="row cart">
          <div class="col-3"><q-skeleton type="QBtn" /></div>
          <div class="col-3"><q-skeleton type="QBtn" /></div>
          <div class="col-3"><q-skeleton type="QBtn" /></div>
          <div class="col-3"><q-skeleton type="QBtn" /></div>
        </div>
        <div class="row cart q-mt-lg" v-for="i in 5" :key="i">
          <div class="col-3"><q-skeleton type="QBtn" /></div>
          <div class="col-3"><q-skeleton type="QBtn" /></div>
          <div class="col-3"><q-skeleton type="QBtn" /></div>
          <div class="col-3"><q-skeleton type="QBtn" /></div>
        </div>
      </div>
    </template>
    <template v-else>
      <div align="center">
        <div class="row cart">
          <div class="col-1">Name</div>
          <div class="col-3">Featured</div>
          <div class="col-2">Price</div>
          <div class="col-2">Category</div>
          <div class="col-2">Company</div>
          <div class="col-2">Action</div>
        </div>
        <div class="row cart q-my-md items-center" v-for="item in filteredProducts" :key="item.id">
          <div class="col-1">{{ item.name }}</div>
          <div class="col-3">{{ item.featured }}</div>
          <div class="col-2">{{ item.price }}</div>
          <div class="col-2">{{ item.category }}</div>
          <div class="col-2">{{ item.company }}</div>
          <div class="col-2 content-between q-gutter-x-md">
            <q-btn icon="edit" style="width: 10px;" color="green" @click="openPopup(item)" />
            <q-btn icon="delete" style="width: 10px;" color="negative" :disabled="disable"
              @click="onDelete(item._id)" />
          </div>
        </div>
      </div>
    </template>

    <!-- dialog -->
    <q-dialog v-model="isPopupOpen">
      <div>
        <q-form @submit.prevent="isEditMode ? onUpdate() : onAdd()" @reset="onReset">
          <q-card style="width: 500px; height: 80%">
            <q-card-section>
              <div class="text-h6">
                {{ isEditMode ? "Edit Product" : "Add Product" }}
              </div>
              <div class="q-gutter-md q-px-sm justify-center">
                <div class="row q-gutter-md">
                  <q-input clearable filled color="accent" v-model="productName" label="Name"
                    style="max-width: 200px" />
                  <q-input clearable filled color="accent" v-model="productPrice" label="Price"
                    style="max-width: 200px" />
                </div>
                <div class="row q-gutter-md">
                  <q-input clearable filled color="accent" v-model="productFeatured" label="Featured"
                    style="max-width: 200px" />
                  <q-select color="black" filled use-input hide-selected fill-input v-model="productCategory"
                    label="Category" :options="categoryOptions" @filter="filterCategory" style="max-width: 200px">
                    <template v-slot:no-option>
                      <q-item>
                        <q-item-section class="text-grey">
                          No results
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>
                </div>
                <div style="width: 435px" class="q-px-md columns q-gutter-y-md">
                  <q-select color="black" filled use-input hide-selected fill-input v-model="productCompany"
                    label="Company" :options="companyOptions" @filter="filterCompanies">
                    <template v-slot:no-option>
                      <q-item>
                        <q-item-section class="text-grey">
                          No results
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>
                </div>
                <div class="q-px-md">
                  <q-btn type="submit" color="white" text-color="black"
                    :label="isEditMode ? 'Save Product' : 'Add Product'" />
                  <q-btn type="reset" color="black" flat class="q-ml-sm" label="Reset" />
                </div>
              </div>
            </q-card-section>
          </q-card>
        </q-form>
      </div>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, onBeforeMount, onMounted, computed } from "vue";
import { useQuasar } from "quasar";
import { storeToRefs } from "pinia";
import { useProductsStore } from "../store/products";
import { getCartStore } from "../store/addtocart";
const productStore = useProductsStore();
const cartStore = getCartStore();
const {
  addProduct,
  success,
  errorMessages,
  fetchCategories,
  categories,
  companies,
  fetchProducts,
  products,
  visible
} = storeToRefs(productStore);
const disable = computed(() => cartStore.iseditor)
const searchTerm = ref("");
const isPopupOpen = ref(false);
const productName = ref("");
const productPrice = ref("");
const productFeatured = ref("");
const productCategory = ref("");
const productCompany = ref("");
const companyOptions = ref([]);
const categoryOptions = ref([]);
const productId = ref("");
const isEditMode = ref(false);
const popupTitle = ref("Add Product");

const totalProducts = computed(() => products.value.length);

const filteredProducts = computed(() => {
  if (!searchTerm.value) {
    return products.value;
  }
  return products.value.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      product.price.toString().includes(searchTerm.value) ||
      product.category.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      product.company.toLowerCase().includes(searchTerm.value.toLowerCase())
  );
});
const $q = useQuasar();

const openPopup = (productData) => {
  isEditMode.value = !!productData;
  if (isEditMode.value) {
    popupTitle.value = "Edit Product";
    productId.value = productData._id;
    // Populate fields with existing product data for editing
    productName.value = productData.name;
    productPrice.value = productData.price;
    productFeatured.value = productData.featured;
    productCategory.value = productData.category;
    productCompany.value = productData.company;
  } else {
    popupTitle.value = "Add Product";
    onReset(); // Reset form fields for adding new product
  }
  isPopupOpen.value = true;
};

//add product
const onAdd = async () => {
  const formData = {
    name: productName.value,
    price: productPrice.value,
    featured: productFeatured.value,
    category: productCategory.value,
    company: productCompany.value,
  };
  console.log("formData", formData);
  try {
    const addedProduct = productStore.addProduct(formData);
    $q.notify({
      type: "positive",
      message: `Product added successfully.`,
    });
    await productStore.fetchProducts();
    filteredProducts
    isPopupOpen.value = false;
    onReset();
  } catch (error) {
    console.error("Error adding product:", error);
    $q.notify({
      type: "negative",
      message: "Failed to add product. Please try again later.",
    });
  }
};

//update
const onUpdate = async () => {
  const updatedProduct = {
    name: productName.value,
    price: productPrice.value,
    featured: productFeatured.value,
    category: productCategory.value,
    company: productCompany.value,
  };

  try {
    const editedProduct = await productStore.editProduct({
      productId: productId.value,
      updatedProduct,
    });
    $q.notify({
      type: "positive",
      message: `Product updated successfully.`,
    });
    await productStore.fetchProducts();
    isPopupOpen.value = false;
    onReset();
  } catch (error) {
    console.error("Error editing product:", error);
    $q.notify({
      type: "negative",
      message: "Failed to update product. Please try again later.",
    });
  }
};

//delete
const onDelete = async (productId) => {
  try {
    const deletedProduct = await productStore.deleteProduct(productId);
    $q.notify({
      type: 'positive',
      message: `Product  deleted successfully.`,
    });

    await productStore.fetchProducts(); // Fetch updated list of products
  } catch (error) {
    console.error('Error deleting product:', error);
    $q.notify({
      type: 'negative',
      message: 'Failed to delete product. Please try again later.',
    });
  }
};
const onReset = () => {
  productName.value = "";
  productPrice.value = "";
  productFeatured.value = "";
  productCategory.value = "";
  productCompany.value = "";
};

const filterCompanies = (val, updateOptions) => {
  const filteredOptions = productStore.companies.filter((option) =>
    option.toLowerCase().includes(val.toLowerCase())
  );
  console.log("filtered", filteredOptions);
  updateOptions(filteredOptions);
  companyOptions.value = filteredOptions;
};

const filterCategory = (val, updateOptions) => {
  const filteredOptions = productStore.categories.filter((option) =>
    option.toLowerCase().includes(val.toLowerCase())
  );
  console.log("filtered", filteredOptions);
  updateOptions(filteredOptions);
  categoryOptions.value = filteredOptions;
};

onMounted(async () => {
  await productStore.fetchCategories();
  await productStore.fetchProducts();
  cartStore.disable()
  companyOptions.value = productStore.companies;
  categoryOptions.value = productStore.categories;
  console.log("Fetched products:", products.value);
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

i {
  cursor: pointer;
}
</style>
