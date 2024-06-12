<script setup>
import Sideimage from '../assets/Sideimage.png'
import axios from 'axios';
import { ref } from "vue"
import { useRouter } from 'vue-router';
const router = useRouter();

const form = ref({
    username: "",
    email: "",
    password: ""
})
const visible = ref(false);
const errorMessage = ref('');

const onSubmit = async (e) => {
    console.log(form.value)
    try {
        errorMessage.value = ''
        visible.value = true;
        const response = await axios.post('http://localhost:5000/api/signup', form.value);
        const token = response.data.token;
       // console.log('Registration successful:', response.data);
        if (token) {
            localStorage.setItem('authToken', token);
            router.push('/'); // Redirect to home page
        }
        else {
            router.push('/login')

        }

    }
    catch (error) {
        console.log("error", error)
        if ( error.response.data.error || error.response.data.message) {
            errorMessage.value = error.response.data.error || error.response.data.message        
        } else {
            console.log("error response",error.response);
            console.log("error data",error.response.data.error);
            errorMessage.value = 'An unexpected error occurred.';
        }
    }
    finally {
        visible.value = false;
    }
}
</script>


<template>
    <div class="row q-my-lg q-mt-xl justify-center ">
        <div class="column q-pa-lg background  ">
            <q-inner-loading :showing="visible" label="Please wait..." label-class="text-accent"
                label-style="font-size: 1.1em" />
            <div class="text-h4 q-mb-md text-bold" align="center">Create an Account</div>
            <div class="text-body1 text-grey q-ml-md">Enter your details</div>
            <div class="q-pa-md" style="max-width: 400px">
                <q-form @submit.prevent="onSubmit" @reset="onReset" class="q-gutter-md" :ref="formComponet">
                    <q-input v-model="form.username" label="Username" color="accent" 
                        :rules="[val => val && val.length > 0 || 'Please Enter Username']" />

                    <q-input type="email" v-model="form.email" label="Email" color="accent" 
                        :rules="[val => val && val.length > 0 || 'Please Enter Email']" />
                    <q-input type="password" v-model="form.password" label="Your Password" color="accent" 
                        :rules="[
                            val => val !== null && val !== '' || 'Please Enter Your Password',
                            val => val.length > 8 || '8 minimum length'
                        ]" />
                    <div align="center" v-if="errorMessage" class="q-mt-md text-accent">{{ errorMessage }}</div>

                    <div align="center">
                        <q-btn label="Submit" type="submit" color="accent" />
                        <q-btn label="Reset" type="reset" color="black" flat class="q-ml-sm" />
                    </div>
                </q-form>
            </div>
        </div>
    </div>
</template>

<style scoped>
.background {
    width: 100%;
    max-width: 400px;
    background-color: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
</style>