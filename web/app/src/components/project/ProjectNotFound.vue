<template>
  <div class="not-found-wrap">
    <div class="not-found-title">
      {{ ts('not_found') }}
    </div>
    <div class="not-found-text">
      {{ ts('not_found_text') }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ts } from '../../i18n'
</script>

<style lang="postcss" scoped>
@import '../../css/defines.postcss';

.not-found-wrap {
  min-height: calc(100vh - 360px);
  padding: 96px 24px 80px;
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
  color: $text3;
}
.not-found-title {
  @mixin bold 32px;
}
.not-found-text {
  @mixin medium 20px;
  margin-top: 24px;
}
</style>
