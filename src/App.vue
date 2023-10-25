

<template>
  <div id="mapDiv"></div>
  <div class="control-left">
    <button class="ui-button ui-button-primary"><span>当前图斑</span></button>
    <button class="ui-button ui-button-primary"><span>附近图斑</span></button>
  </div>
  <div class="control-right">
    <button class="ui-button ui-button-primary" @click="getLocation"><span>我的位置</span></button>
    <button class="ui-button ui-button-primary"><span>导航到当前图班</span></button>
  </div>
</template>

<script setup>
import { getLocalImgUrl } from "@/utils/publicFunc";
import { reactive } from "vue";
/**
 * state
 */
const state = reactive({
  map: ''
})
//在template中
window.onload = () => {
  loadKMZ();
};

const loadKMZ = () => {
  state.map = L.map("mapDiv", {
    zoomControl: false,
    locate: true
  });
  

  // 添加定位控件
  L.control.locate().addTo(state.map);

  state.map.on('locationfound', (e) => {
    console.log('e', e.latlng)
    /**
     * lat: 33.4382789
     * lng: -112.0178286
     */
    state.map.setView({lng: 33.4382789, lat: -112.0178286})
  })
  state.map.on('locationerror', (e) => {
    console.log(111)
  })


  L.tileLayer("http://t0.tianditu.gov.cn/img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=54e6c134c114509f4d544ca1e071d0e3").addTo(state.map);

  // 加载KMZ文件
  loadKMZ2(getLocalImgUrl("@/assets/a.kmz"))
  loadKMZ2(getLocalImgUrl("@/assets/b.kmz"))
}

const getLocation = () => {
  state.map.setView({lng: 33.4382789, lat: -112.0178286})
	
}

const loadKMZ2 = (str) => {
    fetch(str)
    .then((response) => response.blob())
    .then((blob) => {
      // 解压缩KMZ文件
      var zip = new JSZip();
      return zip.loadAsync(blob);
    })
    .then((zip) => {
      // 获取KML文件
      var kmlFile;
      zip.forEach((relativePath, zipEntry) => {
        if (relativePath.endsWith(".kml")) {
          kmlFile = zipEntry;
        }
      });
      // 解析KML文件
      return kmlFile.async("string");
    })
    .then((kmlData) => {
      const parser = new DOMParser();
      const kml = parser.parseFromString(kmlData, "text/xml");

      const track = new L.KML(kml);
      state.map.addLayer(track);
      //Adjust map to show the kml
      const bounds = track.getBounds();
      state.map.fitBounds(bounds);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

const userPos = () => {
  
  state.map.locate()
}
</script>

<style lang="scss" >
#mapDiv {
  width: 100vw;
  height: 100vh;
}
.leaflet-control-attribution {
   display: none;
}
.control-right, .control-left {
  position: fixed;
  bottom: 15px;
  z-index: 1000;
}
.control-right { right: 15px; }
.control-left { left: 15px; }
</style>
