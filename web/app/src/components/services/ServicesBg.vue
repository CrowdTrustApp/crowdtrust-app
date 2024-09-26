<template>
  <div class="services-bg">
    <div class="services-bg1">
      <img src="../../assets/img/services-bg1.jpg" />
    </div>
  </div>
</template>

<style lang="postcss" scoped>
img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  pointer-events: none;
  user-select: none;
}
.services-bg {
  position: relative;
  height: 600px;
  left: 0;
  mask: linear-gradient(180deg, #000000 0%, rgba(0, 0, 0, 0) 100%) add;
  opacity: 0.1;
  overflow: hidden;
  position: absolute;
  right: 0;
  top: -125px;
  z-index: 0;
}
.services-bg1 {
  position: absolute;
  border-radius: inherit;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
</style>
