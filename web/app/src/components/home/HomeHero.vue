<template>
  <div class="home-hero">
    <div class="hero-left">
      <h1 class="title" v-html="ts('future')"></h1>
      <div class="buttons">
        <div class="button1 button2">
          {{ ts('start') }}
        </div>
        <div class="button1 button3">
          {{ ts('browse') }}
        </div>
      </div>
    </div>
    <div class="hero-right">
      <div class="bg-mask overlay">
        <img src="../../assets/img/hero-bg.svg" />
      </div>
      <div class="box-col f-col">
        <HeroBox
          v-for="project in projects"
          :key="project.id"
          :id="project.id"
          :name="project.name"
          :goal="project.goal"
          :image="project.image"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ts } from '../../i18n'
import HeroBox from './HeroBox.vue'
import Box1 from '../../assets/img/box1.jpg'
import Box2 from '../../assets/img/box2.jpg'
import Box3 from '../../assets/img/box3.jpg'
import Box4 from '../../assets/img/box4.jpg'

const projects = [
  {
    id: '3e42e273-546d-4989-a97c-f6eb173e8450',
    name: 'Vintage Player',
    goal: 112,
    image: Box1,
  },
  {
    id: 'fa4d21c2-16a3-46cf-8162-98f4a82b59aa',
    name: 'Hi-Fi Sphere',
    goal: 140,
    image: Box2,
  },
  {
    id: '9e8f0c6f-1edf-4d68-a096-7a2bb4625c98',
    name: 'Repair Shop',
    goal: 125,
    image: Box3,
  },
  {
    id: '00df0e23-22af-4959-874c-aca385b54eed',
    name: 'Community Event',
    goal: 90,
    image: Box4,
  },
]
</script>

<style lang="postcss" scoped>
@import '../../css/defines.postcss';

.home-hero {
  padding: 72px 100px 140px 140px;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  position: relative;
}

.title {
  @mixin title 54px;
  font-weight: 800;
  color: $blue3;
  max-width: 380px;
  display: flex;
  line-height: 1.2em;
  flex-wrap: wrap;
  :deep(span) {
    color: $text1;
    &:first-child {
      margin-right: 8px;
    }
    &:nth-child(2) {
      margin-left: 8px;
    }
  }
}

.buttons {
  display: flex;
}
.button1 {
  font-weight: 900;
  padding: 0 12px;
  height: 40px;
  display: flex;
  align-items: center;
}
.button3 {
  margin-left: 6px;
}
.button2 {
  margin-right: 6px;
}
.hero-right {
  display: flex;
  margin-left: auto;
  position: relative;
  width: 500px;
  justify-content: center;
}
.bg-mask {
  mask: linear-gradient(0deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) 35%) add;
  max-height: 570px;
  max-width: 555px;
  opacity: 0.2;
  width: 485px;
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}
.box-col {
  max-height: 500px;
  width: 424px;
  flex-wrap: wrap;
  padding: 12px 0 0 0;
  align-items: center;
}

@media (max-width: 1100px) {
  .home-hero {
    max-width: 840px;
    padding: 48px 20px 140px 20px;
  }
  .title {
    font-size: 48px;
  }
  .button1 {
    font-size: 12px;
  }
  .hero-left {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
}
@media (max-width: 800px) {
  .home-hero {
    flex-direction: column;
    align-items: center;
  }
  .title {
    justify-content: center;
  }
  .buttons {
    justify-content: center;
  }
  .hero-right {
    margin: 80px 0 0 0;
  }
}

@media (max-width: 600px) {
  .box-col {
    width: 336px;
  }
}
</style>
