class Gotch {
  constructor(config = {}) {
    this.xhrTagMap = {};
    this.updateConfig(config);
  }

  updateConfig(config = {}) {
    this.configBackup = { ...this.configBackup, ...config };
    this.config = { ...this.config, ...config };
    this.cleanConfig();
  }

  cleanConfig() {
    this.config = {
      baseURL: this.configBackup.baseURL || '',
      type: this.configBackup.type || '',
      tag: this.configBackup.tag || '',
      timeout: this.configBackup.timeout || 0,
      credentials: this.configBackup.credentials || 'same-origin',
      authorization: this.configBackup.authorization || undefined,
      withOnUploadProgress: this.configBackup.withOnUploadProgress || undefined,
      withOnDownloadProgress: this.configBackup.withOnDownloadProgress || undefined,
    };
  }

  /**
   * @param {object} [config]
   * @param {string} [config.baseURL]
   * @param {string} [config.type]
   * @param {string} [config.tag]
   * @param {number} [config.timeout]
   * @param {string} [config.credentials]
   * @param {string|Function} [config.authorization]
   * @param {function} [config.withOnUploadProgress]
   * @param {function} [config.withOnDownloadProgress]
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
   * @param {string} tag
   */
  withTag(tag) {
    this.config.tag = tag;
    return this;
  }

  /**
   * @param {string} type
   */
  withType(type) {
    this.config.type = type;
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
   * @param {object} [options]
   * @param {string} [options.method]
   * @param {(object|Headers)} [options.headers]
   * @param {any} [options.body]
   */
  request(url, options = {}) {
    const requestURL = this.buildRequestURL(url);
    const requestOptions = this.buildRequestOptions(options);
    const promise = this.dispatchRequest(requestURL, requestOptions);
    this.cleanConfig();
    return promise;
  }

  /**
   * @param {string} url
   */
  get(url) {
    return this.request(url, { method: 'GET' })
      .then(handleResponse);
  }

  /**
   * @param {string} url
   * @param {object} [params]
   */
  post(url, params = undefined) {
    return this.request(url, { method: 'POST', body: params })
      .then(handleResponse);
  }

  /**
   * @param {string} url
   * @param {object} [params]
   */
  put(url, params = undefined) {
    return this.request(url, { method: 'PUT', body: params })
      .then(handleResponse);
  }

  /**
   * @param {string} url
   * @param {object} [params]
   */
  patch(url, params = undefined) {
    return this.request(url, { method: 'PATCH', body: params })
      .then(handleResponse);
  }

  /**
   * @param {string} url
   */
  delete(url) {
    return this.request(url, { method: 'DELETE' })
      .then(handleResponse);
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
   * @param {string} url
   * @param {object} options
   * @param {object} options.method
   * @param {number} options.timeout
   * @param {boolean} options.withCredentials
   * @param {(object|Headers)} options.headers
   * @param {(string|FormData)} options.body
   */
  dispatchRequest(url, options) {
    const {
      method, timeout, withCredentials, headers, body,
    } = options;

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.open(method, url);

      xhr.timeout = timeout;

      xhr.withCredentials = withCredentials;

      if (headers && Object.keys(headers).length > 0) {
        Object.keys(headers).forEach((key) => {
          xhr.setRequestHeader(key, headers[key]);
        });
      }

      if (this.config.withOnUploadProgress
        && typeof this.config.withOnUploadProgress === 'function') {
        const handleUploadProgress = this.config.withOnUploadProgress;
        xhr.upload.onprogress = function handleProgress(e) {
          const { loaded, total } = e;
          handleUploadProgress(loaded, total);
        };
      }

      if (this.config.withOnDownloadProgress
        && typeof this.config.withOnDownloadProgress === 'function') {
        const handleDownloadProgress = this.config.withOnDownloadProgress;
        xhr.onprogress = function handleProgress(e) {
          const { loaded, total } = e;
          handleDownloadProgress(loaded, total);
        };
      }

      xhr.onloadend = function handleLoad() {
        if (xhr.status) {
          const response = createResponse(url, xhr);
          resolve(response);
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
   * @param {string} [url]
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
   * @param {object} [options]
   * @param {string} [options.method]
   * @param {(object|Headers)} [options.headers]
   * @param {any} [options.body]
   */
  buildRequestOptions(options = {}) {
    const requestOptions = {
      method: options.method || 'GET',
      timeout: this.config.timeout || 0,
      withCredentials: undefined,
      headers: { ...(options.headers || {}) },
      body: options.body,
    };

    if (this.config.credentials === 'include') {
      requestOptions.withCredentials = true;
    } else if (this.config.credentials === 'omit') {
      requestOptions.withCredentials = false;
    }

    if (this.config.authorization) {
      if (typeof this.config.authorization === 'string') {
        requestOptions.headers.Authorization = this.config.authorization;
      }

      if (typeof this.config.authorization === 'function') {
        requestOptions.headers.Authorization = this.config.authorization();
      }
    }

    if (this.config.type === 'text') {
      requestOptions.headers['Content-Type'] = 'text/plain;charset=UTF-8';
      requestOptions.body = transformToText(options.body);
    }

    if (this.config.type === 'json') {
      requestOptions.headers['Content-Type'] = 'application/json;charset=UTF-8';
      requestOptions.body = transformToJson(options.body);
    }

    if (this.config.type === 'form') {
      requestOptions.body = transformToForm(options.body);
    }

    return requestOptions;
  }

  /**
   * @param {string} tag
   * @param {XMLHttpRequest} xhr
   */
  tagXHR(tag, xhr) {
    Object.keys(this.xhrTagMap).forEach((t) => {
      this.xhrTagMap[t] = this.xhrTagMap[t].filter(
        (r) => (r.readyState > 0 && r.readyState < 4),
      );
    });

    if (tag) {
      this.xhrTagMap[tag] = [...(this.xhrTagMap[tag] || []), xhr];
    }
  }
}

/**
 * @param {string} url
 * @param {XMLHttpRequest} xhr
 */
function createResponse(url, xhr) {
  if (xhr && xhr.status && xhr.getAllResponseHeaders) {
    const { status, statusText, response: body } = xhr;
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

    return response;
  }

  return undefined;
}

/**
 * @param {Response} response
 */
function handleResponse(response) {
  if (response && response instanceof Response
    && response.text && typeof response.text === 'function'
  ) {
    return new Promise((resolve, reject) => {
      response.text()
        .then((text) => {
          const {
            ok,
            status,
            statusText,
          } = (response || {});
          let json;

          try {
            json = JSON.parse(text);
          } catch (e) {
            json = undefined;
          }

          const data = json || text || undefined;

          if (!ok) {
            const error = new Error(`${status} ${statusText}`);
            error.status = status;
            error.statusText = statusText;
            error.data = data;
            throw error;
          }

          resolve(data);
        })
        .catch((e) => {
          reject(e);
        });
    });
  }

  return undefined;
}

/**
 * @param {object} params
 */
function transformToText(params) {
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
 */
function transformToJson(params) {
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
 */
function transformToForm(params) {
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

export default new Gotch();
