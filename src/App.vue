<template>
  <div id="app">
    <ModelViewer initialFloorType="keel" :initialSideBand="true" :polymerProtection="false" :oarInitialLength="1.6" noseInitialHookType="handle_hook"/>
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
