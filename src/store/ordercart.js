import { defineStore } from 'pinia';
import axios from 'axios';

export const getOrderStore = defineStore('ordercart', {
  state: () => ({
    ordercart: null,
    loading: false,
    error: null,
    orders:[]
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
    },
    async fetchOrders() {
      this.loading=true
      try {
        const response = await fetch('http://localhost:5000/api/order/getOrders');
        const data = await response.json();
        this.orders = data;
        this.loading=false;
        console.log("orders", this.orders)
      } catch (error) {
        console.error('Error fetching orders:', error);
        this.loading=true;
      }
    }
  },
});