/* eslint-disable */
class Gotch {
  constructor(config) {
    this._config = this._mergeConfig(config);
    this._isBrowser = typeof window !== 'undefined';
  }

  create(config) {
    this._config = this._mergeConfig(config);
    return this;
  }

  request(url, config) {
    if (this._isBrowser) {
      return this._xhrAdapter(url, config);
    }
    return this._httpAdapter(url, config);
  }

  get(url, config) {
    return this.request(url, { method: 'GET', ...config });
  }

  delete(url, config) {
    return this.request(url, { method: 'DELETE', ...config });
  }

  post(url, data, config) {
    return this.request(url, { method: 'POST', data, ...config });
  }

  put(url, data, config) {
    return this.request(url, { method: 'PUT', data, ...config });
  }

  patch(url, data, config) {
    return this.request(url, { method: 'PATCH', data, ...config });
  }

  cancel(tag) {

  }

  _xhrAdapter(url = '', config = {}) {
    const cfg = this._mergeConfig(config);
    const req = window.XMLHttpRequest();
  }

  _httpAdapter(url = '', config = {}) {
    const { parse: parseURL } = require('url');
    const { http, https } = require('follow-redirects');
    const cfg = this._mergeConfig(config);
    const parsed = parseURL(`${cfg.baseURL}${url}`);

    const req = (parsed.protocol === 'https' ? https : http)
      .request({
        hostname: parsed.hostname,
        path: parsed.path,
        port: parsed.port,
        method: cfg.method,
        headers: cfg.headers,
      }, (res) => {
        const chunks = [];
        res.on('data', (chunk) => { chunks.push(chunk); });
        res.on('error', () => { console.log('res error'); });
        res.on('end', () => {
          const data = Buffer.concat(chunks);
        });
      });

    req.on('timeout', () => { console.log('req timeout'); });
    req.on('abort', () => { console.log('req abort'); });
    req.on('error', () => { console.log('req error'); });
    req.end();
  }

  _mergeConfig(config = {}) {
    if (!this._config) {
      this._config = {};
    }

    return {
      method: config.method || this._config.method || 'GET',
      baseURL: config.baseURL || this._config.baseURL || '',
      requestType: config.requestType || this._config.requestType || 'json',
      responseType: config.responseType || this._config.responseType || 'json',
      headers: config.headers || this._config.headers || {},
      authorization: config.authorization || this._config.authorization || undefined,
      data: config.data || this._config.data || undefined,
      timeout: config.timeout || this._config.timeout || undefined,
      tag: config.tag || this._config.tag || undefined,
      onUploadProgress: config.onUploadProgress || this._config.onUploadProgress || undefined,
      onDownloadProgress: config.onDownloadProgress || this._config.onDownloadProgress || undefined,
    };
  }
}

const gotch = new Gotch();

gotch.get('https://explorer.bsos.tech/api/nodes');

export default gotch;
