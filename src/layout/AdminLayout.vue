<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="text-black">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          <div class="row justify-between">
            <div class="sidebar q-mt-xs" @click="router.push('/admin'); leftDrawerOpen = true;">
              DashBoard
            </div>
            <div class="row">
              <div class="text-body1 q-mt-sm">
                {{ user ? user.username : "" }}
              </div>
              <div v-if="user">
                <q-btn-dropdown color="black" flat style="width: 5px; height:5px">
                    <q-list>
                        <q-item clickable v-close-popup @click="signOut()">
                            <q-item-section>
                                <q-item-label>Sign Out</q-item-label>
                            </q-item-section>
                        </q-item>
                    </q-list>
                </q-btn-dropdown>
            </div>
            </div>
          </div>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <!-- drawer -->
    <q-drawer show-if-above v-model="leftDrawerOpen" side="left" bordered class="fixed-drawer">
      <q-list class="text-black sidebar">
        <q-item-label header>Side Bar</q-item-label>

        <q-item>
          <q-item-section avatar>
            <q-avatar>
              <i class="fa-solid fa-plus"></i>
            </q-avatar>
          </q-item-section>
          <q-item-section @click="navigate('/admin/product')">Add Products</q-item-section>
        </q-item>

        <q-item>
          <q-item-section avatar>
            <q-avatar>
              <i class="fa-solid fa-user"></i>
            </q-avatar>
          </q-item-section>
          <q-item-section @click="navigate('/admin/users')">Add User</q-item-section>
        </q-item>

        <q-item>
          <q-item-section avatar>
            <q-avatar>
              <i class="fa-solid fa-comment"></i>
            </q-avatar>
          </q-item-section>
          <q-item-section @click="navigate('/admin/chat')">Chat</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <div class="main-content">
        <router-view />
      </div>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { getCartStore } from "../store/addtocart";

const leftDrawerOpen = ref(false);
const router = useRouter();
const cartStore = getCartStore();
const user = computed(() => cartStore.user);
const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};

const navigate = (path) => {
  leftDrawerOpen.value = false;
  router.push(path);
};

const signOut = () => {
    cartStore.signOut();
    router.push('/login');
};

</script>

<style scoped>
.sidebar {
  cursor: pointer;
}

.fixed-drawer {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
}

.main-content {
  overflow-y: auto;
  height: 100vh;
  padding: 20px;
}
</style>
