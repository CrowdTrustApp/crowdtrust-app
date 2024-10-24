<template>
  <div class="project-detail">
    <div class="detail">
      <div class="detail-title">
        {{ ts('project.detail') }}
      </div>
      <div class="detail-text">
        {{ project.description }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { IProjectViewModel } from '@app/types'
import { ts } from '../../i18n'

defineProps<{
  project: IProjectViewModel
}>()
</script>

<style lang="postcss" scoped>
@import '../../css/defines.postcss';

.project-detail {
  display: flex;
  padding-top: 32px;
}
.detail {
  width: 80%;
  padding: 0 8px 0 4px;
}
.detail-title {
  @mixin semibold 32px;
}
.detail-text {
  @mixin text 18px;
  line-height: 1.5em;
  margin-top: 16px;
}
.progress-wrap {
  margin-top: 4px;
  height: 2px;
  background-color: rgba(0, 0, 0, 0.25);
  position: relative;
}
.progress {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  background-color: $blue2;
}
</style>
