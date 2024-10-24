<template>
  <div class="back-wrap">
    <BackBg />
    <h1 class="back-title" v-html="ts('back.why')"></h1>
    <div class="back-text">
      {{ ts('back.text') }}
    </div>
    <div class="back-sections">
      <BackSection
        :image="SecureImg"
        :title="ts('back.secure')"
        :text="ts('back.secure_text')"
        :yPos="yPos"
      />
      <BackSection
        :image="InformedImg"
        :title="ts('back.informed')"
        :text="ts('back.informed_text')"
        :yPos="yPos"
        :reversed="true"
      />
      <BackSection
        :image="SupportImg"
        :title="ts('back.support')"
        :text="ts('back.support_text')"
        :yPos="yPos"
      />
    </div>
    <HomeStart />
  </div>
</template>

<script lang="ts" setup>
import BackBg from '../components/back/BackBg.vue'
import HomeStart from '../components/home/HomeStart.vue'
import { ts } from '../i18n'
import BackSection from '../components/back/BackSection.vue'
import SecureImg from '../assets/img/back-secure.png'
import InformedImg from '../assets/img/back-informed.png'
import SupportImg from '../assets/img/back-support.png'
import { useScroll } from '@app/util-app'

const { yPos } = useScroll()
</script>

<style lang="postcss" scoped>
@import '../css/defines.postcss';

.back-wrap {
  padding: 108px 24px 120px;
  position: relative;
}

.back-title {
  @mixin title 54px;
  margin: 0 0 48px;
  text-align: center;
  font-weight: 800;
  position: relative;
  color: $text1;
  :deep(span) {
    color: $blue3;
  }
}
.back-text {
  @mixin text 24px;
  max-width: 712px;
  width: 100%;
  margin: 20px auto 0;
  text-align: center;
  color: $text3;
}
.back-sections {
  padding-bottom: 140px;
  position: relative;
}
@media (max-width: 800px) {
  .back-title {
    font-size: 48px;
  }
  .back-text {
    max-width: 530px;
  }
}
@media (max-width: 600px) {
  .back-text {
    font-size: 18px;
  }
  .back-sections {
    margin-top: 80px;
    padding-bottom: 40px;
  }
}
</style>
