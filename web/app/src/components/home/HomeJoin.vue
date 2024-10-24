<script setup lang="ts">
import { store } from '@app/store'
import { ts } from '../../i18n'
</script>

<template>
  <div class="home-join-wrap">
    <div class="join-bg-wrap">
      <div class="join-bg">
        <div class="join-bg-overlay overlay"></div>
      </div>
    </div>
    <div class="join-top f-col">
      <div class="join-title">
        {{ ts('join_title') }}
      </div>
      <div class="join-divider"></div>
      <div class="join-text">
        {{ ts('join_text') }}
      </div>
      <div class="join-boxes">
        <router-link :to="{ name: 'Projects' }">
          <div class="join-box box-big">
            <img class="box-img overlay" src="../../assets/img/join-box1.jpg" />
            <div class="box1-overlay box-big-overlay"></div>
            <div class="join-box-label">{{ ts('explore') }}</div>
            <div class="join-box-link">
              {{ ts('browse2') }}
            </div>
          </div>
        </router-link>
        <router-link :to="{ name: store.auth.loggedIn.value ? 'Create' : 'Connect' }">
          <div class="join-box box-big">
            <img class="box-img overlay" src="../../assets/img/join-box2.jpg" />
            <div class="box2-overlay box-big-overlay"></div>
            <div class="join-box-label">{{ ts('launch') }}</div>
            <div class="join-box-link">
              {{ ts('start2') }}
            </div>
          </div>
        </router-link>
        <div class="small-boxes f-col">
          <router-link :to="{ name: 'About' }">
            <div class="join-box box-small f-center-col">
              <img class="box-img overlay" src="../../assets/img/join-box3.jpg" />
              <div class="box3-overlay box-small-overlay"></div>
              <div class="join-box-label">{{ ts('learn') }}</div>
              <div class="join-box-link">
                {{ ts('about') }}
              </div>
            </div>
          </router-link>
          <router-link :to="{ name: 'Faq' }">
            <div class="join-box box-small f-center-col">
              <img class="box-img overlay" src="../../assets/img/join-box4.jpg" />
              <div class="box4-overlay box-small-overlay"></div>
              <div class="box-text">
                <div class="join-box-label">{{ ts('learn') }}</div>
                <div class="join-box-link">
                  {{ ts('faq.link') }}
                </div>
              </div>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="postcss" setup>
@import '../../css/defines.postcss';

.home-join-wrap {
  padding: 0 20px 0 20px;
  position: relative;
  margin-top: 140px;
}
.join-bg-wrap {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
}
.join-bg {
  border-radius: 12px;
  background-image: url(../../assets/img/join-bg.jpg);
  background-size: cover;
  width: 1100px;
  margin: 0 auto;
  height: 520px;
  position: relative;
}
.join-bg-overlay {
  border-radius: 12px;
  mix-blend-mode: multiply;
  background-color: #595959;
}
.join-top {
  align-items: center;
  position: relative;
  padding-top: 96px;
}
.join-title {
  @mixin title 32px;
  color: $blue2;
}
.join-divider {
  background-color: rgb(112, 112, 112);
  width: 114px;
  height: 3px;
  margin-top: 10px;
}
.join-text {
  @mixin text 18px;
  color: white;
  margin: 16px auto 0;
  max-width: 740px;
  width: 100%;
  text-align: center;
  line-height: 1.4em;
}
.join-boxes {
  display: flex;
  margin-top: 80px;
  justify-content: space-between;
  width: 100%;
  max-width: 912px;
}
.join-box {
  border-radius: 12px;
  box-shadow: rgba(125, 125, 125, 0.25) 2px 2px 16px -2px;
}
.box-big-overlay {
  bottom: 0;
  height: 150px;
  left: 0;
  position: absolute;
  right: 0;
  transition: height 0.25s ease;
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
}
.box-small-overlay {
  bottom: 0;
  left: 0;
  right: 0;
  top: 0;
  position: absolute;
  transition: top 0.25s ease;
  border-radius: 12px;
}
.box-big {
  width: 300px;
  height: 300px;
  position: relative;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 0 32px 32px;
  &:hover {
    .box-big-overlay {
      height: 220px;
    }
  }
}
.small-boxes {
  justify-content: space-between;
}
.box-text {
  position: relative;
  left: 0;
  transition: left 0.25s ease;
}
.box-small {
  width: 280px;
  height: 142px;
  position: relative;
  align-items: flex-start;
  padding: 0 32px;
  overflow: hidden;
  &:hover {
    .box-small-overlay {
      top: -98px;
    }
    .box-text {
      left: 4px;
    }
  }
}
.box1-overlay {
  background: linear-gradient(180deg, rgba(26, 170, 226, 0) 0%, rgb(26, 170, 226) 100%);
  opacity: 0.8;
  transform: none;
  transform-origin: 50% 50% 0px;
}
.box2-overlay {
  background: linear-gradient(180deg, rgba(1, 98, 162, 0) 0%, rgb(1, 98, 162) 100%);
  transform: none;
  transform-origin: 50% 50% 0px;
}
.box3-overlay {
  background: linear-gradient(180deg, rgba(1, 162, 146, 0.5) 0%, rgb(1, 162, 146) 100%);
  inset: -8px 0 0;
  transform: none;
  transform-origin: 50% 50% 0px;
}
.box4-overlay {
  background: linear-gradient(180deg, rgba(1, 17, 162, 0.5) 0%, rgb(1, 17, 162) 100%);
  inset: -8px 0 0;
  transform: none;
  transform-origin: 50% 50% 0px;
}
.box-img {
  border-radius: 12px;
}
.join-box-label {
  @mixin title 14px;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: rgba(255, 255, 255, 0.75);
  position: relative;
}
.join-box-link {
  @mixin title 20px;
  margin-top: 4px;
  position: relative;
  color: white;
}

@media (max-width: 1180px) {
  .join-bg {
    width: 782px;
  }
  .join-text {
    max-width: 565px;
  }
  .box-big {
    width: 240px;
    height: 240px;
    padding: 0 28px 32px;
  }
  .box-small {
    width: 220px;
    height: 112px;
  }
  .join-boxes {
    max-width: 732px;
  }
  .join-box-link {
    font-size: 18px;
  }
  .join-divider {
    margin-top: 16px;
  }
}
@media (max-width: 800px) {
  .join-bg {
    max-width: 550px;
  }
  .join-title {
    max-width: 364px;
    text-align: center;
  }
  .join-text {
    max-width: 379px;
  }
  .join-boxes {
    max-width: 496px;
    flex-wrap: wrap;
  }
  .small-boxes {
    flex-direction: row;
    width: 100%;
    margin-top: 16px;
    justify-content: space-between;
  }
  .box-small {
    width: 240px;
  }
}
@media (max-width: 800px) {
  .join-bg {
    max-width: 330px;
  }
  .join-title {
    max-width: 190px;
  }
  .join-text {
    max-width: 260px;
  }
  .join-boxes {
    max-width: 240px;
    margin-top: 24px;
  }
  .small-boxes {
    margin-top: 0;
    flex-direction: column;
  }
  .box-big,
  .box-small {
    margin-top: 16px;
  }
  .box-big {
    height: 120px;
  }
}
</style>
