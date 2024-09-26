<template>
  <div class="connect-wrap">
    <h1 class="connect-title" v-html="ts('connect.title')"></h1>
    <div class="connect-text">
      {{ ts('connect.text') }}
    </div>
    <div class="button1 button2">
      {{ ts('connect.button') }}
    </div>
    <div class="how">
      {{ ts('connect.how') }}
    </div>
    <ol class="how-items">
      <li v-html="ts('connect.install')"></li>
      <li>{{ ts('connect.click') }}</li>
      <li>{{ ts('connect.email') }}</li>
    </ol>
  </div>
</template>

<script lang="ts" setup>
import { ts } from '../i18n'
</script>

<style lang="postcss" scoped>
@import '../css/defines.postcss';

.connect-wrap {
  padding: 64px 0 120px;
  position: relative;
}

.connect-title {
  @mixin title 40px;
  margin: 0;
  text-align: center;
  font-weight: 800;
  position: relative;
  :deep(span) {
    color: $blue3;
  }
}
.connect-text {
  @mixin text 16px;
  margin: 16px auto 0;
  max-width: 420px;
  text-align: center;
}
.button2 {
  width: 120px;
  margin: 24px auto 0;
  text-align: center;
}
.how {
  @mixin title 20px;
  margin-top: 48px;
  text-align: center;
}
.how-items {
  @mixin text 18px;
  max-width: 480px;
  margin: 16px auto;
  li {
    margin-top: 12px;
  }
}
</style>
