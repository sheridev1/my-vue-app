import { ref } from 'vue'
import axios from 'axios';
import { useRouter } from 'vue-router';


const getAllProduct = () => {
    const error = ref(null)

    const Allproducts = ref([])


    async function fetchAllProducts() {
        try {
            let response = await axios.get('http://localhost:5000/api/products')
            console.log('Fetch all triffer',response.data)
            if (data.ok && data.status === 200) {
                Allproducts.value = await data.json()

                console.log(products.value, 'products in Home Page')
                // console.log(products.value)
            } else {

                throw Error('No data Available')
            }


        } catch (err) {
            console.log(err)
        }
    }


    return { error, fetchAllProducts,Allproducts}
}
export default getAllProduct;