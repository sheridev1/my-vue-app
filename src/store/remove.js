import { defineStore } from 'pinia';
import axios from 'axios';

export const removeItemStore = defineStore('message', {
  state: () => ({
    message:null,
    //ordercart: null,
    loading: false,
    error: null,
  }),
  actions: {
    async removeitems(product) {
      this.loading = true;
      this.errorMessage = null;
      try {
        const response = await axios.post('http://localhost:5000/api/removedata', product)
         console.log(response.data)
        
        this.message = response.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'An error occurred';
      } finally {
        this.loading = false;
      }
    },
  },
});