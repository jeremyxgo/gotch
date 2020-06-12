const { http, https } = require('follow-redirects');
const urlLib = require('url');

class Gotch {
  /**
   * @typedef {object} GotchInstanceConfig
   * @property {string} [baseURL]
   * @property {string} [requestType]
   * @property {string} [responseType]
   * @property {number} [timeout]
   * @property {(string|Function)} [authorization]
   * @property {string} [credentials]
   * @property {string} [cancelTag]
   * @property {function} [onUploadProgress]
   * @property {function} [onDownloadProgress]
   */

  /**
   * @typedef {object} GotchRequestOptions
   * @property {string} [url]
   * @property {string} [method]
   * @property {(object|Headers)} [headers]
   * @property {(string|FormData)} [body]
   */

  /**
   * @param {GotchInstanceConfig} [config]
   */
  constructor(config = {}) {
    this.config = { ...config };
    this.initConfig = { ...config };
    this.taggedRequests = {};
    this.restoreConfig();
  }

  /**
   * @param {GotchInstanceConfig} [config]
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
   * @param {string} cancelTag
   */
  withCancelTag(cancelTag) {
    this.config.cancelTag = cancelTag;
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
   * @param {function} onUploadProgress
   */
  withOnUploadProgress(onUploadProgress) {
    this.config.onUploadProgress = onUploadProgress;
    return this;
  }

  /**
   * @param {function} onDownloadProgress
   */
  withOnDownloadProgress(onDownloadProgress) {
    this.config.onDownloadProgress = onDownloadProgress;
    return this;
  }

  /**
   * @param {string} url
   */
  get(url) {
    return this.request({ url, method: 'GET' });
  }

  /**
   * @param {string} url
   * @param {object} [params]
   */
  post(url, params = undefined) {
    return this.request({ url, method: 'POST', body: params });
  }

  /**
   * @param {string} url
   * @param {object} [params]
   */
  put(url, params = undefined) {
    return this.request({ url, method: 'PUT', body: params });
  }

  /**
   * @param {string} url
   * @param {object} [params]
   */
  patch(url, params = undefined) {
    return this.request({ url, method: 'PATCH', body: params });
  }

  /**
   * @param {string} url
   */
  delete(url) {
    return this.request({ url, method: 'DELETE' });
  }

  /**
   * @param {GotchRequestOptions} [options]
   */
  request(options = {}) {
    return this.dispatchRequest(options);
  }

  /**
   * @param {string} cancelTag
   */
  cancel(cancelTag) {
    const requests = this.taggedRequests[cancelTag];

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
      baseURL: this.initConfig.baseURL || '',
      requestType: this.initConfig.requestType || 'json',
      responseType: this.initConfig.responseType || 'json',
      timeout: this.initConfig.timeout || 0,
      authorization: this.initConfig.authorization || undefined,
      credentials: this.initConfig.credentials || 'same-origin',
      cancelTag: this.initConfig.cancelTag || undefined,
      onUploadProgress: this.initConfig.onUploadProgress || undefined,
      onDownloadProgress: this.initConfig.onDownloadProgress || undefined,
    };
  }

  /**
   * @param {string} cancelTag
   * @param {(XMLHttpRequest|Request)} request
   * @ignore
   */
  tagRequest(cancelTag, request) {
    Object.keys(this.taggedRequests).forEach((t) => {
      this.taggedRequests[t] = this.taggedRequests[t].filter(
        (r) => (r.readyState > 0 && r.readyState < 4),
      );
    });

    if (cancelTag) {
      this.taggedRequests[cancelTag] = [
        ...(this.taggedRequests[cancelTag] || []),
        request,
      ];
    }
  }

  /**
   * @param {GotchRequestOptions} [options]
   * @ignore
   */
  dispatchRequest(options = {}) {
    let promise;
    const {
      baseURL,
      requestType,
      responseType,
      timeout,
      authorization,
      credentials,
      cancelTag,
      onUploadProgress,
      onDownloadProgress,
    } = this.config;
    const fullOptions = {
      url: options.url,
      method: options.method || 'GET',
      responseType: 'text',
      headers: { ...(options.headers || {}) },
      body: options.body,
      timeout: timeout || 0,
      withCredentials: undefined,
      cancelTag,
      onUploadProgress,
      onDownloadProgress,
    };

    if (!(/^([a-z][a-z\d+-.]*:)?\/\//i.test(options.url))) {
      fullOptions.url = `${baseURL}${options.url}`;
    }

    if (credentials === 'include') {
      fullOptions.withCredentials = true;
    } else if (credentials === 'omit') {
      fullOptions.withCredentials = false;
    }

    if (fullOptions.headers.authorization) {
      fullOptions.headers.Authorization = fullOptions.headers.authorization;
      delete fullOptions.headers.authorization;
    }

    if (authorization && !fullOptions.headers.Authorization) {
      if (typeof authorization === 'string') {
        fullOptions.headers.Authorization = authorization;
      }

      if (typeof authorization === 'function') {
        fullOptions.headers.Authorization = authorization();
      }
    }

    if (requestType === 'text') {
      fullOptions.headers['Content-Type'] = 'text/plain;charset=UTF-8';
      fullOptions.body = this.transformToText(options.body);
    }

    if (requestType === 'json') {
      fullOptions.headers['Content-Type'] = 'application/json;charset=UTF-8';
      fullOptions.body = this.transformToJson(options.body);
    }

    if (requestType === 'form') {
      fullOptions.body = this.transformToForm(options.body);
    }

    if (responseType === 'text' || responseType === 'json') {
      fullOptions.responseType = 'text';
    }

    if (responseType === 'blob') {
      fullOptions.responseType = 'blob';
    }

    if (typeof XMLHttpRequest === 'undefined') {
      promise = this.dispatchServerRequest(fullOptions)
        .then((res) => this.transformResponse(responseType, res));
    } else {
      promise = this.dispatchClientRequest(fullOptions)
        .then((res) => this.transformResponse(responseType, res));
    }

    this.restoreConfig();

    return promise;
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
  dispatchServerRequest(options) {
    const {
      url,
      method,
      cancelTag,
      timeout,
      headers,
      body,
    } = options;

    return new Promise((resolve, reject) => {
      const parsedURL = urlLib.parse(url);
      const request = (parsedURL.protocol === 'https:' ? https : http).request({
        method,
        headers,
        hostname: parsedURL.hostname,
        path: parsedURL.path,
        port: parsedURL.port,
      }, (res) => {
        resolve(res);
      });

      if (timeout) {
        request.setTimeout(timeout);
      }

      request.on('timeout', () => {
        request.abort();
        const error = new Error('Request timeout');
        reject(error);
      });

      request.on('abort', () => {
        const error = new Error('Request aborted');
        reject(error);
      });


      request.on('error', () => {
        const error = new Error('Request failed');
        reject(error);
      });

      request.end(body);

      this.tagRequest(cancelTag, request);
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
  dispatchClientRequest(options) {
    const {
      url,
      method,
      cancelTag,
      timeout,
      withCredentials,
      responseType,
      headers,
      body,
      onUploadProgress,
      onDownloadProgress,
    } = options;

    return new Promise((resolve, reject) => {
      const request = new XMLHttpRequest();

      request.open(method, url);

      request.timeout = timeout;

      request.withCredentials = withCredentials;

      request.responseType = responseType;

      if (headers && Object.keys(headers).length > 0) {
        Object.keys(headers).forEach((key) => {
          request.setRequestHeader(key, headers[key]);
        });
      }

      if (typeof onUploadProgress === 'function') {
        request.upload.onprogress = onUploadProgress;
      }

      if (typeof onDownloadProgress === 'function') {
        request.onprogress = onDownloadProgress;
      }

      request.onloadend = function onLoadEnd() {
        if (request.status) {
          const {
            status,
            statusText,
            responseURL,
            response: resBody,
          } = request;

          const resHeaders = {};

          if (request.getAllResponseHeaders) {
            const lines = request.getAllResponseHeaders().trim().split('\n');
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

      request.ontimeout = function onTimeout() {
        const error = new Error('Request timeout');
        reject(error);
      };

      request.onabort = function onAbort() {
        const error = new Error('Request aborted');
        reject(error);
      };

      request.send(body);

      this.tagRequest(cancelTag, request);
    });
  }

  /**
   * @param {string} type
   * @param {Response} response
   * @ignore
   */
  transformResponse(type, response) {
    let promise;

    if (typeof XMLHttpRequest === 'undefined') {
      const { statusCode, statusMessage } = response;

      promise = new Promise((resolve, reject) => {
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
    } else {
      const res = response.clone();
      const { ok, status, statusText } = response;

      if (type === 'text' && typeof response.text === 'function') {
        promise = new Promise((resolve, reject) => {
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
        promise = new Promise((resolve, reject) => {
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
        promise = new Promise((resolve, reject) => {
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

    return promise;
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
