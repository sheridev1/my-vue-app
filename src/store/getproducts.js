import { defineStore } from 'pinia';
import axios from 'axios';

export const getProductStore = defineStore('product', {
  state: () => ({
    product: null,
    loading: false,
    error: null,
  }),
  actions: {
    async fetchProductById(id) {
      this.loading = true;
      this.errorMessage = null;
      try {
        const response = await axios.get(`http://localhost:5000/api/product/?id=${id}`);
        this.product = response.data.myData;
      } catch (error) {
        this.error = error.response?.data?.message || 'An error occurred';
      } finally {
        this.loading = false;
      }
    },
  },
});
