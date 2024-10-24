<template>
  <div class="backed-wrap">
    <div class="no-projects f-center-col">
      <div class="no-text">
        {{ ts('profile.no_backed') }}
      </div>
      <router-link :to="{ name: 'Projects' }" class="browse-link">
        <CTButton :text="ts('footer.browse')" />
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

.backed-wrap {
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
