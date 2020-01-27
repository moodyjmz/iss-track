export class CountriesModel {
  _countries = [];

  getAllCountries () {

  }

  _getCountryOffset(lat, lng, country) {
    return {
      lat:Math.abs((lat) - (country.latlng[0])),
      lng: Math.abs((lng) - (country.latlng[1]))
    };
  }
  getClosestCountry (lat, lng) {
    let closestCountryIndex;
    let closetCountryLatOffset;
    let closetCountryLngOffset;

    this._countries.forEach((country, index) => {
      let countryOffset = this._getCountryOffset(lat, lng, country);
      if (closestCountryIndex === undefined
        || (countryOffset.lat < closetCountryLatOffset)
        && (countryOffset.lng < closetCountryLngOffset)) {
        closestCountryIndex = index;
        closetCountryLatOffset = countryOffset.lat;
        closetCountryLngOffset = countryOffset.lng;
      }
    });
    return this._countries[closestCountryIndex];

  }
  setCountries (countries) {
    this._countries = countries;
  }
}
