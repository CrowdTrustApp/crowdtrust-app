<template>
  <div class="home-bg-wrap overlay">
    <div class="home-bg">
      <div class="home-bg1">
        <svg viewBox="0 0 703 703">
          <g>
            <defs>
              <radialGradient
                id="hwg1"
                cy="0.5"
                cx="0.5"
                r="0.5"
                gradientTransform="translate(0.5, 0.5) scale(1 1) translate(-0.5, -0.5)"
              >
                <stop offset="0" stop-color="rgb(26, 170, 226)" stop-opacity="1" />
                <stop offset="1" stop-color="rgba(27, 170, 227, 0)" stop-opacity="0" />
              </radialGradient>
            </defs>
            <path
              d="M 351.5 0 C 545.628 0 703 157.372 703 351.5 C 703 545.628 545.628 703 351.5 703 C 157.372 703 0 545.628 0 351.5 C 0 157.372 157.372 0 351.5 0 Z"
              fill="url(#hwg1)"
            />
          </g>
        </svg>
      </div>
      <div class="home-bg2">
        <svg viewBox="0 0 1015 1015">
          <g>
            <defs>
              <radialGradient
                id="bg2-rg1"
                cy="0.5"
                cx="0.5"
                r="0.5"
                gradientTransform="translate(0.5, 0.5) scale(1 1) translate(-0.5, -0.5)"
              >
                <stop offset="0" stop-color="rgb(26, 170, 226)" stop-opacity="1" />
                <stop offset="1" stop-color="rgba(27, 170, 227, 0)" stop-opacity="0" />
              </radialGradient>
            </defs>
            <path
              d="M 507.5 0 C 787.785 0 1015 227.215 1015 507.5 C 1015 787.785 787.785 1015 507.5 1015 C 227.215 1015 0 787.785 0 507.5 C 0 227.215 227.215 0 507.5 0 Z"
              fill="url(#bg2-rg1)"
            />
          </g>
        </svg>
      </div>
      <div class="home-bg3">
        <svg viewBox="0 0 1015 1015">
          <g>
            <defs>
              <radialGradient
                id="bg3-rg1"
                cy="0.5"
                cx="0.5"
                r="0.5"
                gradientTransform="translate(0.5, 0.5) scale(1 1) translate(-0.5, -0.5)"
              >
                <stop offset="0" stop-color="rgb(1, 98, 162)" stop-opacity="1" />
                <stop offset="1" stop-color="rgba(1, 98, 162, 0)" stop-opacity="0" />
              </radialGradient>
            </defs>
            <path
              d="M 507.5 0 C 787.785 0 1015 227.215 1015 507.5 C 1015 787.785 787.785 1015 507.5 1015 C 227.215 1015 0 787.785 0 507.5 C 0 227.215 227.215 0 507.5 0 Z"
              fill="url(#bg3-rg1)"
            />
          </g>
        </svg>
      </div>
      <div class="home-bg4">
        <svg viewBox="0 0 1015 1015">
          <g>
            <defs>
              <radialGradient
                id="bg4-rg1"
                cy="0.5"
                cx="0.5"
                r="0.5"
                gradientTransform="translate(0.5, 0.5) scale(1 1) translate(-0.5, -0.5)"
              >
                <stop offset="0" stop-color="rgb(26, 170, 226)" stop-opacity="1" />
                <stop offset="1" stop-color="rgba(27, 170, 227, 0)" stop-opacity="0" />
              </radialGradient>
            </defs>
            <path
              d="M 507.5 0 C 787.785 0 1015 227.215 1015 507.5 C 1015 787.785 787.785 1015 507.5 1015 C 227.215 1015 0 787.785 0 507.5 C 0 227.215 227.215 0 507.5 0 Z"
              fill="url(#bg4-rg1)"
            />
          </g>
        </svg>
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.home-bg-wrap {
  z-index: 0;
}
.home-bg {
  width: 1200px;
  margin: 0 auto;
  position: relative;
  top: 0;
  height: 100%;
}
svg {
  width: 100%;
  height: 100%;
}

.home-bg1 {
  position: absolute;
  right: -179px;
  top: -60px;
  height: 703px;
  width: 703px;
  z-index: 0;
  opacity: 0.15;
}
.home-bg2 {
  position: absolute;
  width: 1015px;
  height: 1015px;
  z-index: 0;
  opacity: 0.15;
  left: calc(27.41666666666669% - 1015px / 2);
  top: calc(19.16058394160586% - 1015px / 2);
}
.home-bg3 {
  position: absolute;
  width: 1015px;
  height: 1015px;
  z-index: 0;
  opacity: 0.15;
  right: -263px;
  top: 1181px;
}
.home-bg4 {
  position: absolute;
  width: 1015px;
  height: 1015px;
  z-index: 0;
  opacity: 0.15;
  left: calc(27.41666666666669% - 1015px / 2);
  top: calc(59.95828988529721% - 1015px / 2);
}
</style>
