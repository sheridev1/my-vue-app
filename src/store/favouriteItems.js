import { defineStore } from 'pinia';
import axios from 'axios';

export const getFavProductStore = defineStore(' ', {
    state: () => ({
        products: [],
        loading: false,
        error: null,
        favorites: JSON.parse(localStorage.getItem('favorites')) || []
    }),
    actions: {
        async fetchProductById(id) {
            this.loading = true;
            try {
              const response = await axios.get(`http://localhost:5000/api/product/?id=${id}`);
              const product = response.data.myData;
              console.log("fecth fav", product)
              this.products = [...this.products.filter(p => p._id !== id), product];
            } catch (error) {
              this.error = error.response?.data?.message || 'An error occurred';
            } finally {
              this.loading = false;
            }
          },
        // filterProducts() {
        //     // Implement your filter logic here
        //     this.filtered = this.products.filter(product => product.featured);
        // },
        isProductFavorite(productId) {
            console.log("product id", productId)
            return this.favorites.includes(productId);
        },
        toggleFavorite(productId) {
            const index = this.favorites.indexOf(productId);
            if (index !== -1) {
                this.favorites.splice(index, 1);
            } else {
                this.favorites.push(productId);
            }
            localStorage.setItem('favorites', JSON.stringify(this.favorites));
            this.updateFavoriteProducts();
        },
        async updateFavoriteProducts() {
            const favProducts = [];
            for (const id of this.favorites) {
                await this.fetchProductById(id);
                favProducts.push(this.products.find(product => product._id === id));
            }
            this.products = favProducts;
        },
    },
});
