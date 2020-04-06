function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(n);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

var _require = require('follow-redirects'),
    http = _require.http,
    https = _require.https;

var urlLib = require('url');

var Gotch = /*#__PURE__*/function () {
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
  function Gotch() {
    var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Gotch);

    this.reqTagMap = {};
    this.config = _objectSpread2({}, config);
    this.initConfig = _objectSpread2({}, config);
    this.restoreConfig();
  }
  /**
   * @param {GotchConfig} [config]
   */


  _createClass(Gotch, [{
    key: "create",
    value: function create() {
      var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      return new Gotch(config);
    }
    /**
     * @param {string} baseURL
     */

  }, {
    key: "withBaseURL",
    value: function withBaseURL(baseURL) {
      this.config.baseURL = baseURL;
      return this;
    }
    /**
     * @param {string} requestType
     */

  }, {
    key: "withRequestType",
    value: function withRequestType(requestType) {
      this.config.requestType = requestType;
      return this;
    }
    /**
     * @param {string} responseType
     */

  }, {
    key: "withResponseType",
    value: function withResponseType(responseType) {
      this.config.responseType = responseType;
      return this;
    }
    /**
     * @param {string} tag
     */

  }, {
    key: "withTag",
    value: function withTag(tag) {
      this.config.tag = tag;
      return this;
    }
    /**
     * @param {number} timeout
     */

  }, {
    key: "withTimeout",
    value: function withTimeout(timeout) {
      this.config.timeout = timeout;
      return this;
    }
    /**
     * @param {string} credentials
     */

  }, {
    key: "withCredentials",
    value: function withCredentials(credentials) {
      this.config.credentials = credentials;
      return this;
    }
    /**
     * @param {(string|function)} authorization
     */

  }, {
    key: "withAuthorization",
    value: function withAuthorization(authorization) {
      this.config.authorization = authorization;
      return this;
    }
    /**
     * @param {function} handleEvent
     */

  }, {
    key: "withOnUploadProgress",
    value: function withOnUploadProgress(handleEvent) {
      this.config.withOnUploadProgress = handleEvent;
      return this;
    }
    /**
     * @param {function} handleEvent
     */

  }, {
    key: "withOnDownloadProgress",
    value: function withOnDownloadProgress(handleEvent) {
      this.config.withOnDownloadProgress = handleEvent;
      return this;
    }
    /**
     * @param {string} url
     */

  }, {
    key: "get",
    value: function get(url) {
      return this.request(url, {
        method: 'GET'
      });
    }
    /**
     * @param {string} url
     * @param {object} [params]
     */

  }, {
    key: "post",
    value: function post(url) {
      var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
      return this.request(url, {
        method: 'POST',
        body: params
      });
    }
    /**
     * @param {string} url
     * @param {object} [params]
     */

  }, {
    key: "put",
    value: function put(url) {
      var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
      return this.request(url, {
        method: 'PUT',
        body: params
      });
    }
    /**
     * @param {string} url
     * @param {object} [params]
     */

  }, {
    key: "patch",
    value: function patch(url) {
      var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
      return this.request(url, {
        method: 'PATCH',
        body: params
      });
    }
    /**
     * @param {string} url
     */

  }, {
    key: "delete",
    value: function _delete(url) {
      return this.request(url, {
        method: 'DELETE'
      });
    }
    /**
     * @param {string} url
     * @param {GotchRequestOptions} [options]
     */

  }, {
    key: "request",
    value: function request(url) {
      var _this = this;

      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var responseType = this.config.responseType;
      var requestURL = this.buildRequestURL(url);
      var requestOptions = this.buildRequestOptions(options);
      var promise = this.dispatchRequest(requestURL, requestOptions).then(function (res) {
        return _this.handleResponse(responseType, res);
      });
      this.restoreConfig();
      return promise;
    }
    /**
     * @param {string} tag
     */

  }, {
    key: "cancel",
    value: function cancel(tag) {
      var requests = this.reqTagMap[tag];

      if (requests) {
        requests.forEach(function (request) {
          if (request && request.abort) {
            request.abort();
          }
        });
      }
    }
    /**
     * @ignore
     */

  }, {
    key: "restoreConfig",
    value: function restoreConfig() {
      this.config = {
        baseURL: this.initConfig.baseURL || undefined,
        requestType: this.initConfig.requestType || 'json',
        responseType: this.initConfig.responseType || 'json',
        tag: this.initConfig.tag || undefined,
        timeout: this.initConfig.timeout || 0,
        credentials: this.initConfig.credentials || 'same-origin',
        authorization: this.initConfig.authorization || undefined,
        withOnUploadProgress: this.initConfig.withOnUploadProgress || undefined,
        withOnDownloadProgress: this.initConfig.withOnDownloadProgress || undefined
      };
    }
    /**
     * @param {string} tag
     * @param {(XMLHttpRequest|Request)} request
     * @ignore
     */

  }, {
    key: "tagRequest",
    value: function tagRequest(tag, request) {
      var _this2 = this;

      Object.keys(this.reqTagMap).forEach(function (t) {
        _this2.reqTagMap[t] = _this2.reqTagMap[t].filter(function (r) {
          return r.readyState > 0 && r.readyState < 4;
        });
      });

      if (tag) {
        this.reqTagMap[tag] = [].concat(_toConsumableArray(this.reqTagMap[tag] || []), [request]);
      }
    }
    /**
     * @param {string} [url]
     * @ignore
     */

  }, {
    key: "buildRequestURL",
    value: function buildRequestURL() {
      var url = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      var requestURL;

      if (/^([a-z][a-z\d+-.]*:)?\/\//i.test(url)) {
        requestURL = url;
      } else {
        requestURL = "".concat(this.config.baseURL).concat(url);
      }

      return requestURL;
    }
    /**
     * @param {GotchRequestOptions} [options]
     * @ignore
     */

  }, {
    key: "buildRequestOptions",
    value: function buildRequestOptions() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var requestOptions = {
        method: options.method || 'GET',
        timeout: this.config.timeout || 0,
        withCredentials: undefined,
        responseType: 'text',
        headers: _objectSpread2({}, options.headers || {}),
        body: options.body
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

  }, {
    key: "dispatchRequest",
    value: function dispatchRequest(url, options) {
      var req;

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

  }, {
    key: "dispatchServerRequest",
    value: function dispatchServerRequest(url, options) {
      var _this3 = this;

      var method = options.method,
          timeout = options.timeout,
          headers = options.headers,
          body = options.body;
      return new Promise(function (resolve, reject) {
        var parsedURL = urlLib.parse(url);
        var req = (parsedURL.protocol === 'https:' ? https : http).request({
          method: method,
          headers: headers,
          hostname: parsedURL.hostname,
          path: parsedURL.path,
          port: parsedURL.port
        }, function (res) {
          resolve(res);
        });

        if (timeout) {
          req.setTimeout(timeout);
        }

        req.on('timeout', function () {
          req.abort();
          var error = new Error('Request timeout');
          reject(error);
        });
        req.on('abort', function () {
          var error = new Error('Request aborted');
          reject(error);
        });
        req.on('error', function () {
          var error = new Error('Request failed');
          reject(error);
        });
        req.end(body);

        _this3.tagRequest(_this3.config.tag, req);
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

  }, {
    key: "dispatchClientRequest",
    value: function dispatchClientRequest(url, options) {
      var _this4 = this;

      var method = options.method,
          timeout = options.timeout,
          withCredentials = options.withCredentials,
          responseType = options.responseType,
          headers = options.headers,
          body = options.body;
      return new Promise(function (resolve, reject) {
        var req = new XMLHttpRequest();
        req.open(method, url);
        req.timeout = timeout;
        req.withCredentials = withCredentials;
        req.responseType = responseType;

        if (headers && Object.keys(headers).length > 0) {
          Object.keys(headers).forEach(function (key) {
            req.setRequestHeader(key, headers[key]);
          });
        }

        if (_this4.config.withOnUploadProgress && typeof _this4.config.withOnUploadProgress === 'function') {
          var handleUploadProgress = _this4.config.withOnUploadProgress;

          req.upload.onprogress = function handleProgress(e) {
            handleUploadProgress(e);
          };
        }

        if (_this4.config.withOnDownloadProgress && typeof _this4.config.withOnDownloadProgress === 'function') {
          var handleDownloadProgress = _this4.config.withOnDownloadProgress;

          req.onprogress = function handleProgress(e) {
            handleDownloadProgress(e);
          };
        }

        req.onloadend = function handleLoad() {
          if (req.status) {
            var status = req.status,
                statusText = req.statusText,
                responseURL = req.responseURL,
                resBody = req.response;
            var resHeaders = {};

            if (req.getAllResponseHeaders) {
              var lines = req.getAllResponseHeaders().trim().split('\n');
              lines.forEach(function (line) {
                var parts = line.split(': ');
                var name = parts.shift();
                var value = parts.join(': ');
                resHeaders[name] = value;
              });
            }

            var res = new Response(resBody, {
              status: status,
              statusText: statusText,
              headers: resHeaders
            });
            Object.defineProperty(res, 'url', {
              value: url
            });
            Object.defineProperty(res, 'responseURL', {
              value: responseURL
            });
            resolve(res);
          } else {
            var error = new Error('Request failed');
            reject(error);
          }
        };

        req.ontimeout = function handleTimeout() {
          var error = new Error('Request timeout');
          reject(error);
        };

        req.onabort = function handleAbort() {
          var error = new Error('Request aborted');
          reject(error);
        };

        req.send(body);

        _this4.tagRequest(_this4.config.tag, req);
      });
    }
    /**
     * @param {string} type
     * @param {Response} response
     * @ignore
     */

  }, {
    key: "handleResponse",
    value: function handleResponse(type, response) {
      if (typeof XMLHttpRequest === 'undefined') {
        var statusCode = response.statusCode,
            statusMessage = response.statusMessage;
        return new Promise(function (resolve, reject) {
          var chunks = [];
          response.on('data', function (chunk) {
            chunks.push(chunk);
          });
          response.on('end', function () {
            var data = Buffer.concat(chunks);

            if (statusCode >= 200 && statusCode < 300) {
              response.data = data;
              resolve(response);
            } else {
              var error = new Error("".concat(statusCode, " ").concat(statusMessage)); // error.response = response;

              reject(error);
            }
          });
          response.on('error', function (e) {
            reject(e);
          });
        });
      }

      if (response instanceof Response) {
        var res = response.clone();
        var ok = response.ok,
            status = response.status,
            statusText = response.statusText;

        if (type === 'text' && typeof response.text === 'function') {
          return new Promise(function (resolve, reject) {
            response.text().then(function (text) {
              res.data = text;

              if (!ok) {
                var error = new Error("".concat(status, " ").concat(statusText));
                error.response = res;
                throw error;
              }

              resolve(res);
            })["catch"](function (e) {
              reject(e);
            });
          });
        }

        if (type === 'json' && typeof response.text === 'function') {
          return new Promise(function (resolve, reject) {
            response.text().then(function (text) {
              try {
                res.data = JSON.parse(text);
              } catch (e) {
                res.data = text;
              }

              if (!ok) {
                var error = new Error("".concat(status, " ").concat(statusText));
                error.response = res;
                throw error;
              }

              resolve(res);
            })["catch"](function (e) {
              reject(e);
            });
          });
        }

        if (type === 'blob' && typeof response.blob === 'function') {
          return new Promise(function (resolve, reject) {
            response.blob().then(function (blob) {
              res.data = blob;

              if (!ok) {
                var error = new Error("".concat(status, " ").concat(statusText));
                error.response = res;
                throw error;
              }

              resolve(res);
            })["catch"](function (e) {
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

  }, {
    key: "transformToText",
    value: function transformToText(params) {
      if (params && typeof FormData === 'function' && params instanceof FormData) {
        return new URLSearchParams(params).toString();
      }

      if (params && _typeof(params) === 'object') {
        return JSON.stringify(params);
      }

      return params;
    }
    /**
     * @param {object} params
     * @ignore
     */

  }, {
    key: "transformToJson",
    value: function transformToJson(params) {
      if (params && typeof FormData === 'function' && params instanceof FormData) {
        var parsedParams = {};
        params.forEach(function (value, key) {
          if (value === undefined) {
            return;
          }

          if (!parsedParams[key]) {
            parsedParams[key] = value;
            return;
          }

          parsedParams[key] = [].concat(_toConsumableArray(parsedParams[key]), [value]);
        });
        return JSON.stringify(parsedParams);
      }

      if (params && _typeof(params) === 'object') {
        return JSON.stringify(params);
      }

      return params;
    }
    /**
     * @param {object} params
     * @ignore
     */

  }, {
    key: "transformToForm",
    value: function transformToForm(params) {
      if (params && typeof FormData === 'function' && params instanceof FormData) {
        return params;
      }

      if (params && _typeof(params) === 'object' && typeof FormData === 'function') {
        var formData = new FormData();
        Object.keys(params).forEach(function (key) {
          var value = params[key];

          if (typeof value === 'function' || value === undefined || value === null) {
            return;
          }

          if (Array.isArray(value)) {
            value.forEach(function (item) {
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
  }]);

  return Gotch;
}();

var gotch = new Gotch();

export default gotch;
