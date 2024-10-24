<template>
  <div class="how-wrap">
    <HowBg />
    <h1 class="how-title" v-html="ts('how.how')"></h1>
    <div class="how">
      <HowSection
        v-for="section in sections"
        :key="section.number"
        :number="section.number"
        :title="section.title"
        :text="section.text"
        :image="section.image"
        :yPos="yPos"
      />
    </div>
    <HomeStart />
  </div>
</template>

<script lang="ts" setup>
import HomeStart from '../components/home/HomeStart.vue'
import HowBg from '../components/how/HowBg.vue'
import { ts } from '../i18n'
import { useScroll } from '@app/util-app'
import How1 from '../assets/img/how1.svg'
import How2 from '../assets/img/how2.svg'
import How3 from '../assets/img/how3.svg'
import How4 from '../assets/img/how4.svg'
import How5 from '../assets/img/how5.svg'
import HowSection from '../components/how/HowSection.vue'

const { yPos } = useScroll()

const sections = [
  { number: '01', title: ts('how.title1'), text: ts('how.text1'), image: How1 },
  { number: '02', title: ts('how.title2'), text: ts('how.text2'), image: How2 },
  { number: '03', title: ts('how.title3'), text: ts('how.text3'), image: How3 },
  { number: '04', title: ts('how.title4'), text: ts('how.text4'), image: How4 },
  { number: '05', title: ts('how.title5'), text: ts('how.text5'), image: How5 },
]
</script>

<style lang="postcss" scoped>
@import '../css/defines.postcss';

.how-wrap {
  padding: 108px 0 120px;
  position: relative;
}

.how-title {
  @mixin title 54px;
  margin: 0 0 48px;
  text-align: center;
  font-weight: 800;
  position: relative;
  :deep(span) {
    color: $blue3;
  }
}
.how {
  padding: 24px 0 120px;
  position: relative;
}
@media (max-width: 600px) {
  .how-title {
    font-size: 48px;
    max-width: 276px;
    margin: 0 auto;
  }
}
</style>
