<template>
  <div id="app">
    <div id="tracker-wrapper" class="container">
      <h2>Where is the ISS?</h2>
      <TheIssTracker :latitude="latitude" :longitude="longitude" />
      <div id="closest-city-wrapper">
        <TheClosestCity :location="closestCity" />
      </div>
    </div>

    <div id="capital-lookup" class="container">
      <h2>When will the ISS be over my capital?</h2>
      <select v-model="selected" v-on:change="upcomingChangedHandler">
        <option value disabled selected>Choose capital...</option>
        <option
          v-for="country in countries"
          v-bind:value="country"
          v-bind:key="country.name"
        >{{country.capital}}</option>
      </select>
      <TimeToCapital :risetime="risetime" :duration="duration" />
    </div>
  </div>
</template>

<script>
import CountriesModelInstance from "./models/CountriesModel";
import CountriesService from "./services/CountriesService";
import IssService from "./services/IssService";
import TheIssTracker from "./components/TheIssTracker.vue";
import TheClosestCity from "./components/TheClosestCity.vue";
import TimeToCapital from "./components/TimeToCapital.vue";

const CountriesModel = new CountriesModelInstance();
export default {
  name: "app",
  components: {
    TheIssTracker,
    TheClosestCity,
    TimeToCapital
  },
  data: function() {
    return {
      closestCity: {},
      selected: {},
      countries: [],
      risetime: null,
      duration: null,
      latitude: 0,
      longitude: 0
    };
  },
  computed: {},
  methods: {
    upcomingChangedHandler() {
      IssService.positionFutureList(
        this.selected.latlng[0],
        this.selected.latlng[1]
      ).then(res => {
        const now = new Date();
        for (const time of res.response) {
          const d = new Date(time.risetime * 1000);
          if (d > now) {
            this.risetime = d;
            this.duration = time.duration;
            break;
          }
        }
      });
    },
    updateIssPosition() {
      IssService.positionCurrent().then(res => {
        this.latitude = Number(res.iss_position.latitude);
        this.longitude = Number(res.iss_position.longitude);
        this.closestCity = CountriesModel.getClosestCountry(
          this.latitude,
          this.longitude
        );
      });
    },
    buildCapitalsList() {
      CountriesService.capitalCities().then(res => {
        CountriesModel.setCountries(res);
        const comparer = new Intl.Collator("en").compare;
        const _countries = res.filter(country => {
          return country.capital !== "";
        });
        _countries.sort((a, b) => {
          return comparer(a.capital, b.capital);
        });
        this.countries = _countries;
      });
    }
  },
  created: function() {
    this.buildCapitalsList();
    this.updateIssPosition();
    setInterval(() => {
      this.updateIssPosition();
    }, 5000);
  }
};
</script>

<style>
@import "~leaflet/dist/leaflet.css";
@import url("https://fonts.googleapis.com/css?family=Roboto+Condensed&display=swap");

body {
  background-size: cover;
  background: #000 url(./assets/earth-bg.jpg) no-repeat;
}
#app {
  font-family: "Roboto Condensed", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #ffffff;
  min-width: 300px;
  display: flex;
  flex-direction: row;
  margin: 60px auto;
  justify-content: center;
}
.container {
  color: #cecdcd;
  background: rgba(0, 0, 0, 0.8);
  border: 1px solid #422761;
  border-radius: 5px;
  padding: 10px;
  margin: 5px;
}
#tracker-wrapper {
  width: 65%;
}
#closest-city-wrapper {
  display: block;
  margin-top: 15px;
}
#capital-lookup {
  width: 25%;
}
</style>
