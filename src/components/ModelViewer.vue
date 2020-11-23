<template>
  <div class="wrapper">
    <div class="sidebar">
      <div class="sidebar-item">
        <p><b>Тип дна</b></p>
        <input v-on:change="changeFloor" v-model="floor_type" name="floor_type" type="radio" value="keel"> Килевое
        <input v-on:change="changeFloor" v-model="floor_type" name="floor_type" type="radio" value="flat"> Плоское
      </div>
      <div class="sidebar-item">
        <p><b>Длинна весел</b></p>
        <input v-on:change="changeOarLength" v-model="oar_length" name="oar_length" type="radio" value="1.6"> 1.6 м
        <input v-on:change="changeOarLength" v-model="oar_length" name="oar_length" type="radio" value="1.8"> 1.8 м
        <input v-on:change="changeOarLength" v-model="oar_length" name="oar_length" type="radio" value="2.0"> 2.0 м
      </div>
      <div class="sidebar-item">
        <p><b>Боковая полоса</b></p>
        <input v-on:change="setSideBand" v-model="side_band" name="side_band" type="checkbox" value="true">
      </div>
      <div class="sidebar-item">
        <p><b>Полимерная защита дна</b></p>
        <input v-on:change="setPolymerProtection" v-model="polymer_protect" name="polymer_protect" type="checkbox">
      </div>
      <div class="sidebar-item">
         <p><b>Цвет полимерной защиты</b></p>
        <input type="color" v-on:input="setPolymerColor($event)" v-model="polymer_color">
      </div>
      <div class="sidebar-item">
        <p><b>Цвет баллонов</b></p>
        <input type="color" v-on:input="setMainColor($event)" v-model="main_color">
      </div>
      <div class="sidebar-item">
        <p><b>Цвет дна</b></p>
        <input type="color" v-on:input="setFloorColor($event)" v-model="floor_color">
      </div>
      <div class="sidebar-item">
        <p><b>Цвет носовой части</b></p>
        <input type="color" v-on:input="setNoseColor($event)" v-model="nose_color">
      </div>
      <div class="sidebar-item">
        <p><b>Цвет концевиков баллонов</b></p>
        <input type="color" v-on:input="setConeColor($event)" v-model="cone_color">
      </div>
      <div class="sidebar-item">
        <p><b>Зацеп на носу</b></p>
        <input v-on:change="changeNoseHookCount" v-model="nose_hook_count" name="nose_hook_count" type="radio" value="1"> 1 ручка
        <input v-on:change="changeNoseHookCount" v-model="nose_hook_count" name="nose_hook_count" type="radio" value="2"> 2 ручки
      </div>
      <div class="sidebar-item">
        <p><b>Ручки сверху (спереди)</b></p>
        <input v-on:change="setUpperHooks" v-model="upper_hooks" name="upper_hooks" type="checkbox">
      </div>
      <div class="sidebar-item">
        <p><b>Ручки сверху (сзади)</b></p>
        <input v-on:change="setUpperBackHooks" v-model="upper_back_hooks" name="upper_hooks" type="checkbox">
      </div>
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
let scene;

Color3.prototype.FromHexString = function(hex) {
        if (hex.substring(0, 1) !== "#" || hex.length !== 7) {
            return new Color3(0, 0, 0);
        }

        var r = parseInt(hex.substring(1, 3), 16);
        var g = parseInt(hex.substring(3, 5), 16);
        var b = parseInt(hex.substring(5, 7), 16);

        return Color3.FromInts(r, g, b);
}
let FindMeshByName = MeshName => {
 return scene.meshes.find( mesh => {return (mesh.name === MeshName) });
}

function SetGroupVisibility(obj, statement) {
  obj.isVisible = statement;
  let childs = obj.getChildMeshes();
  if(!childs.length) return;
  for(let i = 0; i < childs.length; i++) {
    childs[i].isVisible = statement;
  } 
}
export default {
  name: 'ModelViewer',
  props: {
    initialFloorType: String,
    initialSideBand: Boolean,
    polymerProtection: Boolean,
    oarInitialLength: Number,
    noseHookCount: Number,
    noseEarHook: Boolean,
    upperHooks: Boolean,
    upperBackHooks: Boolean,
    mainColor: String,
    noseColor: String,
    ropeColor: String,
    coneColor: String,
    floorColor: String,
    polymerColor: String
  },
  mounted: function () {
    let canvas = document.getElementById('renderCanvas');
    let engine = new Engine(canvas, true);
    
    let CreateScene = function(initialFloorType, polymerProtection, oarInitialLength, noseEarHook, noseHookCount, mainColor, noseColor, polymerColor, initialSideBand, coneColor, floorColor, upperHooks, upperBackHooks) {
        // Create a basic BJS Scene object.
        let scene = new Scene(engine);
        scene.clearColor = new Color3(1,1,1);
        let camera = new ArcRotateCamera("Camera", 0, 0.8, 6, Vector3.Zero(), scene);
        camera.attachControl(canvas, true);
        camera.lowerRadiusLimit = 3;
        camera.upperRadiusLimit = 6;
        camera.panningSensibility = 0;
        // Create a basic light, aiming 0,1,0 - meaning, to the sky.
        new HemisphericLight('light1', new Vector3(0,1,0), scene);
        new DirectionalLight("DirectionalLight", new Vector3(0, 1, 0), scene);
        SceneLoader.ImportMesh(["цилиндр","дно_плоское","дно_киль"],"./models/", "лодка_сборка4.glb", scene, function () {
          // Init boat floor type depends on prop value

        SetGroupVisibility(FindMeshByName("дно_плоское"), !("flat" != initialFloorType));
        SetGroupVisibility(FindMeshByName("дно_киль"), !("keel" != initialFloorType));

        SetGroupVisibility(FindMeshByName("полимерная_защита"), polymerProtection);

        SetGroupVisibility(FindMeshByName("весло_1.6"), !(1.6 != oarInitialLength));
        SetGroupVisibility(FindMeshByName("весло_1.8"),  !(1.8 != oarInitialLength));
        SetGroupVisibility(FindMeshByName("весло_2.0"), !(2.0 != oarInitialLength)); 

        SetGroupVisibility(FindMeshByName("ручка_носовая"), !(1 != noseHookCount));
        SetGroupVisibility(FindMeshByName("ручки_носовые"), !(2 != noseHookCount));

        SetGroupVisibility(FindMeshByName("Проушина"), noseEarHook);

        FindMeshByName("цилиндр").material.albedoColor = new Color3().FromHexString(mainColor);

        FindMeshByName("нос").material.albedoColor = new Color3().FromHexString(noseColor);

        FindMeshByName("полимерная_защита").material.albedoColor = new Color3().FromHexString(polymerColor);

        SetGroupVisibility(FindMeshByName("боковая_полоса"), initialSideBand);

        FindMeshByName("концевики_баллонов").material.albedoColor = new Color3().FromHexString(coneColor);

        let FloorMaterial = scene.materials.find( material =>{return (material.name === "ПВХ_Дно") });
        FloorMaterial.albedoColor = new Color3().FromHexString(floorColor);

        SetGroupVisibility(FindMeshByName("ручки_сверху"), !(1 != upperHooks));

        SetGroupVisibility(FindMeshByName("ручки_верхние_сзади"), !(1 != upperBackHooks));
      });
        // Return the created scene.
      return scene;
    }

    scene = CreateScene(this.initialFloorType, this.polymerProtection, this.oarInitialLength, this.noseEarHook, this.noseHookCount, this.mainColor, this.noseColor, this.polymerColor, this.initialSideBand, this.coneColor, this.floorColor, this.upperHooks, this.upperBackHooks);
    engine.runRenderLoop(function() {
        scene.render();
    });

    window.addEventListener('resize', function() {
        engine.resize();
    });
  },
  methods: {
    
    changeFloor: function () {
        SetGroupVisibility(FindMeshByName("дно_плоское"), !("flat" != this.floor_type));
        SetGroupVisibility(FindMeshByName("дно_киль"), !("keel" != this.floor_type));  
    },
    setSideBand: function () {
      SetGroupVisibility(FindMeshByName("боковая_полоса"), this.side_band);
    },
    setMainColor: function ( e ) {
      const element = e.target;
      FindMeshByName("цилиндр").material.albedoColor = new Color3().FromHexString(element.value);
    },
    setNoseColor: function ( e ) {
      const element = e.target;
      FindMeshByName("нос").material.albedoColor = new Color3().FromHexString(element.value);
    },
    setPolymerProtection: function () {
      // const element = e.target; Черый ПВХ.003
      let protection = FindMeshByName("полимерная_защита");
      SetGroupVisibility(protection, this.polymer_protect);
      let flatFloor = FindMeshByName("дно_плоское");
      let keelFloor = FindMeshByName("дно_киль");
      let ChangeMaterial = (this.polymer_protect) ? protection.material : scene.materials.find( material =>{return (material.name === "ПВХ_Дно") });
      let UnderProtectMaterial = scene.materials.find( material =>{return (material.name === "Черый ПВХ_полимер") });
      if(this.polymer_protect) {
        UnderProtectMaterial.albedoColor = protection.material.albedoColor;
      } else {
        UnderProtectMaterial.albedoColor = new Color3(0.007, 0.007, 0.007);
      }
      flatFloor.material = keelFloor.material = ChangeMaterial;
    },
    setConeColor: function ( e ) {
      const element = e.target;
      FindMeshByName("концевики_баллонов").material.albedoColor = new Color3().FromHexString(element.value);
    },
    setFloorColor: function ( e ) {
      const element = e.target;
      let FloorMaterial = scene.materials.find( material =>{return (material.name === "ПВХ_Дно") });
      FloorMaterial.albedoColor = new Color3().FromHexString(element.value);
    },
    setPolymerColor: function ( e ) {
      const element = e.target;
      let value = element.value.match(/[A-Za-z0-9]{2}/g);
      // ["XX", "XX", "XX"] -> [n, n, n]
      value = value.map( v => { return parseInt(v, 16) });
      let PolymerMaterial = scene.materials.find( material =>{return (material.name === "Полимер") });
      PolymerMaterial.albedoColor.set(value[0]/255, value[1]/255, value[2]/255);
      // PolymerMaterial.specularColor.set(value[0]/255, value[1]/255, value[2]/255);
    },
    changeOarLength: function () {
      switch (this.oar_length) {
        case "1.6": SetGroupVisibility(FindMeshByName("весло_1.6"), true); SetGroupVisibility(FindMeshByName("весло_1.8"), false); SetGroupVisibility(FindMeshByName("весло_2.0"), false); break;
        case "1.8": SetGroupVisibility(FindMeshByName("весло_1.6"), false); SetGroupVisibility(FindMeshByName("весло_1.8"), true); SetGroupVisibility(FindMeshByName("весло_2.0"), false); break;
        case "2.0": SetGroupVisibility(FindMeshByName("весло_1.6"), false); SetGroupVisibility(FindMeshByName("весло_1.8"), false); SetGroupVisibility(FindMeshByName("весло_2.0"), true); break;
      }
    },
    changeNoseHookCount: function () {
      SetGroupVisibility(FindMeshByName("ручка_носовая"), !(1 != this.nose_hook_count));
      SetGroupVisibility(FindMeshByName("ручки_носовые"), !(2 != this.nose_hook_count));
    },
    setUpperHooks: function () {
      SetGroupVisibility(FindMeshByName("ручки_сверху"), !(1 != this.upper_hooks));
    },
    setUpperBackHooks: function () {
      SetGroupVisibility(FindMeshByName("ручки_верхние_сзади"), !(1 != this.upper_back_hooks));
    }
  },
  data: function () {
    return {
      floor_type: this.initialFloorType,
      nose_hook_count: this.noseHookCount,
      side_band: this.initialSideBand,
      polymer_protect: this.polymerProtection,
      oar_length: this.oarInitialLength,
      upper_hooks: this.upperHooks,
      main_color: this.mainColor,
      nose_color: this.noseColor,
      rope_color: this.ropeColor,
      cone_color: this.coneColor,
      floor_color: this.floorColor,
      polymer_color: this.polymerColor,
      upper_back_hooks: this.upperBackHooks
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
    /* overflow: hidden; */
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
    
  }

  @media screen and (max-width: 1320px) and (min-width: 961px) {
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
    height: 100%;

}
.sidebar {
    flex-direction: column;
    min-height: 0;
    max-height: 100%;
    width: 240px;
    height: 100vh;
    -webkit-box-flex: 0;
    flex: 0 0 auto;
    background: #fdfdfd;
    overflow-y:auto;
    z-index: 1;
}
  .sidebar-item{
    background: 4f4f4f;
    padding: 10px;
    border-bottom: 1px #ccc dotted;
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
