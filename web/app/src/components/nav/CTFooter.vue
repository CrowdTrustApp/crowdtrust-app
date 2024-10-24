<template>
  <footer>
    <div class="footer-wrap">
      <div class="footer-content">
        <div class="footer-left">
          <router-link :to="{ name: 'Home' }">
            <Logo :secondary="true" class="footer-logo" />
          </router-link>
          <div class="copyright">
            {{ ts('footer.copyright') }}
          </div>
          <div class="socials">
            <a href="https://x.com/realcrowdtrust" target="_blank">
              <div class="social"><Twitter /></div>
            </a>
            <a href="https://t.me/realcrowdtrust" target="_blank">
              <div class="social"><Telegram /></div>
            </a>
            <a href="https://medium.com/@crowdtrust" target="_blank">
              <div class="social"><Medium /></div>
            </a>
          </div>
        </div>
        <div class="footer-cols">
          <div class="footer-col">
            <div class="label">{{ ts('footer.resources') }}</div>
            <a href="http://bit.ly/3ZW1YY3" class="link" target="_blank">
              {{ ts('footer.whitepaper') }}
            </a>
            <router-link
              :to="{ name: 'About' }"
              class="link"
              :class="{ active: route.name === 'About' }"
            >
              {{ ts('footer.about') }}
            </router-link>
            <router-link
              :to="{ name: 'Faq' }"
              class="link"
              :class="{ active: route.name === 'Faq' }"
            >
              {{ ts('footer.faq') }}
            </router-link>
          </div>
          <div class="footer-col">
            <div class="label">{{ ts('footer.links') }}</div>
            <router-link
              :to="{ name: 'Back' }"
              class="link"
              :class="{ active: route.name === 'Back' }"
            >
              {{ ts('back.title') }}
            </router-link>
            <router-link
              :to="{ name: 'Services' }"
              class="link"
              :class="{ active: route.name === 'Services' }"
            >
              {{ ts('services.title') }}
            </router-link>
            <router-link
              :to="{ name: 'How' }"
              class="link"
              :class="{ active: route.name === 'How' }"
            >
              {{ ts('how.title') }}
            </router-link>
          </div>
          <div class="footer-col">
            <div class="label empty-label">&nbsp;</div>
            <router-link
              :to="{ name: 'Projects' }"
              class="link"
              :class="{ active: route.name === 'Projects' }"
            >
              {{ ts('footer.browse') }}
            </router-link>
            <router-link
              :to="{ name: 'Create' }"
              class="link"
              :class="{ active: route.name === 'Create' }"
            >
              {{ ts('footer.launch') }}
            </router-link>
            <router-link
              :to="{ name: 'Connect' }"
              class="link"
              :class="{ active: route.name === 'Connect' }"
            >
              {{ ts('connect.join') }}
            </router-link>
          </div>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <router-link
        :to="{ name: 'Trust' }"
        class="bottom-link"
        :class="{ active: route.name === 'Trust' }"
      >
        {{ ts('footer.trust') }}
      </router-link>
      <div class="bottom-divider"></div>
      <router-link
        :to="{ name: 'Terms' }"
        class="bottom-link"
        :class="{ active: route.name === 'Terms' }"
      >
        {{ ts('footer.terms') }}
      </router-link>
      <div class="bottom-divider"></div>
      <router-link
        :to="{ name: 'Privacy' }"
        class="bottom-link"
        :class="{ active: route.name === 'Privacy' }"
      >
        {{ ts('footer.privacy') }}
      </router-link>
      <div class="bottom-divider"></div>
      <router-link
        :to="{ name: 'Cookies' }"
        class="bottom-link"
        :class="{ active: route.name === 'Cookies' }"
      >
        {{ ts('footer.cookie') }}
      </router-link>
    </div>
  </footer>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router'
import { ts } from '../../i18n'
import Logo from '../svg/Logo.vue'
import Medium from '../svg/Medium.vue'
import Telegram from '../svg/Telegram.vue'
import Twitter from '../svg/Twitter.vue'

const route = useRoute()
</script>

<style lang="postcss" scoped>
@import '../../css/defines.postcss';

.footer {
  position: relative;
}
.footer-bottom {
  display: flex;
  padding: 16px 0 16px;
  justify-content: center;
  align-items: center;
  position: relative;
  height: 48px;
  background-color: white;
}
.bottom-divider {
  height: 100%;
  width: 1px;
  background-color: $border1;
  margin: 0 20px;
}
.bottom-link {
  @mixin text 12px;
  letter-spacing: 1.2px;
  color: rgb(156, 156, 156);
  &:hover {
    color: rgb(110, 110, 110);
  }
}
a.active {
  color: $blue2;
}
.footer-wrap {
  border-top: 2px solid rgb(240, 240, 240);
  position: relative;
  background-color: rgb(250, 250, 250);
}
.footer-content {
  display: flex;
  padding: 32px 40px 40px;
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
}
.footer-logo {
  width: 240px;
}
.copyright {
  @mixin text 13px;
  letter-spacing: 0.03em;
  color: $text3;
  margin-top: 8px;
}
.footer-cols {
  display: flex;
  margin-left: auto;
}
.footer-col {
  display: flex;
  flex-direction: column;
  max-height: 80px;
  margin-left: 64px;
}
.label {
  @mixin title 15px;
  font-weight: 800;
  color: $blue3;
  letter-spacing: 0.03em;
}
.link {
  @mixin text 15px;
  margin-top: 12px;
  color: $text3;
}
.socials {
  display: flex;
  margin-top: 12px;
}
.social {
  width: 28px;
  height: 28px;
  padding: 4px;
  cursor: pointer;
  margin-right: 8px;
  :deep(svg) {
    fill: rgb(196, 196, 196);
    transition: fill 0.25s ease;
    width: 24px;
    height: 24px;
  }
  &:hover {
    :deep(svg) {
      fill: rgb(26, 170, 226);
    }
  }
}
@media (max-width: 900px) {
  .footer-col {
    margin-left: 40px;
  }
}
@media (max-width: 800px) {
  .footer-content {
    flex-direction: column-reverse;
    align-items: center;
  }
  .footer-cols {
    margin-left: 0;
  }
  .footer-col {
    max-height: unset;
    &:first-child {
      margin-left: 0;
    }
  }
  .footer-left {
    margin-top: 40px;
  }
}
@media (max-width: 600px) {
  .footer-cols {
    flex-direction: column;
  }
  .footer-col {
    margin-left: 0;
    margin-top: 24px;
    text-align: center;
    &:last-child {
      margin-top: 0;
    }
  }
  .empty-label {
    display: none;
  }
  .footer-left {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .bottom-link {
    text-align: center;
  }
  .bottom-divider {
    margin: 0 10px;
  }
}
</style>
