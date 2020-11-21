<template>
  <div id="app">
    <ModelViewer 
    :initialFloorType="initialFloorType" 
    :initialSideBand="initialSideBand" 
    :polymerProtection="polymerProtection" 
    :oarInitialLength="oarInitialLength" 
    :noseHookCount="noseHookCount" 
    :noseEarHook="noseEarHook" 
    :upperHooks="upperHooks"/>
  </div>
</template>

<script>
import ModelViewer from './components/ModelViewer.vue'
export default {
  name: 'App',
  components: {
    ModelViewer
  },
  data: () => {
    return {
      "initialFloorType": "flat",
      "initialSideBand": true,
      "polymerProtection": false,
      "oarInitialLength": 1.6,
      "noseHookCount": 2,
      "noseEarHook": true,
      "upperHooks": true
    }
  }
}
</script>

<style>

</style>
