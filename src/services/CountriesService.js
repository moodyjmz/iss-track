import {BaseService} from './BaseService';
class CountriesService extends BaseService {

  capitalCities() {
    return this.get(process.env.VUE_APP_COUNTRIES_URL).then((res) => {
      return res.json();
    })
    .catch((err) => {
      console.error(err); // eslint-disable-line
    })
  }
}

const CountriesServiceInstance = new CountriesService();

export default CountriesServiceInstance;
