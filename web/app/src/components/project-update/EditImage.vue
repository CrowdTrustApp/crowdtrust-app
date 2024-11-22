<template>
  <div class="edit-image" :class="{ dragging: dragging || asset.loading }">
    <div v-if="asset.loading" class="image-loading f-center">
      <Spinner :size="16" color="rgb(1, 98, 162)" />
    </div>
    <CTAsset v-else :asset="assetUrl" :contentHash="asset.size" class="image" />
    <Minus class="delete" @click="emit('delete')" />
  </div>
</template>

<script lang="ts">
import { IProjectAssetViewModelRelation } from '@app/types'
import Spinner from '../widgets/Spinner.vue'
import Minus from '../svg/Minus.vue'

export interface IEditAsset extends IProjectAssetViewModelRelation {
  loading?: boolean
}
</script>

<script lang="ts" setup>
import { computed } from 'vue'
import { urlFromAsset } from '@app/util'
import CTAsset from '../widgets/CTAsset.vue'

const { asset } = defineProps<{
  asset: IEditAsset
  dragging: boolean
}>()

const emit = defineEmits<{
  (e: 'delete'): void
}>()

const assetUrl = computed(() => {
  return urlFromAsset(asset)
})
</script>

<style lang="postcss" scoped>
@import '../../css/defines.postcss';

.delete {
  opacity: 0;
  position: absolute;
  right: 0px;
  top: 0px;
}
.edit-image {
  height: 100%;
  width: 200px;
  flex-shrink: 0;
  background-color: $bg-light2;
  cursor: pointer;
  position: relative;
  &:hover {
    .delete {
      opacity: 1;
    }
  }
  &.dragging {
    .delete {
      opacity: 0;
    }
  }
}
.image-loading {
  width: 100%;
  height: 100%;
}
</style>
