import { defineStore } from "pinia";
import axios from "axios";
import { errorMessages } from "vue/compiler-sfc";
import { tiRuler } from "@quasar/extras/themify";

export const useProductsStore = defineStore("products", {
    state: () => ({
        products: [],
        filtered: [],
        limitedProducts: [],
        limitedCategory: [],
        searchedProduct: [],
        reviews: [],
        visible: false,
        errorMessages: "",
        currentPage: 1,
        featured: false,
        productPerpage: 4,
        hasMoreProducts: true,
        userHasReviewed: true,
    }),
    actions: {
        async fetchProducts() {
            this.visible = true;
            this.errorMessages = "";

            try {
                const response = await axios.get("http://localhost:5000/api/products/");
                this.products = response.data.myData;
            } catch (error) {
                this.errorMessage =
                    error.response?.data?.message || "Failed to load products";
            } finally {
                this.visible = false;
            }
        },
        async filterProducts() {
            this.visible = true;
            this.errorMessage = "";
            try {
                const response = await axios.get("http://localhost:5000/api/products/");
                this.filtered = response.data.myData.filter(product => product.featured == true);

            } catch (error) {
                this.errorMessage =
                    error.response?.data?.message || "Failed to load products";
            } finally {
                this.visible = false;
            }
        },
        async getProduct(page) {
            this.visible = true;
            this.errorMessages = "";
            try {
                const limit = 8;
                const url = `http://localhost:5000/api/products/filters/?page=${page}&limit=8`
                const response = await axios.get(url);
                this.limitedProducts = response.data.filteredData;
                this.currentPage = page;
                if (this.limitedProducts.length < limit) {
                    this.hasMoreProducts = false;
                } else {
                    this.hasMoreProducts = true;
                }
            }
            catch (error) {
                console.error('Failed to fetch products', error);
            }
            finally {
                this.visible = false;
            }
        },
        async filterCategories(name, page) {
            this.visible = true;
            this.errorMessages = "";
            try {
                const limit = 8;
                const url = `http://localhost:5000/api/products/filters/?category=${name}&page=${page}&limit=8`
                const response = await axios.get(url);
                this.limitedCategory = response.data.filteredData;
                this.currentPage = page;
                if (this.limitedProducts.length < limit) {
                    this.hasMoreProducts = false;
                } else {
                    this.hasMoreProducts = true;
                }
            }
            catch (error) {
                console.error('Failed to fetch products', error);
            }
            finally {
                this.visible = false;
            }

        },
        async searchProductsByName(name) {
            this.visible = true;
            this.errorMessages = "";
            try {

                const url = `http://localhost:5000/api/products/filters/?name=${name}`
                const response = await axios.get(url);
                this.searchedProduct = response.data.filteredData;
                console.log("searched product", this.searchedProduct)

            }
            catch (error) {
                console.error('Failed to fetch products', error);
            }
            finally {
                this.visible = false;
            }

        },
        async postReview(params, reviewData) {
            this.visible = true;
            this.errorMessages = "";
            try {
                const url = `http://localhost:5000/api/products/${params}/review`;
                const response = await axios.post(url, reviewData);
                console.log("message", response.data.message)

                await this.getReviews(productId);
                this.errorMessages = '';

            } catch (error) {
                console.error('An error occurred while posting the review:', error);
            }
            finally {
                this.visible = false;
            }
        },
        async getReviews(params) {
            this.visible = true;
            this.errorMessages = "";
            try {
                const url = `http://localhost:5000/api/products/${params}/getreview`;
                const response = await axios.get(url);
                this.reviews = response.data.review;

            } catch (error) {
                this.errorMessages = error.response?.data?.message;
                console.log("error", this.errorMessages)
                console.error('An error occurred while posting the review:', error);
            }
            finally {
                this.visible = false;
            }
        },
        clearReviews() {
            this.reviews = [];
            this.hasUserReviewed = false;
        },
        async checkUserReview(data) {
            this.visible = true;
            this.errorMessages = "";
            try {
                const url = `http://localhost:5000/api/products/checkuser`;
                const response = await axios.post(url, data);
                this.userHasReviewed = response.data.hasReviewed;
            } catch (error) {
                this.errorMessages = 'Error checking user review';
            }
            finally {
                this.visible = false;
            }

        }

    },


});
