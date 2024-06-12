
<script setup>
//import img1 from '../assets/Frame.png';
import slide1 from '../assets/p1.png';
import slide2 from '../assets/p2.png';
import slide3 from '../assets/p3.png';
import slide4 from '../assets/p4.png'
// import side4 from '../assets/Frame9.png';
import { AwesomeImageGallery } from 'vue-awesome-image-gallery'
</script>
<template>
    <div style="width: 500px">
        <awesome-image-gallery
            :images="[
                {
                    url: slide1,
                },
                {
                    url: slide2,
                },
                
                {
                    url:slide4
                }
            ]"
            :scale="1",
            disable-zoom="false"
        />
    </div>
</template>


  