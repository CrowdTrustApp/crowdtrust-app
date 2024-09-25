<template>
  <div class="home-why f-col">
    <div class="why-title">
      {{ ts('why_title') }}
    </div>
    <div class="why-line"></div>
    <div class="home-boxes">
      <div v-for="box in boxes" :key="box.title" class="home-box f-center-col">
        <div class="overlay"></div>
        <img :src="box.icon" />
        <div class="box-title">
          {{ ts(box.title) }}
        </div>
        <div class="box-text">
          {{ ts(box.text) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Why1 from '../../assets/img/why1.svg'
import Why2 from '../../assets/img/why2.svg'
import Why3 from '../../assets/img/why3.svg'
import Why4 from '../../assets/img/why4.svg'
import { ts } from '../../i18n'

const boxes = [
  {
    title: 'why1_title',
    text: 'why1_text',
    icon: Why1,
  },
  {
    title: 'why2_title',
    text: 'why2_text',
    icon: Why2,
  },
  {
    title: 'why3_title',
    text: 'why3_text',
    icon: Why3,
  },
  {
    title: 'why4_title',
    text: 'why4_text',
    icon: Why4,
  },
]
</script>

<style lang="postcss" scoped>
@import '../../css/defines.postcss';

.home-why {
  max-width: 880px;
  margin: 0 auto;
  padding: 140px 20px 0;
  align-items: center;
  position: relative;
}
.why-title {
  @mixin title 32px;
  color: $blue3;
  text-align: center;
}
.why-line {
  height: 3px;
  width: 114px;
  background-color: $border1;
  margin-top: 8px;
}
.home-boxes {
  display: flex;
  flex-wrap: wrap;
  margin-top: 32px;
  width: 100%;
}
.home-box {
  width: 412px;
  height: 310px;
  border: 2px solid rgba(161, 217, 255, 0.25);
  transition: all 0.25s ease;
  border-radius: 8px;
  position: relative;
  overflow: hidden;
  user-select: none;
  align-items: flex-start;
  padding: 0 48px;
  margin-top: 16px;
  .overlay {
    transition: opacity 0.25s ease;
    opacity: 0.6;
    background: linear-gradient(
      234deg,
      rgba(175, 226, 246, 0.2) 0%,
      rgba(26, 170, 226, 0.25) 100%
    );
  }
  img {
    width: 54px;
    height: 54px;
    position: absolute;
    top: 24px;
    opacity: 0.25;
    transition: all 0.25s ease;
    right: -16px;
  }
  &:nth-child(2n) {
    margin-left: 16px;
  }
  &:hover {
    border-color: rgba(161, 217, 255, 0.5);
    img {
      right: 20px;
    }
    .overlay {
      opacity: 1;
    }
  }
}
.box-title {
  @mixin title 18px;
  font-weight: 18px;
  color: $blue3;
  text-align: center;
}
.box-text {
  @mixin text 16px;
  margin-top: 16px;
  line-height: 1.4em;
}
@media (max-width: 1000px) {
  .home-boxes {
    justify-content: center;
  }
  .home-box {
    width: 342px;
    height: 332px;
  }
}
@media (max-width: 800px) {
  .home-box {
    width: 534px;
    height: 230px;
    max-width: 100%;

    &:nth-child(2n) {
      margin-left: 0;
    }
  }
}
@media (max-width: 600px) {
  .home-box {
    height: 360px;
  }
}
</style>
