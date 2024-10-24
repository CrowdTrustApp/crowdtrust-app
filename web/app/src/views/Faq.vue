<template>
  <div class="faq-wrap">
    <FaqBg />
    <h1 class="faq-title">Frequently Asked <span>Questions</span></h1>
    <div class="faq-subtitle">
      Your guide to frequently asked questions about how the
      <span>CrowdTrust</span> platform works and how you can get started.
    </div>
    <div class="faq-label">What is CrowdTrust</div>
    <div class="label-text">
      CrowdTrust is an AI-powered, blockchain-based crowdfunding platform that provides a
      secure and transparent environment for both creators and backers. By integrating
      blockchain and artificial intelligence, CrowdTrust enhances the trust and success of
      campaigns through smart contracts and real-time insights.
    </div>
    <div class="faq-section">
      <FaqItem :question="ts('faq.what1')" :answer="ts('faq.what1_a')" />
      <FaqItem :question="ts('faq.what2')" :answer="ts('faq.what2_a')" />
      <FaqItem :question="ts('faq.what3')" :answer="ts('faq.what3_a')" />
      <FaqItem :question="ts('faq.what4')" :answer="ts('faq.what4_a')" />
    </div>
    <div class="section-border"></div>
    <div class="faq-label">How does CrowdTrust work, and what can I use it for?</div>
    <div class="label-text">
      The TrustGuard system ensures that backer funds are held in escrow and only released
      when specific project milestones are met. This adds a layer of security for backers,
      ensuring that funds are used responsibly and only when the project progresses as
      promised.
    </div>
    <div class="faq-section">
      <FaqItem :question="ts('faq.how1')" :answer="ts('faq.how1_a')" />
      <FaqItem :question="ts('faq.how2')" :answer="ts('faq.how2_a')" />
      <FaqItem :question="ts('faq.how3')" :answer="ts('faq.how3_a')" />
      <FaqItem :question="ts('faq.how4')" :answer="ts('faq.how4_a')" />
      <FaqItem :question="ts('faq.how5')" :answer="ts('faq.how5_a')" />
      <FaqItem :question="ts('faq.how6')" :answer="ts('faq.how6_a')" />
    </div>
    <div class="section-border"></div>
    <HomeStart />
  </div>
</template>

<script lang="ts" setup>
import FaqBg from '../components/faq/FaqBg.vue'
import FaqItem from '../components/faq/FaqItem.vue'
import HomeStart from '../components/home/HomeStart.vue'
import { ts } from '../i18n'
</script>

<style lang="postcss" scoped>
@import '../css/defines.postcss';

.faq-wrap {
  position: relative;
  padding: 0 0 120px;
}

.faq-title {
  @mixin title 54px;
  margin: 72px auto 0;
  text-align: center;
  font-weight: 800;
  position: relative;
  span {
    color: $blue3;
  }
}

.faq-subtitle {
  @mixin text 24px;
  color: $text2;
  max-width: 793px;
  margin: 12px auto 40px;
  text-align: center;
  position: relative;
}
.faq-label {
  @mixin title 24px;
  margin: 48px auto 0;
  color: $blue3;
  text-align: center;
  position: relative;
}
.label-text {
  @mixin text 16px;
  color: $text2;
  max-width: 864px;
  margin: 10px auto 32px;
  text-align: center;
  position: relative;
}
.faq-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 80%;
  position: relative;
  margin: 0 auto;
}
.section-border {
  width: 75%;
  max-width: 900px;
  margin: 56px auto 64px;
  height: 1px;
  background-color: #3b3b3b;
  position: relative;
}
@media (max-width: 1000px) {
  .faq-title {
    max-width: 500px;
    font-size: 48px;
    padding: 0 24px;
  }
  .faq-subtitle {
    max-width: 75%;
    width: 100%;
  }
  .faq-label {
    max-width: 75%;
    width: 100%;
  }
  .label-text {
    max-width: 75%;
    width: 100%;
  }
}
@media (max-width: 600px) {
  .faq-subtitle {
    max-width: 90%;
  }
  .faq-label {
    max-width: 90%;
  }
  .label-text {
    max-width: 90%;
  }
}
</style>
