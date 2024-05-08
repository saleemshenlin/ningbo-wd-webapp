<!-- eslint-disable no-unused-vars -->
<script setup lang="ts">
import { reactive } from 'vue'
import PhoneLogin from './pages/PhoneLogin/PhoneLogin.vue'

const baseUrl = '/device-management'

const onLogOut = () => {
    console.log('logout')
}

const onLogIn = () => {
    console.log('login')
}
</script>

<template>
    <a-layout class="app-layout">
        <phone-login
            :jumpLoading="false"
            :enableQR="true"
            :log-out="onLogOut"
            :base-url="baseUrl"
            @login="onLogIn"
        />
    </a-layout>
</template>

<style lang="scss" scoped>
.app-layout {
    height: 100vh;
}
</style>
