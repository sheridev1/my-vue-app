<template>
    <q-breadcrumbs v-if="getRoute.path !== '/'" class="text-black">
        <q-breadcrumbs-el  to="/"/>
        <q-breadcrumbs-el v-if="getRoute.path === '/about'" label="about" />
        <q-breadcrumbs-el v-if="getRoute.path === '/contact'" label="contact"/>
        <q-breadcrumbs-el v-if="getRoute.path === '/login'" label="login" />
        
    </q-breadcrumbs>
  </template>
  
  <script setup>
  import { useRouter } from 'vue-router';
import {watch,ref, computed} from 'vue'

const router = useRouter();

const getRoute = computed(() => router.currentRoute.value)


    
  
</script>
  