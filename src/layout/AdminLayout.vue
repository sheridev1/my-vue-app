<template>
    <q-layout view="hHh lpR fff">
        <q-page-container  class="admin-layout">
            <div class="admin-content">
                <router-view/>
            </div>
        </q-page-container>
    </q-layout>
</template>

<script setup>
import Admin from '../view/Admin.vue';
</script>

<style scoped>

</style>