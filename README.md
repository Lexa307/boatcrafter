# Boatcrafter - Vue component for building a boat with custom configuration on your web shop
![](https://i.imgur.com/k25021u.png)

## Project setup
```
git clone https://github.com/Lexa307/boatcrafter
npm install
```

## Usage
- You can get the initialization data in App.vue from your server or write it in the code. Example of my default parameters :
```javascript
data: () => {
    return {
        "initialFloorType": "flat",
        "initialSideBand": true,
        "polymerProtection": false,
        "oarInitialLength": 1.6,
        "noseHookCount": 2,
        "noseEarHook": false,
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
```
- **` initialFloorType `** Can be **`"flat"`** or **`"keel"`** Describes the type of bottom of an inflatable boat.
- **` initialSideBand `** **`Boolean`** Flag indicating the presence of a protective side strip on the boat.
- **` polymerProtection `** **`Boolean`** Presence of stretched polymer protection at the bottom.
- **` oarInitialLength `** Can be **`1.6`** or **`1.8`** or **`2.0`** Length of oars.
- **` noseHookCount `** Can be **`1`** or **`2`**
- **` noseEarHook `** **`Boolean`** Sets the boat's eyelet.
- **` upperHooks `** **`Boolean`** Sets hand grips on the top if it **`false`** grips will be replased to ropes.
- **` upperBackHooks `** **`Boolean`** Sets hand grips near oars 

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
