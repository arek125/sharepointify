<script setup lang="ts">
import { useUserStore } from './stores/user'
import { useMainStore } from '@/stores/main'
//import { inject } from 'vue'
//import axios from 'axios'
//const mainUrl = inject('$mainUrl')
const userStore = useUserStore()
const mainStore = useMainStore()
</script>

<template>
  <v-layout class="rounded rounded-md">
    <v-app-bar flat density="compact" title="Application bar" color="primary"></v-app-bar>

    <v-navigation-drawer
        expand-on-hover
        rail
      >
        <v-list>
          <v-list-item
            :prepend-avatar="userStore.userData.profilePictureUrl"
            :title="userStore.userData.Title"
            :subtitle="userStore.userData.siteInfo.Department"
          ></v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-list density="compact" nav>
          <v-list-item prepend-icon="mdi-home" to="/" title="Home" value="home"></v-list-item>
          <v-list-item prepend-icon="mdi-file" to="/profile" title="Profile" value="home"></v-list-item>
        </v-list>
      </v-navigation-drawer>

    <v-main class="d-flex align-center justify-center" style="min-height: 300px;">
      <router-view></router-view>
    </v-main>

    <v-snackbar
        :timeout="5000"
        v-model="mainStore.alert"
        :color="mainStore.alertColor"
        multi-line
        variant="outlined"
      >
      <template v-slot:actions>
        <v-btn density="compact" icon="mdi-close" @click="mainStore.alert = false"></v-btn>
      </template>
        {{ mainStore.alertText }}
    </v-snackbar>

  </v-layout>
</template>

<style scoped>
/* header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
} */
</style>
