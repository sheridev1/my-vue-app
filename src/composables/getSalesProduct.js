import { ref } from 'vue'
import axios from 'axios';


const getSalesProduct = () => {
    const error = ref(null)

    const products = ref([])


    async function fetchProducts() {
        try {
            let response = await axios.get('http://localhost:5000/api/products')
            console.log('data',response.data)
            if (response) {
                products.value = await response.data.json()

                console.log(products.value, 'products in Home Page')
                // console.log(products.value)
            } else {

                throw Error('No data Available')
            }


        } catch (err) {
            console.log(err)
        }
    }


    return { error, fetchProducts,products}
}
export default getSalesProduct;