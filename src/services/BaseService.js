export class BaseService {
  get(url, params = {}) {
    return fetch(url + new URLSearchParams(params));
  }
}
