<template>
  <div class="faq-item" :class="{ open }">
    <div class="faq-question" @click="open = !open">
      <div class="question-text">
        {{ question }}
      </div>
      <div class="toggle f-center">
        <div class="horizontal"></div>
        <div class="vertical"></div>
      </div>
    </div>
    <div class="faq-answer" v-html="answer"></div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

defineProps<{
  question: string
  answer: string
}>()

const open = ref(false)
</script>

<style lang="postcss" scoped>
@import '../../css/defines.postcss';

.faq-item {
  position: relative;
  max-width: 912px;
  width: 100%;
  margin: 16px auto 0;
}
.faq-question {
  @mixin title 16px;
  display: flex;
  cursor: pointer;
  color: $text2;
  border-radius: 12px;
  padding: 15px 25px;
  border: 2px solid $blue3;
}
.toggle {
  width: 20px;
  height: 20px;
  transition: all 0.25s ease;
  transform: rotate(0);
  position: relative;
  margin-left: auto;
}
.horizontal {
  background-color: $blue3;
  width: 100%;
  height: 2px;
  border-radius: 2px;
  opacity: 1;
  transition: all 0.25s ease;
}
.vertical {
  position: absolute;
  background-color: $blue3;
  width: 2px;
  height: 100%;
  border-radius: 2px;
  transition: all 0.25s ease;
}
.faq-answer {
  @mixin text 16px;
  display: none;
  padding: 15px 25px;
  background-color: rgba(26, 170, 226, 0.1);
  margin-top: 12px;
  line-height: 1.5em;
  :deep(span) {
    font-weight: 700;
  }
}
.faq-item.open {
  .toggle {
    transform: rotate(90deg);
  }
  .faq-question {
    background-color: $blue3;
    color: white;
    font-weight: 700;
  }
  .faq-answer {
    display: block;
  }
  .horizontal {
    opacity: 0;
    background-color: white;
  }
  .vertical {
    background-color: white;
  }
}
</style>
