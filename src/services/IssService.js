import {BaseService} from './BaseService';
class IssService extends BaseService {
  positionCurrent() {
    return this.get(process.env.VUE_APP_ISS_CURRENT_URL).then((res) => {
      return res.json();
    })
  }

  positionFutureList(lat, lon) {
    return this.get(process.env.VUE_APP_ISS_PASSES_URL + '?', {lat: lat, lon: lon}).then((res) => {
      return res.json();
    })
  }
}

const IssServiceInstance = new IssService();

export default IssServiceInstance;
