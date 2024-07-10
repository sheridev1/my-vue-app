import { defineStore } from "pinia";
import axios from "axios";
import { removeItemStore } from "../store/remove";

export const getCartStore = defineStore("cart", {
  state: () => ({
    cart: {
      user: null,
      item: [],
    },
    token: localStorage.getItem("authToken") || null,
    user: JSON.parse(localStorage.getItem("user")) || null,
    product: 0,
    loading: false,
    cartLoading: false,
    error: null,
    count: 1,
    cartLength: 0,
    productArray: [],
    isCartDrawerOpen: false,
    allusers: 0,
    iseditor: false
  }),
  actions: {
    async addtoCart(product) {
      this.loading = true;
      this.errorMessage = null;
      try {
        const response = await axios.post(
          "http://localhost:5000/api/cart",
          product
        );
        console.log(response.data);

        this.cart = response.data;
        this.product = JSON.parse(this.cart);
      } catch (error) {
        this.error = error.response?.data?.message || "An error occurred";
      } finally {
        this.loading = false;
      }
    },
    async localcart(cart, param) {
      const userId = localStorage.getItem("userId");
      if (!cart) {
        cart = {
          user: this.generateGuestUserId(),
          item: [{ product: param, quantity: this.count }],
        };

        localStorage.setItem("cart", JSON.stringify(cart));
      } else {
        cart = JSON.parse(cart);
        // if (!cart.item) {
        //   cart.item = [];
        // }
        const existingItem = cart.item?.find((i) => i.product === param);
        if (existingItem) {
          existingItem.quantity += this.count;
        } else {
          cart.item?.push({ product: param, quantity: this.count });
        }
        localStorage.setItem("cart", JSON.stringify(cart));
        this.cartItem();
        this.lengthCart();
        this.resetCount();
      }
    },
    incrementCount() {
      this.count += 1;
    },
    decrementCount() {
      if (this.count > 1) {
        this.count -= 1;
      }
    },
    generateGuestUserId() {
      return "guest_" + Math.random().toString(36).substr(2, 9);
    },
    resetCount() {
      this.count = 1;
    },
    lengthCart() {
      this.cartLength = JSON.parse(localStorage.getItem("cart"))?.item?.length;
    },
    async cartItem() {
      this.cartLoading = true;
      const authToken = localStorage.getItem("authToken");
      const id_User = localStorage.getItem("id_User");

      let cart = localStorage.getItem("cart");
      if (!authToken && !id_User) {
        if (cart) {
          cart = JSON.parse(cart);
          for (const item of cart.item) {
            const { product: productId, quantity } = item;
            try {
              const response = await fetch(
                `http://localhost:5000/api/product/?id=${productId}`
              );
              const productData = await response.json();

              const existingProductIndex = this.productArray.findIndex(
                (product) => product.id === productId
              );
              if (existingProductIndex !== -1) {
                this.productArray[existingProductIndex].quantity = quantity;
              } else {
                this.productArray.push({
                  id: productId,
                  name: productData.myData.name,
                  price: productData.myData.price,
                  quantity,
                  quantityError: "",
                });
              }
            } catch (error) {
              console.log("Error while fetching", error);
            } finally {
              this.cartLoading = false;
            }
          }
        }
      } else {
        if (cart) {
          cart = JSON.parse(cart);
          cart.user = id_User;
          try {
            await this.addtoCart(cart);
          } catch (error) {
            console.log("Error while adding cart item to server");
          }

          const cartData = await this.fetchCartFromAPI(id_User);
          localStorage.setItem("cart", JSON.stringify(cartData));

          for (const item of cart.item) {
            const { product: productId, quantity } = item;
            try {
              const response = await fetch(
                `http://localhost:5000/api/product/?id=${productId}`
              );
              const productData = await response.json();

              const existingProductIndex = this.productArray.findIndex(
                (product) => product.id === productId
              );
              if (existingProductIndex !== -1) {
                this.productArray[existingProductIndex].quantity = quantity;
              } else {
                this.productArray.push({
                  id: productId,
                  name: productData.myData.name,
                  price: productData.myData.price,
                  quantity,
                  quantityError: "",
                });
              }
            } catch (error) {
              console.log("Error while fetching", error);
            } finally {
              this.cartLoading = false;
            }
          }
        }
      }
    },

    async fetchCartFromAPI(user) {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/cartData?user=${user}`
        );
        return response.data;
      } catch (error) {
        console.log("Error while fetching cart from API", error);
      }
    },
    toggleCartDrawer() {
      this.isCartDrawerOpen = !this.isCartDrawerOpen;
    },
    async updateCart() {
      let hasError = false;
      this.productArray.forEach((item, index) => {
        this.validateQuantity(item, index);
        if (item.quantityError) {
          hasError = true;
        }
      });

      if (hasError) return;

      const cart = {
        user: localStorage.getItem("userId"),
        item: this.productArray.map((item) => ({
          product: item.id,
          quantity: item.quantity,
        })),
      };

      localStorage.setItem("cart", JSON.stringify(cart));

      const authToken = localStorage.getItem("authToken");
      const id_User = localStorage.getItem("id_User");
      if (authToken && id_User) {
        const cartData = localStorage.getItem("cart");
        if (cartData) {
          const cartServer = JSON.parse(cartData);
          cartServer.user = id_User;

          const removeStore = removeItemStore();
          try {
            await removeStore.removeitems(cartServer);
          } catch (error) {
            console.log("Error while adding cart item to server");
          }

          const newcartData = await this.fetchCartFromAPI(id_User);
          this.lengthCart();
          console.log("cartData", removeStore.message);
        }
      }
    },
    validateQuantity(item, index) {
      if (item.quantity < 1) {
        item.quantityError = "Quantity cannot be less than 1";
        this.productArray.splice(index, 1);
      } else {
        item.quantityError = "";
      }
    },
    removeProduct(index) {
      this.productArray.splice(index, 1);
      this.lengthCart();
      this.updateCart();
    },
    setToken(token) {
      this.token = token;
      localStorage.setItem("authToken", token);
    },
    setUser(user) {
      console.log("user data", user);
      this.user = user;
      // localStorage.setItem('user', JSON.stringify({ user:this.user }));
    },
    signOut() {
      this.token = null;
      this.user = null;
      localStorage.removeItem("authToken");
      localStorage.removeItem("id_User");
      localStorage.removeItem("user");
    },
    //GetUsers
    async getAllUsers() {
      this.errorMessages = "";
      this.loading = true;
      try {
        const response = await axios.get("http://localhost:5000/api/getusers");
        this.allusers = response.data;
        this.success = "User fetched successfully";
        this.loading = false;
      } catch (error) {
        console.error("Problem while fetching Users:", error);
        this.errorMessages = "Failed to fetch Users";
      } finally {
        this.loading = false;
      }

    },
    async deleteUser(userId) {
      this.errorMessages = "";
      this.success = "";
      try {
        const response = await axios.delete(
          `http://localhost:5000/api/user/${userId}`
        );
        const deletedProduct = response.data.product;
        this.success = "User deleted successfully";
      } catch (error) {
        console.error("Problem while fetching Users:", error);
        this.errorMessages = "Failed to fetch Users";
      }
    },
    async editUser({ userId, updatedUser }) {
      this.success = null;
      try {
        const response = await axios.put(
          `http://localhost:5000/api/user/${userId}`,
          updatedUser
        );
        this.success = "User updated successfully";
      } catch (error) {
        console.log("Error Editing User", error);
        throw error;
      }
    },
    disable() {
      if (this.user.role == 'editor') {
        this.iseditor = true;
      } else {
        this.iseditor = false
      }
    },
  },
});
