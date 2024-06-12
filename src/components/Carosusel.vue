<script setup>
import { ref } from "vue";
import image1 from '../assets/image1.png'
import apple from '../assets/apple.png'
import banner1 from '../assets/banner1.png'

const slide = ref(1);

const slideDetails = [
  {
    key: '1',
    name: '1',
    imagePath: banner1
  },
  {
    key: '2',
    name: '2',
    imagePath: banner1
  },
  {
    key: '3',
    name: '3',
    imagePath: 'https://cdn.quasar.dev/img/mountains.jpg'
  },
]



</script>

<template>
  <div class="q-pt-xs">
    <q-carousel animated v-model="slide" arrows navigation infinite class="text-white shadow-1 rounded-borders">
      <q-carousel-slide :name="2" img-src="../assets/banner2.png" />
      <q-carousel-slide :name="1" img-src="../assets/banner1.png" />
      <q-carousel-slide  :name="3" img-src="../assets/banner3.png" />
    </q-carousel>
  </div>
</template>
