<template>
  <Datepicker
    :uid="`date-${useId()}`"
    :modelValue="date"
    class="ct-datepicker"
    :placeholder="placeholder ?? 'Date'"
    :monthChangeOnScroll="false"
    inputFormat="MM/dd/yyyy"
    :minDate="minDate"
    :maxDate="maxDate"
    :clearable="true"
    :disabled="disabled"
    :enableTimePicker="showTime"
    :transitions="false"
    @update:modelValue="update"
  />
</template>

<script lang="ts" setup>
import { useId } from 'vue'
import Datepicker from '@vuepic/vue-datepicker'

defineProps<{
  date: Date | string | undefined
  placeholder?: string
  minDate?: Date
  maxDate?: Date
  disabled?: boolean
  showTime?: boolean
}>()
const emit = defineEmits<{
  (e: 'select', value: Date | undefined): void
}>()

const update = (input: Date | null | undefined) => {
  emit('select', input || undefined)
}
</script>

<style lang="postcss" scoped>
@import '../../css/defines.postcss';

.ct-datepicker {
  :deep(input) {
    @mixin text 14px;
    height: 40px;
    border-radius: 0;
  }
}
</style>
