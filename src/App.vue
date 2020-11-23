<template>
  <div id="app">
    <ModelViewer 
    :initialFloorType="initialFloorType" 
    :initialSideBand="initialSideBand" 
    :polymerProtection="polymerProtection" 
    :oarInitialLength="oarInitialLength" 
    :noseHookCount="noseHookCount" 
    :noseEarHook="noseEarHook" 
    :upperHooks="upperHooks"
    :mainColor="mainColor"
    :noseColor="noseColor"
    :ropeColor="ropeColor"
    :coneColor="coneColor"
    :floorColor="floorColor"
    :polymerColor="polymerColor"
    :upperBackHooks="upperBackHooks"
    />
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
      "upperHooks": true,
      "upperBackHooks": true,
      "mainColor": "#FFFFFF",
      "noseColor": "#141414",
      "ropeColor": "",
      "coneColor": "#141414",
      "floorColor":"#141414",
      "polymerColor":"#5E7AE7"
    }
  }
}
</script>

<style>

</style>
