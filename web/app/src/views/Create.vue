<template>
  <div class="create-wrap">
    <Placeholder v-if="disabled" />
    <div v-else class="create">
      <div class="create-title">
        {{ ts('create.title') }}
      </div>
      <div class="create-text">
        {{ ts('create.text') }}
      </div>
      <CTInput
        v-model="name.text.value"
        :suffix="name.suffix.value"
        :label="ts('name')"
        class="edit-input"
      />
      <CTTextArea
        v-model="blurb.text.value"
        :suffix="blurb.suffix.value"
        :label="ts('blurb')"
        class="edit-input"
      />
      <CTTextArea
        v-model="description.text.value"
        :suffix="description.suffix.value"
        rows="20"
        :label="ts('description')"
        class="edit-input"
      />
      <div class="create-bottom">
        <div class="goal bottom-item">
          <div class="label">
            {{ ts('funding_goal') }}
          </div>
          <CTInput
            v-model="goal"
            suffix="ETH"
            :placeholder="ts('amount')"
            class="bottom-input"
          />
        </div>
        <div class="category bottom-item">
          <div class="label">
            {{ ts('category') }}
          </div>
          <CTMultiselect
            :value="category"
            :placeholder="ts('category')"
            :options="categories"
            @select="category = $event?.value"
          />
        </div>
        <div class="start-time bottom-item">
          <div class="label">
            {{ ts('create.start') }}
          </div>
          <CTDatePicker
            :date="startTime"
            :placeholder="ts('create.start')"
            :minDate="new Date()"
            :showTime="true"
            @select="startTime = $event"
          />
        </div>
        <div class="duration bottom-item">
          <div class="label">
            {{ ts('duration') }}
          </div>
          <CTInput
            v-model="duration"
            suffix="days"
            :placeholder="ts('days')"
            class="bottom-input"
          />
        </div>
      </div>
      <div class="error" :class="{ show: !!error }">
        {{ error }}
      </div>
      <CTButton
        :animate="creating"
        :text="ts('submit')"
        class="submit-button"
        @click="create"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { addDays } from 'date-fns'
import { useCreate } from '@app/util-app'
import Placeholder from '../components/create/Placeholder.vue'
import CTInput from '../components/widgets/CTInput.vue'
import CTTextArea from '../components/widgets/CTTextArea.vue'
import { tr, ts } from '../i18n'
import CTButton from '../components/widgets/CTButton.vue'
import CTMultiselect from '../components/widgets/CTMultiselect.vue'
import { useInputLimit } from '../util-app/use-input-limit'
import CTDatePicker from '../components/widgets/CTDatePicker.vue'

const disabled = false
const { creating, error, createProject } = useCreate()

const categories = Object.entries(tr('categories')).map(([value, label]) => ({
  label,
  value,
}))

const name = useInputLimit({ min: 3, max: 50, label: 'Name' })
const blurb = useInputLimit({ min: 5, max: 200, label: 'Blurb' })
const description = useInputLimit({ min: 10, max: 10000, label: 'Description' })
const category = ref()
const startTime = ref<Date | undefined>(addDays(new Date(), 10))
const duration = ref('10')
const goal = ref('5')

const parseDuration = () => {
  const dur = parseInt(duration.value)
  if (isNaN(dur)) {
    if (duration.value.includes('.')) {
      return { error: 'Duration must be a number without decimals' }
    } else {
      return { error: 'Duration must be a number' }
    }
  } else if (dur > 90) {
    return { error: 'Maximum duration is 90 days' }
  } else if (dur < 1) {
    return { error: 'Duration must be at least 1 day' }
  }
  return { value: dur * 60 * 60 * 24 }
}

const parseGoal = () => {
  const valFloat = parseFloat(goal.value)
  if (isNaN(valFloat)) {
    return { error: 'Goal must be a number' }
  }
  const value = Math.round(1e18 * valFloat).toString()
  if (value.length > 100) {
    return { error: 'Goal must be a reasonable number' }
  }
  return { value }
}

const create = async () => {
  error.value = undefined
  const parsedDuration = parseDuration()
  const parsedGoal = parseGoal()

  if (name.error.value) {
    error.value = name.error.value
  } else if (blurb.error.value) {
    error.value = blurb.error.value
  } else if (description.error.value) {
    error.value = description.error.value
  } else if (!category.value) {
    error.value = 'Please select a category.'
  } else if (!startTime.value) {
    error.value = 'Please select a start date.'
  } else if (parsedDuration.error) {
    error.value = parsedDuration.error
  } else if (parsedGoal.error) {
    error.value = parsedDuration.error
  } else {
    await createProject({
      name: name.text.value,
      blurb: blurb.text.value,
      description: description.text.value,
      category: category.value,
      start_time: startTime.value.getTime() / 1000,
      duration: parsedDuration.value as number,
      funding_goal: parsedGoal.value as string,
    })
  }
}
</script>

<style lang="postcss" scoped>
@import '../css/defines.postcss';

.create {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 900px;
  padding: 80px 32px 120px;
  margin: 0 auto;
  position: relative;
}
.create-title {
  @mixin bold 36px;
}
.create-text {
  @mixin text 18px;
  margin: 16px 0 24px;
  line-height: 1.4em;
  max-width: 580px;
  text-align: center;
}
.edit-input {
  margin-top: 16px;
  width: 100%;
}
.create-bottom {
  display: flex;
  justify-content: center;
  margin-top: 24px;
}
.bottom-item {
  text-align: center;
}
.bottom-input :deep(input) {
  width: 140px;
}
.label {
  @mixin semibold 15px;
  margin-bottom: 4px;
}
.start-time {
  margin: 0 16px;
  :deep(input) {
    width: 180px;
  }
}
.category {
  margin-left: 16px;
}

.submit-button {
  padding-left: 24px;
  padding-right: 24px;
}
.error {
  @mixin text 15px;
  color: $red;
  text-align: center;
  max-width: 400px;
  width: 100%;
  min-height: 44px;
  padding: 12px 0;
  opacity: 0;
  transition: opacity 0.3s ease;
  &.show {
    opacity: 1;
  }
}
@media (max-width: 700px) {
  .create-bottom {
    flex-wrap: wrap;
    max-width: 420px;
  }
  .start-time {
    margin: 16px 16px 0 0;
  }
  .duration {
    margin-top: 16px;
  }
}
</style>
