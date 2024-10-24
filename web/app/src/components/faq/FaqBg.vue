<template>
  <div class="faq-bg">
    <img src="../../assets/img/faq-bg.jpg" />
  </div>
</template>

<style lang="postcss" scoped>
img {
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  pointer-events: none;
  user-select: none;
}
.faq-bg {
  height: 600px;
  left: 0;
  mask: linear-gradient(180deg, #000000 0%, rgba(0, 0, 0, 0) 100%) add;
  opacity: 0.15;
  overflow: hidden;
  position: absolute;
  right: 0;
  top: -197px;
  z-index: 0;
}
</style>
