import { defineStore } from 'pinia';
import axios from 'axios';

export const getOrderStore = defineStore('ordercart', {
  state: () => ({
    ordercart: null,
    loading: false,
    error: null,
  }),
  actions: {
    async order(billingdetail) {
      this.loading = true;
      this.errorMessage = null;
      try {
        const authToken = localStorage.getItem('authToken');
        const response = await axios.post('http://localhost:5000/api/order', billingdetail, {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          }
        }).then(response => {
          console.log('Success Order:', response.data);
        });
      } catch (error) {
        this.error = error.response?.data?.message || 'An error occurred';
      } finally {
        this.loading = false;
      }
    }
  },
});