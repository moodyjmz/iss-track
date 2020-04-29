import { getDistance } from 'geolib';

export default class CountriesModel {
  _countries = [];

  _getCountryOffset(lat, lng, country) {
    return {
      lat:Math.abs((lat) - (country.latlng[0])),
      lng: Math.abs((lng) - (country.latlng[1]))
    };
  }
  getClosestCountry (lat, lng) {
    let closestCountryIndex;
    let closestDistance;

    this._countries.forEach((country, index) => {
      if(country.latlng[0]) {
        let distance = getDistance(
          {latitude: country.latlng[0], longitude: country.latlng[1]},
          {latitude: lat, longitude: lng}
        );
        if (closestCountryIndex === undefined
          || (distance < closestDistance)) {
          closestCountryIndex = index;
          closestDistance = distance;
        }
      }

    });
    return this._countries[closestCountryIndex];

  }
  setCountries (countries) {
    this._countries = countries;
  }
}
