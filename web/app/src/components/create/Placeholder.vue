<template>
  <div class="placeholder f-center-col">
    <div class="placeholder-title">Under Maintenance</div>
    <div class="placeholder-text">
      Project creation is currently disabled, check back in a few days.
    </div>
  </div>
</template>

<style lang="postcss" scoped>
@import '../../css/defines.postcss';

.placeholder {
  padding: 96px 40px 120px;
  min-height: calc(100vh - 360px);
  text-align: center;
}
.placeholder-title {
  @mixin semibold 32px;
  color: $text3;
}
.placeholder-text {
  @mixin medium 20px;
  color: $text-light;
  margin-top: 24px;
}
</style>
