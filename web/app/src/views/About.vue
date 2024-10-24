<template>
  <div class="about-wrap">
    <div class="about-bg">
      <img src="../assets/img/about-bg.jpg" class="about-bg-img" />
    </div>
    <h1 class="about-title"><span>About </span>Us</h1>
    <div class="about-image">
      <img src="../assets/img/about-hero.jpg" />
    </div>
    <div class="about-content">
      <h2 class="about-label">About CrowdTrust</h2>
      <p>
        CrowdTrust is not just another crowdfunding platform; it's a movement built on the
        foundations of trust, transparency, and innovation. We are driven by a mission to
        empower creators and backers from all corners of the globe, providing them with a
        secure and efficient platform to transform dreams into reality. We envision a
        global community where ideas can spark, connect, and ignite, fueled by readily
        available financial support.
      </p>
      <p>
        At CrowdTrust, we recognize that trust is the bedrock of successful crowdfunding.
        That's why we've pioneered TrustGuard, a unique system that safeguards backer
        funds, ensuring every penny is utilized responsibly and as promised. This
        unwavering commitment to security, combined with our cutting-edge AI-driven tools
        and extensive global reach, distinguishes us in the crowded crowdfunding
        landscape.
      </p>
      <p>
        Our team is a dynamic blend of seasoned professionals with deep expertise in
        technology, finance, and crowdfunding. We are united by a shared passion for
        democratizing funding and empowering individuals to break barriers and achieve
        their goals. Whether you're an entrepreneur with a groundbreaking invention, an
        artist with a vision, or an innovator seeking to change the world, CrowdTrust is
        your steadfast partner on this exciting journey.
      </p>
      <p>
        But we're more than just a platform; we're a vibrant community. When you join
        CrowdTrust, you become part of a network of like-minded individuals who believe in
        the power of collective support. You gain access to a wealth of resources, expert
        guidance, and a global stage to showcase your ideas.
      </p>
      <p class="bold">
        Join us today and be part of a community that's not just talking about the future
        of crowdfunding, but actively shaping it.
      </p>
    </div>
    <HomeStart />
  </div>
</template>

<script lang="ts" setup>
import HomeStart from '../components/home/HomeStart.vue'
</script>

<style lang="postcss" scoped>
@import '../css/defines.postcss';

.about-wrap {
  padding: 0 0 120px;
  position: relative;
  text-align: center;
}

.about-bg-img {
  position: relative;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  object-fit: cover;
  pointer-events: none;
  user-select: none;
}
.about-bg {
  height: 600px;
  left: 0;
  mask: linear-gradient(180deg, #000000 0%, rgba(0, 0, 0, 0) 100%) add;
  opacity: 0.1;
  overflow: hidden;
  position: absolute;
  right: 0;
  top: -213px;
  z-index: 0;
}

.about-title {
  @mixin title 54px;
  margin: 88px 0 72px;
  text-align: center;
  font-weight: 800;
  position: relative;
  span {
    color: $blue3;
  }
}
.about-image {
  width: 100%;
  max-width: 900px;
  height: 460px;
  margin: 0 auto;
  padding: 0 40px;
  img {
    width: 100%;
    height: 100%;
    border-radius: 12px;
    object-fit: cover;
  }
}
.about-content {
  margin: 0 auto;
  text-align: left;
  width: 100%;
  max-width: 1020px;
  padding: 40px 40px 80px;
  p {
    @mixin text 16px;
    color: $text2;
    line-height: 1.5em;
    &.bold {
      font-weight: 700;
    }
  }
}
.about-label {
  @mixin title 24px;
  font-weight: 800;
  color: $blue3;
}
@media (max-width: 1000px) {
  .about-image {
    height: 350px;
  }
}

@media (max-width: 600px) {
  .about-content {
    text-align: center;
  }
}
</style>
