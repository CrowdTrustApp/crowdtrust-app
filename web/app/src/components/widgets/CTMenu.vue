<template>
  <div :class="{ hide: !showMenu }" class="ct-menu">
    <div
      ref="toggleRef"
      class="ct-menu-toggle"
      :data-toggle-id="toggleId"
      @click="toggleMenu"
    >
      <slot name="toggle">
        <span class="ct-menu-toggle-text">
          {{ label }}
        </span>
        <span class="ct-menu-toggle-caret" :class="{ opened }" />
      </slot>
    </div>
    <DropdownMenuItems
      :ref="setMenuRef"
      :items="items"
      :opened="opened"
      :style="menuStyle"
      :extraHeight="extraHeight"
      @closeMenu="closeMenu"
    >
      <template #before>
        <slot name="before"></slot>
      </template>
    </DropdownMenuItems>
  </div>
</template>

<script lang="ts" setup>
import { computed, toRefs } from 'vue'
import DropdownMenuItems from './DropdownMenuItems.vue'
import { IDropdownMenuItem, Keys } from '@app/types'
import { useClickaway, useDropdown, useKeyListener } from '@app/util-app'
import { randChars } from '@app/util'

const props = withDefaults(
  defineProps<{
    label?: string
    items?: IDropdownMenuItem[]
    clickawaySelector?: string
    hideWhenNoItems?: boolean
    // Extra height used by slots is needed for the height animation to work correctly
    extraHeight?: number
  }>(),
  {
    label: undefined,
    items: () => [],
    clickawaySelector: '.ct-menu',
    hideWhenNoItems: false,
    extraHeight: 0,
  },
)
const { items, clickawaySelector, hideWhenNoItems } = toRefs(props)

const { setMenuRef, toggleRef, opened, menuStyle, setMenuOpened, toggleMenu } =
  useDropdown({
    clickawayIgnoreSelector: clickawaySelector.value,
    offset: { mainAxis: 4, crossAxis: -8 },
  })

const closeMenu = () => setMenuOpened(false)

// toggleId prevents the menu from being opened and closed immediately when toggled
const toggleId = randChars(8)
useClickaway(`div[data-toggle-id="${toggleId}"]`, closeMenu)
useKeyListener(Keys.Escape, closeMenu)

const showMenu = computed(() => {
  if (items.value.length) {
    return true
  }
  return !hideWhenNoItems.value
})
</script>

<style lang="postcss" scoped>
@import '../../css/defines.postcss';

.ct-menu {
  position: relative;
  color: black;
  &.hide {
    display: none;
  }
}
.ct-menu-toggle {
  display: flex;
  flex-direction: row;
  padding-right: 8px;
  align-items: center;
  cursor: pointer;
  border-radius: 4px;
}
.ct-menu-toggle-text {
  @mixin text 16px;
  @mixin truncate;
  display: inline-block;
  margin-right: 16px;
}
.ct-menu-toggle-caret {
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-top: 8px solid $border1;
  transform: rotate(0deg);
  transition: transform 0.25s;
  &.opened {
    transform: rotate(180deg);
  }
}
</style>
