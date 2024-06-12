<template>
    <q-footer class="bg-black text-white q-pa-md" elevated>
        <q-card flat bordered class="bg-black text-white text-center">
            <q-card-section>
                <h1 class="text-h3">You can find us at</h1>
                <q-btn v-for="social in socials" :key="social.icon" :href="social.url" target="_blank" flat round dense
                    class="q-mx-sm text-white" icon>
                    <q-icon :name="social.icon" size="24px" />
                </q-btn>
            </q-card-section>
            <div class="row items-center justify-between ">
                <div class="col-4">
                    <div class="text-h6">Exclusive</div>
                    <p> 2024 Your Company. All rights reserved.</p>
                </div>
                <div class="column" >
                    <div class="text-bold">ACCOUNT</div>
                    <div class="column ">
                        <q-btn flat label="Home" padding="0px" dense style=" width:50px;"
                            @click="$router.push('/')" :class="{ 'active-link': isActiveRoute('/') }" />
                        <q-btn label="Contact" padding="0px" dense flat style=" width:50px; " @click="goToContactPage"
                            :class="{ 'active-link': isActiveRoute('/contact') }" />
                        <q-btn v-if="!istoken" flat padding="0px" dense label="Login" style=" width:50px; "
                            @click="goToLoginPage" :class="{ 'active-link': isActiveRoute('/login') }" />
                        <q-btn v-if="!isAuthenticated" flat padding="0px" style=" width:50px; " dense label="Sign Up"
                            @click="goToSignUpPage" :class="{ 'active-link': isActiveRoute('/register') }" />
                        <q-btn v-if="isAuthenticated" padding="0px" dense flat label="Logout" style=" width:80px; "
                            @click="logout" :class="{ 'active-link': isActiveRoute('/') }" />
                        <q-btn label="About" padding="0px" dense flat style=" width:50px;"
                            @click="$router.push('/about')" :class="{ 'active-link': isActiveRoute('/about') }" />

                    </div>
                </div>
                <div class="col-4">
                    <div class="text-bold q-mb-lg q-mt-none">QUICK LINKS</div>
                    <div  class="q-gutter-sm">
                        <div>Privacy Policy</div>
                        <div>Terms and Condition</div>
                        <div>FAQ</div>
                        <div>Contact</div>
                    </div>

                </div>
            </div>


        </q-card>
    </q-footer>
</template>

<script setup>

import { QFooter, QCard, QCardSection, QBtn, QIcon, QExpansionItem, QList, QItem, QItemSection, QSeparator } from 'quasar';

const socials = ref([
    { url: 'https://facebook.com', icon: 'mdi-facebook' },
    { url: 'https://twitter.com', icon: 'mdi-twitter' },
    { url: 'https://instagram.com', icon: 'mdi-instagram' }
]);

import { useRoute, useRouter } from 'vue-router';
import { ref, computed } from 'vue'
import SearchInput from "../components/SearchInput.vue";

const route = useRoute();
const router = useRouter();

const istoken = computed(() => localStorage.getItem('authToken'))


const goToLoginPage = () => {
    router.push('/login');
};

const goToSignUpPage = () => {
    router.push('/register');
};

const signOut = () => {
    if (istoken) {
        localStorage.removeItem('authToken');
        router.push('/login');
    }// Redirect to home after logout
};

const goToContactPage = () => {
    router.push('/contact');
}


const isActiveRoute = (path) => {
    return route.path === path;
};

</script>

<style scoped>
.active-link {
    text-decoration: underline;
    /* Example active link style */
}
</style>