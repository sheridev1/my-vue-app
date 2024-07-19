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
import FloatingBtn from '../components/FloatingBtn.vue'
import Admin from '../view/Admin.vue'
import MyLayout from '../layout/MyLayout.vue'
import AdminLayout from '../layout/AdminLayout.vue'
import Dashboard from '../view/DashBoard.vue'
import AddProducts from '../view/AddProducts.vue'
import Users from '../view/Users.vue';
import Sales from '../view/Sales.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: MyLayout,
      children: [
        { path: '', component: HomePage, meta: { showFloatingButton: true } },
        { path: '/register', name: 'register', component: Register, meta: { showFloatingButton: false } },
        { path: '/contact', name: 'contact', component: ContactPage, meta: { showFloatingButton: true } },
        { path: '/login', name: 'login', component: LoginPage, meta: { showFloatingButton: false } },
        { path: '/about', name: 'about', component: AboutPage, meta: { showFloatingButton: true } },
        { path: '/allproducts', name: 'allproducts', component: ProductsComp, props: true, meta: { showFloatingButton: false } },
        { path: '/product/:id', name: 'ProductDetail', component: ProductDetail, props: true, meta: { showFloatingButton: false } },
        { path: '/cart', name: 'cart', component: AddToCart, props: true, meta: { showFloatingButton: false } },
        { path: '/order/:id?', name: 'order', component: OrderPage, meta: { showFloatingButton: false } },
        { path: '/favourite', name: 'favourite', component: Favourite, meta: { showFloatingButton: false } },
        { path: '/search/search=:search/page=:page?', name: 'search', component: SearchedPage, props: true, meta: { showFloatingButton: false } },
        { path: '/category', name: 'category', component: CategoryComp, meta: { showFloatingButton: false } },
      ],
    },
    {
      path: '/admin',
      component: AdminLayout,
      meta: { requiresAuth: true }, // Optional: Requires authentication for all admin routes
      beforeEnter: (to, from, next) => {
        const userData = JSON.parse(localStorage.getItem('user'));
        const userRole = userData ? userData.role : null;
        console.log("User role", userRole)
        if (userRole === 'admin' || userRole === 'editor') {
          next(); // Allow access
        } else {
          next('/'); // Redirect if not authorized
        }
      },
      children: [
        { path: '', component: Dashboard },
        { path: 'chat', component: Admin, meta: { showFloatingButton: false } },
        { path: 'product', component: AddProducts, name: 'product' },
        { path: 'users', component: Users, name: "Users" },
        {
          path: 'sales', component: Sales, name: "Sales",
          beforeEnter: (to, from, next) => {
            const userData = JSON.parse(localStorage.getItem('user'));
            const userRole = userData ? userData.role : null;
            if (userRole === 'admin') {
              next(); // Allow access
            } else {
              next('/admin'); // Redirect if not authorized
            }
          }
        }
      ],
    },
  ]
});

// Navigator Guard
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

export default router;
