<template>
  <div class="created-wrap">
    <div class="no-projects f-center-col">
      <div class="no-text">
        {{ ts('profile.no_created') }}
      </div>
      <router-link :to="{ name: 'Create' }" class="browse-link">
        <CTButton :text="ts('profile.create')" />
      </router-link>
    </div>
  </div>
</template>

<script lang="ts" setup>
import CTButton from '../widgets/CTButton.vue'
import { ts } from '../../i18n'
</script>

<style lang="postcss" scoped>
@import '../../css/defines.postcss';

.created-wrap {
  min-height: 240px;
  padding: 0 24px;
}
.no-projects {
  padding: 40px 0 0 0;
}
.no-text {
  @mixin semibold 18px;
  color: $text-light;
  text-align: center;
}
.browse-link {
  margin-top: 24px;
}
</style>
