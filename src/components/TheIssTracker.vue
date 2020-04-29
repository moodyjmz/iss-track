<template>
  <div>
    <div id="mapid"></div>
  </div>
</template>

<script>
import Leaflet from "leaflet";

export default {
  name: "TheIssTracker",
  data: function() {
    return {
      $_debounceUpdate: null,
      $_map: null,
      $_mapIcon: null
    };
  },
  props: {
    latitude: Number,
    longitude: Number
  },
  watch: {
    longitude() {
      this.callMapUpdate();
    },
    latitude() {
      this.callMapUpdate();
    }
  },
  mounted: function() {
    this.createMap(this.latitude, this.longitude);
  },
  methods: {
    callMapUpdate() {
      clearTimeout(this.$_debounceUpdate);
      this.$_debounceUpdate = setTimeout(this.updateMap);
    },
    updateMap() {
      const latLng = [this.latitude, this.longitude];
      this.$_mapIcon.setLatLng(latLng);
      this.$_map.panTo(latLng, { animate: true });
    },
    createMap() {
      this.$_map = Leaflet.map("mapid");
      const latLng = [this.latitude, this.longitude];
      Leaflet.tileLayer(
        "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
        {
          attribution:
            'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
          maxZoom: 18,
          id: "mapbox/satellite-streets-v11",
          accessToken: process.env.VUE_APP_MAPBOX_TOKEN
        }
      ).addTo(this.$_map);
      this.$_map.setView(latLng, 5);
      const icon = Leaflet.icon({
        iconUrl: require("@/assets/iss.png"),
        iconSize: [64, 33],
        iconAnchor: [50, 25],
        popupAnchor: [50, 25]
      });
      this.$_mapIcon = Leaflet.marker(latLng, {
        icon: icon
      }).addTo(this.$_map);
    }
  }
};
</script>

<style scoped>
#mapid {
  height: 300px;
}
</style>
