const { http, https } = require('follow-redirects');
const urlLib = require('url');

class Gotch {
  /**
   * @typedef {object} GotchConfig
   * @property {string} [baseURL]
   * @property {string} [requestType]
   * @property {string} [responseType]
   * @property {string} [tag]
   * @property {number} [timeout]
   * @property {string} [credentials]
   * @property {(string|Function)} [authorization]
   * @property {function} [withOnUploadProgress]
   * @property {function} [withOnDownloadProgress]
   */

  /**
   * @typedef {object} GotchRequestOptions
   * @property {string} [method]
   * @property {(object|Headers)} [headers]
   * @property {(string|FormData)} [body]
   */

  /**
   * @param {GotchConfig} [config]
   */
  constructor(config = {}) {
    this.reqTagMap = {};
    this.config = { ...config };
    this.initConfig = { ...config };
    this.restoreConfig();
  }

  /**
   * @param {GotchConfig} [config]
   */
  create(config = {}) {
    return new Gotch(config);
  }

  /**
   * @param {string} baseURL
   */
  withBaseURL(baseURL) {
    this.config.baseURL = baseURL;
    return this;
  }

  /**
   * @param {string} requestType
   */
  withRequestType(requestType) {
    this.config.requestType = requestType;
    return this;
  }

  /**
   * @param {string} responseType
   */
  withResponseType(responseType) {
    this.config.responseType = responseType;
    return this;
  }

  /**
   * @param {string} tag
   */
  withTag(tag) {
    this.config.tag = tag;
    return this;
  }

  /**
   * @param {number} timeout
   */
  withTimeout(timeout) {
    this.config.timeout = timeout;
    return this;
  }

  /**
   * @param {string} credentials
   */
  withCredentials(credentials) {
    this.config.credentials = credentials;
    return this;
  }

  /**
   * @param {(string|function)} authorization
   */
  withAuthorization(authorization) {
    this.config.authorization = authorization;
    return this;
  }

  /**
   * @param {function} handleEvent
   */
  withOnUploadProgress(handleEvent) {
    this.config.withOnUploadProgress = handleEvent;
    return this;
  }

  /**
   * @param {function} handleEvent
   */
  withOnDownloadProgress(handleEvent) {
    this.config.withOnDownloadProgress = handleEvent;
    return this;
  }

  /**
   * @param {string} url
   */
  get(url) {
    return this.request(url, { method: 'GET' });
  }

  /**
   * @param {string} url
   * @param {object} [params]
   */
  post(url, params = undefined) {
    return this.request(url, { method: 'POST', body: params });
  }

  /**
   * @param {string} url
   * @param {object} [params]
   */
  put(url, params = undefined) {
    return this.request(url, { method: 'PUT', body: params });
  }

  /**
   * @param {string} url
   * @param {object} [params]
   */
  patch(url, params = undefined) {
    return this.request(url, { method: 'PATCH', body: params });
  }

  /**
   * @param {string} url
   */
  delete(url) {
    return this.request(url, { method: 'DELETE' });
  }

  /**
   * @param {string} url
   * @param {GotchRequestOptions} [options]
   */
  request(url, options = {}) {
    const { responseType } = this.config;
    const requestURL = this.buildRequestURL(url);
    const requestOptions = this.buildRequestOptions(options);
    const promise = this.dispatchRequest(requestURL, requestOptions)
      .then((res) => this.handleResponse(responseType, res));
    this.restoreConfig();
    return promise;
  }

  /**
   * @param {string} tag
   */
  cancel(tag) {
    const requests = this.reqTagMap[tag];

    if (requests) {
      requests.forEach((request) => {
        if (request && request.abort) {
          request.abort();
        }
      });
    }
  }

  /**
   * @ignore
   */
  restoreConfig() {
    this.config = {
      baseURL: this.initConfig.baseURL || undefined,
      requestType: this.initConfig.requestType || 'json',
      responseType: this.initConfig.responseType || 'json',
      tag: this.initConfig.tag || undefined,
      timeout: this.initConfig.timeout || 0,
      credentials: this.initConfig.credentials || 'same-origin',
      authorization: this.initConfig.authorization || undefined,
      withOnUploadProgress: this.initConfig.withOnUploadProgress || undefined,
      withOnDownloadProgress: this.initConfig.withOnDownloadProgress || undefined,
    };
  }

  /**
   * @param {string} tag
   * @param {(XMLHttpRequest|Request)} request
   * @ignore
   */
  tagRequest(tag, request) {
    Object.keys(this.reqTagMap).forEach((t) => {
      this.reqTagMap[t] = this.reqTagMap[t].filter(
        (r) => (r.readyState > 0 && r.readyState < 4),
      );
    });

    if (tag) {
      this.reqTagMap[tag] = [
        ...(this.reqTagMap[tag] || []),
        request,
      ];
    }
  }

  /**
   * @param {string} [url]
   * @ignore
   */
  buildRequestURL(url = '') {
    let requestURL;

    if (/^([a-z][a-z\d+-.]*:)?\/\//i.test(url)) {
      requestURL = url;
    } else {
      requestURL = `${this.config.baseURL}${url}`;
    }

    return requestURL;
  }

  /**
   * @param {GotchRequestOptions} [options]
   * @ignore
   */
  buildRequestOptions(options = {}) {
    const requestOptions = {
      method: options.method || 'GET',
      timeout: this.config.timeout || 0,
      withCredentials: undefined,
      responseType: 'text',
      headers: { ...(options.headers || {}) },
      body: options.body,
    };

    if (this.config.credentials === 'include') {
      requestOptions.withCredentials = true;
    } else if (this.config.credentials === 'omit') {
      requestOptions.withCredentials = false;
    }

    if (requestOptions.headers.authorization) {
      requestOptions.headers.Authorization = requestOptions.headers.authorization;
      delete requestOptions.headers.authorization;
    }

    if (this.config.authorization && !requestOptions.headers.Authorization) {
      if (typeof this.config.authorization === 'string') {
        requestOptions.headers.Authorization = this.config.authorization;
      }

      if (typeof this.config.authorization === 'function') {
        requestOptions.headers.Authorization = this.config.authorization();
      }
    }

    if (this.config.requestType === 'text') {
      requestOptions.headers['Content-Type'] = 'text/plain;charset=UTF-8';
      requestOptions.body = this.transformToText(options.body);
    }

    if (this.config.requestType === 'json') {
      requestOptions.headers['Content-Type'] = 'application/json;charset=UTF-8';
      requestOptions.body = this.transformToJson(options.body);
    }

    if (this.config.requestType === 'form') {
      requestOptions.body = this.transformToForm(options.body);
    }

    if (this.config.responseType === 'text' || this.config.responseType === 'json') {
      requestOptions.responseType = 'text';
    }

    if (this.config.responseType === 'blob') {
      requestOptions.responseType = 'blob';
    }

    return requestOptions;
  }

  /**
   * @param {string} url
   * @param {object} options
   * @param {string} options.method
   * @param {number} options.timeout
   * @param {boolean} options.withCredentials
   * @param {string} options.responseType
   * @param {(object|Headers)} options.headers
   * @param {(string|FormData)} options.body
   * @ignore
   */
  dispatchRequest(url, options) {
    let req;

    if (typeof XMLHttpRequest === 'undefined') {
      req = this.dispatchServerRequest(url, options);
    } else {
      req = this.dispatchClientRequest(url, options);
    }

    return req;
  }

  /**
   * @param {string} url
   * @param {object} options
   * @param {string} options.method
   * @param {number} options.timeout
   * @param {boolean} options.withCredentials
   * @param {string} options.responseType
   * @param {(object|Headers)} options.headers
   * @param {(string|FormData)} options.body
   * @ignore
   */
  dispatchServerRequest(url, options) {
    const {
      method, timeout, headers, body,
    } = options;

    return new Promise((resolve, reject) => {
      const parsedURL = urlLib.parse(url);
      const req = (parsedURL.protocol === 'https:' ? https : http).request({
        method,
        headers,
        hostname: parsedURL.hostname,
        path: parsedURL.path,
        port: parsedURL.port,
      }, (res) => {
        resolve(res);
      });

      if (timeout) {
        req.setTimeout(timeout);
      }

      req.on('timeout', () => {
        req.abort();
        const error = new Error('Request timeout');
        reject(error);
      });

      req.on('abort', () => {
        const error = new Error('Request aborted');
        reject(error);
      });


      req.on('error', () => {
        const error = new Error('Request failed');
        reject(error);
      });

      req.end(body);

      this.tagRequest(this.config.tag, req);
    });
  }

  /**
   * @param {string} url
   * @param {object} options
   * @param {string} options.method
   * @param {number} options.timeout
   * @param {boolean} options.withCredentials
   * @param {string} options.responseType
   * @param {(object|Headers)} options.headers
   * @param {(string|FormData)} options.body
   * @ignore
   */
  dispatchClientRequest(url, options) {
    const {
      method, timeout, withCredentials, responseType, headers, body,
    } = options;

    return new Promise((resolve, reject) => {
      const req = new XMLHttpRequest();

      req.open(method, url);

      req.timeout = timeout;

      req.withCredentials = withCredentials;

      req.responseType = responseType;

      if (headers && Object.keys(headers).length > 0) {
        Object.keys(headers).forEach((key) => {
          req.setRequestHeader(key, headers[key]);
        });
      }

      if (this.config.withOnUploadProgress
        && typeof this.config.withOnUploadProgress === 'function') {
        const handleUploadProgress = this.config.withOnUploadProgress;
        req.upload.onprogress = function handleProgress(e) {
          handleUploadProgress(e);
        };
      }

      if (this.config.withOnDownloadProgress
        && typeof this.config.withOnDownloadProgress === 'function') {
        const handleDownloadProgress = this.config.withOnDownloadProgress;
        req.onprogress = function handleProgress(e) {
          handleDownloadProgress(e);
        };
      }

      req.onloadend = function handleLoad() {
        if (req.status) {
          const {
            status,
            statusText,
            responseURL,
            response: resBody,
          } = req;

          const resHeaders = {};

          if (req.getAllResponseHeaders) {
            const lines = req.getAllResponseHeaders().trim().split('\n');
            lines.forEach((line) => {
              const parts = line.split(': ');
              const name = parts.shift();
              const value = parts.join(': ');
              resHeaders[name] = value;
            });
          }

          const res = new Response(resBody, { status, statusText, headers: resHeaders });
          Object.defineProperty(res, 'url', { value: url });
          Object.defineProperty(res, 'responseURL', { value: responseURL });

          resolve(res);
        } else {
          const error = new Error('Request failed');
          reject(error);
        }
      };

      req.ontimeout = function handleTimeout() {
        const error = new Error('Request timeout');
        reject(error);
      };

      req.onabort = function handleAbort() {
        const error = new Error('Request aborted');
        reject(error);
      };

      req.send(body);

      this.tagRequest(this.config.tag, req);
    });
  }

  /**
   * @param {string} type
   * @param {Response} response
   * @ignore
   */
  handleResponse(type, response) {
    if (typeof XMLHttpRequest === 'undefined') {
      const { statusCode, statusMessage } = response;

      return new Promise((resolve, reject) => {
        const chunks = [];

        response.on('data', (chunk) => {
          chunks.push(chunk);
        });

        response.on('end', () => {
          const data = Buffer.concat(chunks);

          if (statusCode >= 200 && statusCode < 300) {
            response.data = data;
            resolve(response);
          } else {
            const error = new Error(`${statusCode} ${statusMessage}`);
            reject(error);
          }
        });

        response.on('error', (e) => {
          reject(e);
        });
      });
    }

    if (response instanceof Response) {
      const res = response.clone();
      const { ok, status, statusText } = response;

      if (type === 'text' && typeof response.text === 'function') {
        return new Promise((resolve, reject) => {
          response.text()
            .then((text) => {
              res.data = text;

              if (!ok) {
                const error = new Error(`${status} ${statusText}`);
                error.response = res;
                throw error;
              }

              resolve(res);
            })
            .catch((e) => {
              reject(e);
            });
        });
      }

      if (type === 'json' && typeof response.text === 'function') {
        return new Promise((resolve, reject) => {
          response.text()
            .then((text) => {
              try {
                res.data = JSON.parse(text);
              } catch (e) {
                res.data = text;
              }

              if (!ok) {
                const error = new Error(`${status} ${statusText}`);
                error.response = res;
                throw error;
              }

              resolve(res);
            })
            .catch((e) => {
              reject(e);
            });
        });
      }

      if (type === 'blob' && typeof response.blob === 'function') {
        return new Promise((resolve, reject) => {
          response.blob()
            .then((blob) => {
              res.data = blob;

              if (!ok) {
                const error = new Error(`${status} ${statusText}`);
                error.response = res;
                throw error;
              }

              resolve(res);
            })
            .catch((e) => {
              reject(e);
            });
        });
      }
    }

    return undefined;
  }

  /**
   * @param {object} params
   * @ignore
   */
  transformToText(params) {
    if (params && typeof FormData === 'function' && params instanceof FormData) {
      return (new URLSearchParams(params)).toString();
    }

    if (params && typeof params === 'object') {
      return JSON.stringify(params);
    }

    return params;
  }

  /**
   * @param {object} params
   * @ignore
   */
  transformToJson(params) {
    if (params && typeof FormData === 'function' && params instanceof FormData) {
      const parsedParams = {};

      params.forEach((value, key) => {
        if (value === undefined) {
          return;
        }

        if (!parsedParams[key]) {
          parsedParams[key] = value;
          return;
        }

        parsedParams[key] = [...parsedParams[key], value];
      });

      return JSON.stringify(parsedParams);
    }

    if (params && typeof params === 'object') {
      return JSON.stringify(params);
    }

    return params;
  }

  /**
   * @param {object} params
   * @ignore
   */
  transformToForm(params) {
    if (params && typeof FormData === 'function' && params instanceof FormData) {
      return params;
    }

    if (params && typeof params === 'object' && typeof FormData === 'function') {
      const formData = new FormData();

      Object.keys(params).forEach((key) => {
        const value = params[key];

        if (typeof value === 'function'
          || value === undefined
          || value === null
        ) {
          return;
        }

        if (Array.isArray(value)) {
          value.forEach((item) => {
            formData.append(key, item);
          });
        } else if (value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, JSON.stringify(value));
        }
      });

      return formData;
    }

    return params;
  }
}

export default new Gotch();
