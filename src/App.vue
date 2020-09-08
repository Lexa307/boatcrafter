<template>
  <div id="app">
    <ModelViewer initialFloorType="keel" :initialSideBand="true"/>
  </div>
</template>

<script>
import ModelViewer from './components/ModelViewer.vue'
export default {
  name: 'App',
  components: {
    ModelViewer
  }
}
</script>

<style>

</style>
