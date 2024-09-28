<template>
  <div class="services-wrap">
    <ServicesBg />
    <h1 class="services-title">
      <span>{{ ts('services.services') }}</span>
      {{ ts('services.offer') }}
    </h1>
    <div class="services">
      <ServicesRow
        :icon="CampaignIcon"
        :title="ts('services.campaign')"
        :text="ts('services.campaign_text')"
        :image="Campaign"
        :yPos="yPos"
      />
      <ServicesRow
        :icon="AiIcon"
        :title="ts('services.ai')"
        :text="ts('services.ai_text')"
        :image="Ai"
        :reverse="true"
        :yPos="yPos"
      />
      <ServicesRow
        :icon="MarketIcon"
        :title="ts('services.market')"
        :text="ts('services.market_text')"
        :image="Market"
        :yPos="yPos"
      />
      <ServicesRow
        :icon="SecurityIcon"
        :title="ts('services.security')"
        :text="ts('services.security_text')"
        :image="Security"
        :reverse="true"
        :yPos="yPos"
      />
      <ServicesRow
        :icon="CommunityIcon"
        :title="ts('services.community')"
        :text="ts('services.community_text')"
        :image="Community"
        :yPos="yPos"
      />
    </div>
    <HomeStart />
  </div>
</template>

<script lang="ts" setup>
import HomeStart from '../components/home/HomeStart.vue'
import ServicesRow from '../components/services/ServicesRow.vue'
import { ts } from '../i18n'
import Campaign from '../assets/img/campaign.jpg'
import CampaignIcon from '../assets/img/campaign-icon.svg'
import Ai from '../assets/img/ai.jpg'
import AiIcon from '../assets/img/ai-icon.svg'
import Market from '../assets/img/market.jpg'
import MarketIcon from '../assets/img/market-icon.svg'
import Security from '../assets/img/security.jpg'
import SecurityIcon from '../assets/img/security-icon.svg'
import Community from '../assets/img/community.jpg'
import CommunityIcon from '../assets/img/community-icon.svg'
import ServicesBg from '../components/services/ServicesBg.vue'
import { useScroll } from '../util/use-scroll'

const { yPos } = useScroll()
</script>

<style lang="postcss" scoped>
@import '../css/defines.postcss';

.services-wrap {
  padding: 108px 0 120px;
  position: relative;
}

.services-title {
  @mixin title 54px;
  margin: 0 0 48px;
  text-align: center;
  font-weight: 800;
  position: relative;
  span {
    color: $blue3;
  }
}
.services {
  padding-bottom: 120px;
  position: relative;
}
@media (max-width: 600px) {
  .services-title {
    font-size: 48px;
    max-width: 276px;
    margin: 0 auto;
  }
}
</style>
