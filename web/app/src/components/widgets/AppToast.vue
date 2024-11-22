<template>
  <Teleport to="body">
    <div class="ct-toast wrap">
      <TransitionGroup name="toast">
        <div
          v-for="(toast, index) in toasts"
          :key="index"
          class="toast"
          :class="toast.type"
        >
          <div class="left">
            {{ toast.text }}
          </div>
          <div class="right" @click="removeToast(index)">
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              xmlns="http://www.w3.org/2000/svg"
            >
              <line x1="1" y1="11" x2="11" y2="1" stroke="black" stroke-width="2" />
              <line x1="1" y1="1" x2="11" y2="11" stroke="black" stroke-width="2" />
            </svg>
          </div>
        </div>
      </TransitionGroup>
    </div>
    <div class="ct-hud wrap">
      <TransitionGroup name="hud">
        <div v-for="hud in huds" :key="hud.id" class="hud">
          {{ hud.text }}
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script lang="ts" setup>
import { useToast } from '../../util-app/use-toast'

const { toasts, huds, removeToast } = useToast()
</script>

<style lang="postcss" scoped>
@import '../../css/defines.postcss';

.wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  top: 0;
  width: 100%;
}

.ct-hud {
  justify-content: center;
  height: 100%;
  position: fixed;
  pointer-events: none;
}
.hud {
  @mixin text 20px;
  position: absolute;
  padding: 24px;
  border-radius: 8px;
  color: white;
  background-color: rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(12px);
  z-index: 4999;
}

.hud-leave-active {
  transition: opacity 0.25s ease;
  opacity: 1;
}
.hud-leave-to {
  opacity: 0;
}

.ct-toast {
  margin-top: 60px;
  position: fixed;
  z-index: 4999;
}
.left {
  @mixin title 15px;
  font-weight: 500;
  color: $text3;
}
.toast {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  min-width: 240px;
  min-height: 58px;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.25);
  border-radius: 29px;
  margin-top: 16px;
  z-index: 4999;
  background-color: white;
  &.error {
    .left {
      color: $color-error;
    }
  }
}
.right {
  margin-left: 6px;
  padding: 6px;
  cursor: pointer;
  svg {
    width: 12px;
    height: 12px;
  }
}

.toast-move,
.toast-enter-active,
.toast-leave-active {
  transition: all 0.5s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.toast-leave-active {
  position: absolute;
}
</style>
