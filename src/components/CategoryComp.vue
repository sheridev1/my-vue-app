<template>
    <div class='column  q-gutter-x-md' style="width:100%">
        <div class="top-section row">
            <div class="full-width row q-gutter-sm  ">
                <div class="bg-accent rounded-borders" style="height: 40px; width: 20px;"></div>
                <div class="q-mt-md text-h6">Category</div>
                <div class="text-h4 full-width row justify-center ">
                    <div class="text-accent text-bold"
                        style="font-family:'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif">Check Out Our
                        Categories</div>
                </div>
            </div>
            <div class="row q-gutter-x-lg full-width justify-center  q-my-lg " align="center">

                <q-card class="my-card" @click="show('Mobile')"  @mouseover="displayMobile = true" @mouseleave="displayMobile = false">
                    <q-img src="../assets/mobile1.jpg">
                        <transition name="fade">
                        <div class="absolute-bottom text-h6" v-if="displayMobile">
                            Mobile
                        </div>
                        </transition>
                    </q-img>
                </q-card>


                <q-card class="my-card" @click="show('smartwatch')"  @mouseover="displaySmartwatch = true" @mouseleave="displaySmartwatch = false">
                    <q-img src="../assets/watch2.jpg" height="300px">
                        <transition name="fade">
                        <div class="absolute-bottom text-h6 card " v-if="displaySmartwatch">
                            Smart Watch
                        </div>
                    </transition>
                    </q-img>
                </q-card>


                <q-card class="my-card" @click="show('gamingconsole')"  @mouseover="displayGamingconsole = true" @mouseleave="displayGamingconsole = false">
                    <q-img src="../assets/console.jpg" height="300px">
                        <transition name="fade">
                        <div class="absolute-bottom text-h6 card" v-if="displayGamingconsole">
                            Gaming console
                        </div>
                    </transition>
                    </q-img>
                </q-card>


            </div>

        </div>



    </div>



</template>
<script setup>
import { useRouter } from "vue-router";
import { onMounted, ref } from 'vue';

const router = useRouter();
const displayMobile = ref(false);
const displaySmartwatch = ref(false);
const displayGamingconsole = ref(false);


const show = (category) => {
    console.log("catgory", category)
    router.push({ name: 'allproducts', params: { featured: 'false', category , page:1} })
}



</script>


<style scoped>
.red {
    background-color: #DB4444;

}

h1 {
    font-size: 20px;
}

.my-card {
    width: 300px;
    cursor: pointer;
}

.fade-enter-active, .fade-leave-active {
    transition: opacity 0.5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
    opacity: 0;
  }

</style>