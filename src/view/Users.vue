<template>
    <div>
        <div>
            <div class="text-h6 q-px-lg q-mt-md row justify-between">
                <div>Add Users</div>
                <q-btn color="white" text-color="black" label="Add User" @click="openPopup(null)" />
            </div>

            <!-- Search bar -->
            <div class="row">
                <div style="width: 400px" class="justify-center q-ml-sm q-mb-md">
                    <q-input clearable filled color="accent" v-model="searchTerm" label="Search here" />
                </div>
                <div class="q-mt-md q-ml-md">Total Users {{ totalUsers }}</div>
            </div>
        </div>


        <template v-if="loading">

            <div align='center'>
                <div class="row cart">
                    <div class="col-3"><q-skeleton type="QBtn" /></div>
                    <div class="col-3"><q-skeleton type="QBtn" /></div>
                    <div class="col-3"><q-skeleton type="QBtn" /></div>
                    <div class="col-3"><q-skeleton type="QBtn" /></div>

                </div>

                <div class="row cart q-mt-lg" v-for="i in 3" :key="i">
                    <div class="col-3"><q-skeleton type="QBtn" /></div>
                    <div class="col-3"><q-skeleton type="QBtn" /></div>
                    <div class="col-3"><q-skeleton type="QBtn" /></div>
                    <div class="col-3"><q-skeleton type="QBtn" /></div>


                </div>
            </div>
        </template>
        <template v-else>
            <div align="center">
                <div class="cart row">
                    <div class="col-2">UserName</div>
                    <div class="col-4">Password</div>
                    <div class="col-2">Email</div>
                    <div class="col-2">Role</div>
                    <div class="col-2">Action</div>
                </div>
                <div class="row cart q-my-md justify-center items-center" v-for="item in filteredUsers" :key="item._id">
                    <div class="col-2 ellipsis">{{ item.username }}</div>
                    <div class="col-4 ellipsis">{{ item.password }}</div>
                    <div class="col-2">{{ item.email }}</div>
                    <div class="col-2">{{ item.role }}</div>
                    <div class="col-2 content-between q-gutter-x-md">
                        <q-btn icon="edit" style="width: 10px;" color="green" @click="openPopup(item)" />
                        <q-btn icon="delete" style="width: 10px;" color="negative" :disabled="disable"
                            @click="onDelete(item._id)" />
                    </div>
                </div>
            </div>
        </template>
    </div>

    <!-- dialog -->
    <q-dialog v-model="isPopupOpen">
        <div>
            <q-form @submit.prevent="isEditMode ? onUpdate() : onAdd()" @reset="onReset">
                <q-card style="width: 500px; height: 80%">
                    <q-card-section>
                        <div class="text-h6">
                            {{ isEditMode ? "Edit User" : "Add User" }}
                        </div>
                        <div class="q-gutter-md q-px-sm justify-center">
                            <div class="row q-gutter-md">
                                <q-input clearable filled color="accent" v-model="Username" label="Username"
                                    style="max-width: 200px" />
                                <q-input clearable filled color="accent" v-model="UserPassword" label="Password"
                                    style="max-width: 200px" />
                            </div>
                            <div class="row q-gutter-md">
                                <q-input clearable filled color="accent" v-model="Email" label="Email"
                                    style="max-width: 200px" />
                                <q-select color="black" filled use-input hide-selected fill-input v-model="UserRole"
                                    label="User Role" :options="RoleOptions" @filter="filterCategory"
                                    style="max-width: 200px">
                                    <template v-slot:no-option>
                                        <q-item>
                                            <q-item-section class="text-grey">
                                                No results
                                            </q-item-section>
                                        </q-item>
                                    </template>
                                </q-select>
                            </div>
                            <div align="center" v-if="errorMessage" class="q-mt-md text-accent">
                                {{ errorMessage }}
                            </div>
                            <div class="q-px-md">
                                <q-btn type="submit" color="white" text-color="black"
                                    :label="isEditMode ? 'Save User' : 'Add User'" />
                                <q-btn type="reset" color="black" flat class="q-ml-sm" label="Reset" />
                            </div>
                        </div>
                    </q-card-section>
                </q-card>
            </q-form>
        </div>
    </q-dialog>
</template>

<script setup>
import { onMounted, computed, ref } from "vue";
import { getCartStore } from "../store/addtocart";
import { storeToRefs } from "pinia";
import { useQuasar } from "quasar";
import axios from "axios";
const $q = useQuasar();
const searchTerm = ref("");
const cartStore = getCartStore();
const { getAllUsers, allusers, deleteUser, editUser, loading } = storeToRefs(cartStore);
const isPopupOpen = ref(false);
const getusers = computed(() => allusers.value);
const Username = ref("");
const UserPassword = ref("");
const Email = ref("");
const UserRole = ref("");
const RoleOptions = ref(["client", "admin", "editor"]);
const visible = ref(false);
const errorMessage = ref("");
const isEditMode = ref(false);
const popupTitle = ref("Add User");
const userId = ref("");
// const iseditor = ref('false')

// const disable = () => {
//     if (user.role === 'editor') {
//        iseditor=true;
//     }else{
//         iseditor=false
//     }
// }

const user = computed(() => cartStore.user);
const disable = computed(() => cartStore.iseditor)

const totalUsers = computed(() => allusers.value.length);

//add user
const addUser = async () => {
    const form = ref({
        username: Username.value,
        email: Email.value,
        password: UserPassword.value,
        role: UserRole.value,
    });
    console.log("form data", form.value);
    try {
        errorMessage.value = "";
        visible.value = true;
        const response = await axios.post(
            "http://localhost:5000/api/signup",
            form.value
        );
        console.log("Registration successful:", response.data);
        onReset();
        await cartStore.getAllUsers(); // Fetch updated list of user
        filteredUsers //shows updated list
    } catch (error) {
        console.log("error", error);
        if (error.response.data.error || error.response?.data.message) {
            errorMessage.value =
                error.response.data.error || error.response.data.message;
        } else {
            console.log("error response", error.response);
            console.log("error data", error.response.data.error);
            errorMessage.value = "An unexpected error occurred.";
        }
    } finally {
        visible.value = false;
    }
};
//onUpdate
const onUpdate = async () => {
    const updatedUser = {
        username: Username.value,
        email: Email.value,
        password: UserPassword.value,
        role: UserRole.value,
    };
    try {
        const editedUser = await cartStore.editUser({
            userId: userId.value,
            updatedUser,
        });
        $q.notify({
            type: "positive",
            message: `User updated successfully.`,
        });
        await cartStore.getAllUsers();
        isPopupOpen.value = false;
        onReset();
    } catch (error) {
        console.error("Error editing user:", error);
        $q.notify({
            type: "negative",
            message: "Failed to update user. Please try again later.",
        });
    }
};
//delete
const onDelete = async (userId) => {
    if (disable.value) return;
    try {
        const deletedProduct = await cartStore.deleteUser(userId);
        $q.notify({
            type: "positive",
            message: `User deleted successfully.`,
        });

        await cartStore.getAllUsers(); // Fetch updated list of products
    } catch (error) {
        console.error("Error deleting product:", error);
        $q.notify({
            type: "negative",
            message: "Failed to delete product. Please try again later.",
        });
    }
};

//filter users
const filteredUsers = computed(() => {
    if (!searchTerm.value) {
        return allusers.value;
    }
    return allusers.value.filter(
        (user) =>
            user.username.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
            user.role.toLowerCase().includes(searchTerm.value.toLowerCase())
    );
});

//open dialgoe box
const openPopup = (userData) => {
    isEditMode.value = !!userData;
    if (isEditMode.value) {
        popupTitle.value = "Edit User";
        userId.value = userData._id;
        Username.value = userData.username;
        Email.value = userData.email;
        UserPassword.value = userData.password;
        UserRole.value = userData.role;
    }
    else {
        popupTitle.value = "Add User";
        onReset();
    }
    isPopupOpen.value = true;
};

//reset form
const onReset = () => {
    Username.value = "";
    UserPassword.value = "";
    Email.value = "";
    UserRole.value = "";
};

onMounted(async () => {
    await cartStore.getAllUsers();
    cartStore.disable()
    // console.log("users",allusers)
});
</script>

<style scoped>
.cart {
    width: 98%;
    background-color: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

i {
    cursor: pointer;
}
</style>
