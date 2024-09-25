<template>
  <div class="start-wrap">
    <div class="start f-center">
      <div class="start-img-wrap overlay">
        <img class="start-img" src="../../assets/img/join-bottom.jpg" />
      </div>
      <div class="start-content f-center-col">
        <div class="start-title">
          {{ ts('get_started') }}
        </div>
        <div class="start-divider"></div>
        <div class="start-text">
          {{ ts('start_text') }}
        </div>
        <router-link :to="{ name: 'Connect' }">
          <div class="start-join">
            {{ ts('join') }}
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ts } from '../../i18n'
</script>

<style lang="postcss" scoped>
@import '../../css/defines.postcss';

.start-wrap {
  margin-top: 16px;
}

.start {
  max-width: 912px;
  width: 100%;
  height: 425px;
  margin: 0 auto;
  position: relative;
  color: white;
  background: linear-gradient(65deg, rgb(1, 98, 162) 0%, rgb(26, 170, 226) 100%);
  border-radius: 12px;
}
.start-img-wrap {
  border-radius: 12px;
  opacity: 0.03;
}
.start-img {
  border-radius: 12px;
  width: 100%;
  height: 100%;
}
.start-content {
  position: relative;
}
.start-title {
  @mixin title 32px;
}
.start-divider {
  background-color: white;
  width: 114px;
  height: 3px;
  margin: 14px 0 16px;
}
.start-text {
  @mixin text 18px;
  max-width: 624px;
  margin: 0 auto;
  text-align: center;
}
.start-join {
  @mixin title 15px;
  display: flex;
  align-items: center;
  border: 2px solid white;
  transition: all 0.25s ease;
  border-radius: 8px;
  cursor: pointer;
  height: 42px;
  padding: 0 16px;
  margin-top: 40px;
  color: white;
  &:hover {
    color: rgb(214, 245, 255);
    border-color: rgb(214, 245, 255);
  }
}
@media (max-width: 1180px) {
  .start {
    max-width: 732px;
    height: 381px;
  }
  .start-text {
    max-width: 573px;
  }
  .start-join {
    font-size: 13px;
    height: 40px;
  }
}
@media (max-width: 800px) {
  .start-wrap {
    margin-top: 64px;
  }
  .start {
    max-width: 550px;
  }
  .start-title {
    max-width: 290px;
    text-align: center;
  }
  .start-text {
    max-width: 416px;
    text-align: center;
  }
}
@media (max-width: 600px) {
  .start {
    max-width: 360px;
    height: 500px;
  }
  .start-title {
    max-width: 265px;
  }
  .start-text {
    max-width: 240px;
  }
}
</style>
