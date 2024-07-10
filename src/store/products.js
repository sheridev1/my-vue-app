import { defineStore } from "pinia";
import axios from "axios";
import { errorMessages } from "vue/compiler-sfc";
import { tiRuler } from "@quasar/extras/themify";

export const useProductsStore = defineStore("products", {
    state: () => ({
        products: [],
        filtered: [],
        success: "",
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
        categories: [],
        companies: []

    }),
    actions: {
        async addProduct(product) {
            this.visible = true;
            this.errorMessages = "";
            this.success = null;
            try {
                const response = await axios.post('http://localhost:5000/api/products/add', product, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                this.success = 'Product added successfully';
            } catch (error) {
                this.errorMessages = 'Failed to add product';
            } finally {
                this.visible = false;
            }

        },
        async fetchCategories() {
            this.visible = true;
            this.errorMessages = "";
            try {
                const response = await axios.get('http://localhost:5000/api/products/metadata');
                this.categories = response.data.categories;
                this.companies = response.data.companies;
            } catch (error) {
                console.error('Error fetching categories:', error);
                this.errorMessages = 'Failed to fetch categories';
            }
        },
        async deleteProduct(productId) {
            try {
                const response = await axios.delete(`http://localhost:5000/api/products/${productId}`);
                const deletedProduct = response.data.product;
                this.success = 'Product deleted successfully';
              } catch (error) {
                console.error('Error deleting product:', error);
                throw new Error('Failed to delete product. Please try again later.');
              }

        },
        async editProduct({ productId, updatedProduct }) {
            this.success = null;
            try {
              const response = await axios.put(`http://localhost:5000/api/products/${productId}`, updatedProduct);
              // Optionally, commit mutation to update the product in the store if needed
              this.success = 'Product updated successfully';
            } catch (error) {
              console.error('Error editing product:', error);
              throw error; // Handle or rethrow the error as needed
            }
          },          
        async fetchProducts() {
            this.visible = true;
            this.errorMessages = "";

            try {
                const response = await axios.get("http://localhost:5000/api/products");
                this.products = response.data.myData;
                this.visible = false;
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
