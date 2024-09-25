<template>
  <div class="home-welcome f-center">
    <div class="welcome">
      <div class="welcome-left">
        <div class="welcome-title">
          {{ ts('welcome_title') }}
        </div>
        <div class="welcome-text">
          {{ ts('welcome_text') }}
        </div>
      </div>
      <div class="welcome-right">
        <img src="../../assets/img/welcome.png" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ts } from '../../i18n'
</script>

<style lang="postcss" scoped>
@import '../../css/defines.postcss';

.home-welcome {
  width: 100%;
  height: 360px;
  backdrop-filter: blur(50px);
  background: linear-gradient(
    290deg,
    rgba(26, 170, 226, 0.35) 0%,
    rgba(174, 225, 245, 0.15) 100%
  );
}
.welcome {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 960px;
  width: 100%;
  height: 100%;
  padding: 0 20px;
  margin: 0 auto;
  position: relative;
}
.welcome-left {
  max-width: 460px;
}

.welcome-title {
  @mixin title 24px;
  color: $blue3;
}

.welcome-text {
  @mixin text 18px;
  color: $text2;
  margin-top: 20px;
  line-height: 1.4em;
}
.welcome-right {
  width: 340px;
  position: relative;
  height: 100%;
  img {
    position: absolute;
    width: 100%;
    top: -20px;
    transition: all 0.25s ease;
    right: 0;
    &:hover {
      right: -4px;
      top: -24px;
    }
  }
}
@media (max-width: 1000px) {
  .home-welcome {
    height: 420px;
  }
  .welcome {
    max-width: 700px;
  }
  .welcome-left {
    max-width: 320px;
  }
  .welcome-right {
    img {
      width: 300px;
      top: 24px;
      &:hover {
        top: 20px;
      }
    }
  }
}
@media (max-width: 800px) {
  .home-welcome {
    height: 760px;
    padding-top: 40px;
  }
  .welcome {
    flex-direction: column;
  }
  .welcome-right {
    width: 260px;
    margin-top: 16px;
    img {
      width: 260px;
    }
  }
  .welcome-title {
    text-align: center;
  }
  .welcome-text {
    text-align: center;
  }
}
@media (max-width: 800px) {
  .home-welcome {
    height: 710px;
  }
  .welcome-right {
    width: 220px;
    img {
      width: 220px;
    }
  }
}
</style>
