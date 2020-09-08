<template>
  <div class="wrapper">
    <div class="sidebar">
      <p><b>Тип дна</b></p>
      <input v-on:change="changeFloor" v-model="floor_type" name="floor_type" type="radio" value="keel"> Килевое
      <input v-on:change="changeFloor" v-model="floor_type" name="floor_type" type="radio" value="flat"> Плоское
      <p><b>Боковая полоса</b></p>
      <input v-on:change="setSideBand" v-model="side_band" name="side_band" type="checkbox" value="true">
      <p><b>Цвет баллонов</b></p>
      <input type="color" v-on:input="setMainColor($event)" v-model="main_color">
      <p><b>Цвет носовой части</b></p>
      <input type="color" v-on:input="setNoseColor($event)" v-model="nose_color">
    </div>
    <canvas id="renderCanvas"></canvas>
  </div>
</template>
<script>
import {
    Engine
} from "@babylonjs/core/Engines/engine";
import {
    Vector3, Color3
} from "@babylonjs/core/Maths/math";
import {
    Scene
} from "@babylonjs/core/scene";
import {
    ArcRotateCamera
} from "@babylonjs/core/Cameras/arcRotateCamera";
import {
    HemisphericLight
} from "@babylonjs/core/Lights/hemisphericLight";
import {
    DirectionalLight
} from "@babylonjs/core/Lights/directionalLight";
import {
    SceneLoader
} from "@babylonjs/core/Loading";
import "@babylonjs/loaders/glTF";
var scene
window.addEventListener('DOMContentLoaded', function() {
    var canvas = document.getElementById('renderCanvas');
    var engine = new Engine(canvas, true);
    var createScene = function() {
        // Create a basic BJS Scene object.
        var scene = new Scene(engine);
        scene.clearColor = new Color3(1,1,1);
        var camera = new ArcRotateCamera("Camera", 0, 0.8, 6, Vector3.Zero(), scene);
        camera.attachControl(canvas, true);
        camera.lowerRadiusLimit = 3;
        camera.upperRadiusLimit = 6;
        camera.panningSensibility = 0;
        // Create a basic light, aiming 0,1,0 - meaning, to the sky.
        new HemisphericLight('light1', new Vector3(0,1,0), scene);
        new DirectionalLight("DirectionalLight", new Vector3(0, 1, 0), scene);
        SceneLoader.ImportMesh(["цилиндр","дно_плоское","дно_киль"],"./models/", "лодка_сборка1.glb", scene, function (meshes) {
        let flatFloor = meshes.find( mesh =>{return (mesh.name === "дно_плоское") });
        SetGroupVisibility(flatFloor, false); 
        
      });
        // Return the created scene.
      return scene;
    }

    scene = createScene();
    console.log(scene.meshes);
    engine.runRenderLoop(function() {
        scene.render();
    });

    window.addEventListener('resize', function() {
        engine.resize();
    });
});
function SetGroupVisibility(obj, statement){
  obj.isVisible = statement;
  let childs = obj.getChildMeshes();
  if(!childs.length) return;
  for(let i = 0; i < childs.length; i++){
    childs[i].isVisible = statement;
  } 
}
export default {
  name: 'ModelViewer',
  props: {
    initialFloorType: String,
    initialSideBand: Boolean
  },
  methods: {
    changeFloor: function () {
      let flatFloor = scene.meshes.find( mesh =>{return (mesh.name === "дно_плоское") });
      let keelFloor = scene.meshes.find( mesh =>{return (mesh.name === "дно_киль") });
      SetGroupVisibility(flatFloor, false); 
      SetGroupVisibility(keelFloor, false); 
      let floorObj = (this.floor_type == "flat") ? flatFloor : keelFloor;
      SetGroupVisibility(floorObj, true);     
    },
    setSideBand: function (){
     let sideBandMesh = scene.meshes.find( mesh =>{return (mesh.name === "боковая_полоса") });
     SetGroupVisibility(sideBandMesh, this.side_band);
    },
    setMainColor: function ( e ){
      const element = e.target;
      let cilinder = scene.meshes.find( mesh =>{return (mesh.name === "цилиндр") });
      let value = element.value.match(/[A-Za-z0-9]{2}/g);
      // ["XX", "XX", "XX"] -> [n, n, n]
      value = value.map( v => { return parseInt(v, 16) });
      cilinder.material.albedoColor = new Color3(value[0]/255, value[1]/255, value[2]/255);
      cilinder.material.specularColor = new Color3(value[0]/255, value[1]/255, value[2]/255);
    },
    setNoseColor: function ( e ){
      const element = e.target;
      let nose = scene.meshes.find( mesh =>{return (mesh.name === "нос") });
      let value = element.value.match(/[A-Za-z0-9]{2}/g);
      // ["XX", "XX", "XX"] -> [n, n, n]
      value = value.map( v => { return parseInt(v, 16) });
      nose.material.albedoColor = new Color3(value[0]/255, value[1]/255, value[2]/255);
      nose.material.specularColor = new Color3(value[0]/255, value[1]/255, value[2]/255);
    }
  },
  data: function () {
    return {
      floor_type: this.initialFloorType,
      side_band: this.initialSideBand,
      main_color: "#FFFFFF",
      nose_color: "#141414",
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #renderCanvas {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    width: 100%;
    height: 100%;
    overflow: hidden;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
    
  }
  @media screen and (max-width: 1320px) and (min-width: 961px){
    #renderCanvas {
        margin-left: 20%;
    }
  }

  .wrapper {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: stretch;
    -ms-flex-align: stretch;
    align-items: stretch;
    -webkit-box-pack: start;
    -ms-flex-pack: start;
    justify-content: flex-start;
    min-width: 0;
    min-height: 0;
    -webkit-box-flex: 1;
    -ms-flex: 1 1 auto;
    flex: 1 1 auto;
}
.sidebar{
  flex-direction: column;
    min-height: 0;
    width: 240px;
    -webkit-box-flex: 0;
    flex: 0 0 auto;
    background: #fdfdfd;
}

 .sidebar input[type='radio'] {
    --active: #275EFE;
    width: 19px;
    height: 19px;
    border-radius: 50%;
    outline: none;
    display: inline-block;
    vertical-align: top;
    position: relative;
    margin: 0;
    cursor: pointer;
    /* transition: background .3s, border-color .3s, box-shadow .2s; */
  }

</style>
