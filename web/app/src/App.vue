<template>
  <router-view />
</template>

<script lang="ts" setup></script>

<style lang="postcss">
@import './css/font.postcss';
@import './css/defines.postcss';
@import './css/app.postcss';

html,
body {
  padding: 0;
  margin: 0;
  width: 100%;
  height: 100%;
  background: white;
  color: black;
  * {
    box-sizing: border-box;
  }
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  position: relative;
  overflow: hidden;
}

.page-fade-enter-active,
.page-fade-leave-active {
  transition: opacity 0.25s linear;
}
.page-fade-enter-from,
.page-fade-leave-to {
  opacity: 0;
}

a {
  color: $blue1;
  text-decoration: none;
}

@media (max-width: 568px) {
  .container {
    padding-left: 20px;
    padding-right: 20px;
  }
}
</style>
