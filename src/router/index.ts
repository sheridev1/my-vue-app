import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../view/HomePage.vue'
import ContactPage from '../view/ContactPage.vue'
import LoginPage from '../view/LoginPage.vue'
import AboutPage from '../view/AboutPage.vue'
import ProductsComp from '../components/ProductsComp.vue'
import Register from '../view/Register.vue';
import { getCartStore } from '../store/addtocart';
import ProductDetail from '../view/ProductDetail.vue';
import AddToCart from '../view/AddToCart.vue'
import OrderPage from '../view/OrderPage.vue'
import Favourite from '../view/favourite.vue'
import SearchedPage from '../view/SearchedPage.vue';
import CategoryComp from "../components/CategoryComp.vue"

const router = createRouter({

  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/register',
      name: 'register',
      component: Register

    },
    {
      path: '/',
      name: 'Home',
      component: HomePage
    },
    {
      path: '/contact',
      name: 'contact',
      component: ContactPage
    }
    , {
      path: '/login',
      name: 'login',
      component: LoginPage
    },
    {
      path: '/about',
      name: 'about',
      component: AboutPage
    },
    {
      path: '/allproducts/featured=:featured/category=:category?/page=:page?',
      name: 'allproducts',
      component: ProductsComp,
      props: true,

    },

    {
      path: '/product/:id',
      name: 'ProductDetail',
      component: ProductDetail,
      props: true,

    }, {
      path: '/cart',
      name: 'cart',
      component: AddToCart,
      props: true
    },
    {
      path: '/order/:id?',
      name: 'order',
      component: OrderPage
    },
    {
      path: '/favourite',
      name: 'favourite',
      component: Favourite
    },
    {
      path: '/search/search=:search/page=:page?',
      name: 'search',
      component: SearchedPage,
      props: true
    },
    {
      path:'/category',
      name:'catgory',
      component:CategoryComp
    }
  ]



})
// //navigator Guard
// router.beforeEach((to, from, next) => {
//   const isAuthenticated = localStorage.getItem('authToken');
//   if (to.matched.some(record => record.meta.requiresAuth)) {
//     // Page requires authentication
//     if (!isAuthenticated) {
//       // User is not authenticated, redirect to login page
//       next('/login');
//     } else {
//       // User is authenticated, proceed to the requested page
//       next();
//     }
//   } else {
//     // Page does not require authentication, allow access
//     next();
//   }
// },
// Navigation guard to close the cart drawer when route changes
// Navigation guard to close the cart drawer when route changes
router.beforeEach((to, from, next) => {
  window.scrollTo(0, 0);
  const cartStore = getCartStore();
  // Check if the cart drawer is open
  const isCartOpen = cartStore.isCartDrawerOpen; // Assuming isCartOpen is a state variable

  // If the cart drawer is open, close it
  if (isCartOpen) {
   

    // Dispatch an action to close the cart drawer
    cartStore.isCartDrawerOpen = false;
  }

  // Continue with the navigation
  next();
});


export default router
