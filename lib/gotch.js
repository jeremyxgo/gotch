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
    this.xhrTagMap = {};
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
   * @param {GotchRequestOptions} [options]
   */
  request(url, options = {}) {
    const { responseType } = this.config;
    const requestURL = this.buildRequestURL(url);
    const requestOptions = this.buildRequestOptions(options);
    const promise = this.dispatchRequest(requestURL, requestOptions)
      .then((xhr) => this.createResponse(requestURL, xhr))
      .then((res) => this.handleResponse(responseType, res));
    this.restoreConfig();
    return promise;
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
    return this.request(url, { method: 'DELETE' })
      .then(this.handleResponse.bind(this));
  }

  /**
   * @param {string} tag
   */
  cancel(tag) {
    const xhrs = this.xhrTagMap[tag];

    if (xhrs) {
      xhrs.forEach((xhr) => {
        if (xhr && xhr.abort) {
          xhr.abort();
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
   * @param {XMLHttpRequest} xhr
   * @ignore
   */
  tagXHR(tag, xhr) {
    Object.keys(this.xhrTagMap).forEach((t) => {
      this.xhrTagMap[t] = this.xhrTagMap[t].filter(
        (r) => (r.readyState > 0 && r.readyState < 4),
      );
    });

    if (tag) {
      this.xhrTagMap[tag] = [
        ...(this.xhrTagMap[tag] || []),
        xhr,
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
    const {
      method, timeout, withCredentials, responseType, headers, body,
    } = options;

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.open(method, url);

      xhr.timeout = timeout;

      xhr.withCredentials = withCredentials;

      xhr.responseType = responseType;

      if (headers && Object.keys(headers).length > 0) {
        Object.keys(headers).forEach((key) => {
          xhr.setRequestHeader(key, headers[key]);
        });
      }

      if (this.config.withOnUploadProgress
        && typeof this.config.withOnUploadProgress === 'function') {
        const handleUploadProgress = this.config.withOnUploadProgress;
        xhr.upload.onprogress = function handleProgress(e) {
          handleUploadProgress(e);
        };
      }

      if (this.config.withOnDownloadProgress
        && typeof this.config.withOnDownloadProgress === 'function') {
        const handleDownloadProgress = this.config.withOnDownloadProgress;
        xhr.onprogress = function handleProgress(e) {
          handleDownloadProgress(e);
        };
      }

      xhr.onloadend = function handleLoad() {
        if (xhr.status) {
          resolve(xhr);
        } else {
          const error = new Error('Request failed');
          reject(error);
        }
      };

      xhr.ontimeout = function handleTimeout() {
        const error = new Error('Request timeout');
        reject(error);
      };

      xhr.onabort = function handleAbort() {
        const error = new Error('Request aborted');
        reject(error);
      };

      xhr.send(body);

      this.tagXHR(this.config.tag, xhr);
    });
  }

  /**
   * @param {string} url
   * @param {XMLHttpRequest} xhr
   * @ignore
   */
  createResponse(url, xhr) {
    if (xhr && xhr.status && xhr.getAllResponseHeaders) {
      const {
        status,
        statusText,
        responseURL,
        response: body,
      } = xhr;
      const lines = xhr.getAllResponseHeaders().trim().split('\n');
      const headers = {};

      lines.forEach((line) => {
        const parts = line.split(': ');
        const name = parts.shift();
        const value = parts.join(': ');
        headers[name] = value;
      });

      const response = new Response(body, { status, statusText, headers });
      Object.defineProperty(response, 'url', { value: url });
      Object.defineProperty(response, 'responseURL', { value: responseURL });

      return response;
    }

    return undefined;
  }

  /**
   * @param {string} type
   * @param {Response} response
   * @ignore
   */
  handleResponse(type, response) {
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
    if (params && params instanceof FormData) {
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
    if (params && params instanceof FormData) {
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
    if (params && params instanceof FormData) {
      return params;
    }

    if (params && typeof params === 'object') {
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
