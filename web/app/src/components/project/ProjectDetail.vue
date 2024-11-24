<template>
  <div class="project-detail">
    <div class="detail">
      <div class="detail-title">
        {{ ts('project.detail') }}
      </div>
      <div class="detail-text" v-html="description"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import sanitizeHtml from 'sanitize-html'
import snarkdown from 'snarkdown'
import { IProjectViewModel } from '@app/types'
import { ts } from '../../i18n'

const { project } = defineProps<{
  project: IProjectViewModel
}>()

const description = computed(() => {
  const html = snarkdown(project.description)
  return sanitizeHtml(html, {
    allowedTags: [
      'a',
      'b',
      'i',
      'em',
      'strong',
      'a',
      'div',
      'p',
      'br',
      'h1',
      'h2',
      'h3',
      'h4',
      'h4',
    ],
  })
})
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

@media (max-width: 680px) {
  .detail {
    width: 100%;
  }
}
</style>
