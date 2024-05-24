<script setup>
import SvgIcon from '@jamescoyle/vue-icon'
import { mdiChessPawn } from '@mdi/js'
import { useRouter } from 'vue-router'

const router = useRouter()
const goToGame = () => {
  router.push({ name: 'game' })
}
</script>

<template>
  <main>
    <BContainer
      fluid
      class="d-flex flex-column justify-content-center align-items-center flex-grow-1"
    >
      <BRow class="col-12">
        <BCol class="d-flex justify-content-center align-items-center">
          <div class="image-container" style="color: green">
            <svg-icon class="svg-image" type="mdi" :path="mdiChessPawn"></svg-icon>
          </div>
        </BCol>
      </BRow>
      <BRow class="col-12">
        <div class="button-container">
          <b-button variant="success" @click="goToGame">Game Start</b-button>
        </div>
      </BRow>
    </BContainer>
  </main>
</template>

<style scoped>
.image-container {
  width: 30vw;
  padding-top: 30vw;
  position: relative;
}

.image-container .svg-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.button-container {
  text-align: center;
  margin-top: 20px;
}
</style>
