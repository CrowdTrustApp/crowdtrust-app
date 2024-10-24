<template>
  <svg height="800" viewBox="0 0 24 24" width="800" xmlns="http://www.w3.org/2000/svg">
    <!-- eslint-disable -->
    <path
      :fill="color"
      d="m12.586 2.586a2 2 0 0 0 -1.414-.586h-7.172a2 2 0 0 0 -2 2v7.172a2 2 0 0 0 .586 1.414l8 8a2 2 0 0 0 2.828 0l7.172-7.172a2 2 0 0 0 0-2.828zm-5.586 6.414a2 2 0 1 1 .001-4.001 2 2 0 0 1 -.001 4.001z"
    />
    <!-- eslint-disable -->
  </svg>
</template>

<script lang="ts" setup>
withDefaults(
  defineProps<{
    color?: string
  }>(),
  {
    color: 'rgb(1, 98, 162)',
  },
)
</script>
