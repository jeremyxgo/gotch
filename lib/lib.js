class Gotch {
  /**
   * @typedef {object} GotchInstanceConfig
   * @property {string} [baseURL]
   * @property {string} [requestType]
   * @property {string} [responseType]
   * @property {string} [authorization]
   * @property {string} [withCredentials]
   * @property {number} [timeout]
   * @property {string} [cancelTag]
   * @property {function} [onUploadProgress]
   * @property {function} [onDownloadProgress]
   */

  /**
   * @typedef {object} GotchRequestOptions
   * @property {string} [url]
   * @property {string} [method]
   * @property {(object|Headers)} [headers]
   * @property {(string|object|FormData)} [params]
   */

  /**
   * @typedef {object} GotchResponse
   * @property {string} [url]
   */

  /**
   * @param {GotchInstanceConfig} config
   */
  constructor(config = {}) {
    this.config = { ...config };
    this.initConfig = { ...config };
    this.resetConfig();
  }

  /**
   * @param {GotchInstanceConfig} config
   */
  create(config) {
    return new Gotch(config);
  }

  /**
   * @param {GotchRequestOptions} options
   */
  request(options) {
    return this.dispatchRequest(options);
  }

  get(url) {
    return this.request({ url, method: 'GET' });
  }

  post(url, params) {
    return this.request({ url, method: 'POST', params });
  }

  put(url, params) {
    return this.request({ url, method: 'PUT', params });
  }

  patch(url, params) {
    return this.request({ url, method: 'PATCH', params });
  }

  delete(url) {
    return this.request({ url, method: 'DELETE' });
  }

  dispatchRequest() {

  }

  resetConfig() {
    this.config = {
      baseURL: this.initConfig.baseURL || '',
      requestType: this.initConfig.requestType || 'json',
      responseType: this.initConfig.responseType || 'json',
      authorization: this.initConfig.authorization || undefined,
      withCredentials: this.initConfig.withCredentials || false,
      timeout: this.initConfig.timeout || undefined,
      cancelTag: this.initConfig.cancelTag || undefined,
      onUploadProgress: this.initConfig.onUploadProgress || undefined,
      onDownloadProgress: this.initConfig.onDownloadProgress || undefined,
    };
  }
}

export default new Gotch();
