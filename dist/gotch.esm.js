function t(e){return(t="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(e)}function e(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function n(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function r(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}function o(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);e&&(r=r.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,r)}return n}function i(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?o(Object(n),!0).forEach((function(e){r(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}function a(t){return function(t){if(Array.isArray(t))return s(t)}(t)||function(t){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(t))return Array.from(t)}(t)||function(t,e){if(!t)return;if("string"==typeof t)return s(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);"Object"===n&&t.constructor&&(n=t.constructor.name);if("Map"===n||"Set"===n)return Array.from(n);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return s(t,e)}(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function s(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,r=new Array(e);n<e;n++)r[n]=t[n];return r}var u=require("follow-redirects"),c=u.http,f=u.https,h=require("url"),l=new(function(){function r(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};e(this,r),this.config=i({},t),this.initConfig=i({},t),this.requestTagMap={},this.restoreConfig()}var o,s,u;return o=r,(s=[{key:"create",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return new r(t)}},{key:"withBaseURL",value:function(t){return this.config.baseURL=t,this}},{key:"withRequestType",value:function(t){return this.config.requestType=t,this}},{key:"withResponseType",value:function(t){return this.config.responseType=t,this}},{key:"withTag",value:function(t){return this.config.tag=t,this}},{key:"withTimeout",value:function(t){return this.config.timeout=t,this}},{key:"withCredentials",value:function(t){return this.config.credentials=t,this}},{key:"withAuthorization",value:function(t){return this.config.authorization=t,this}},{key:"withOnUploadProgress",value:function(t){return this.config.withOnUploadProgress=t,this}},{key:"withOnDownloadProgress",value:function(t){return this.config.withOnDownloadProgress=t,this}},{key:"get",value:function(t){return this.request({url:t,method:"GET"})}},{key:"post",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:void 0;return this.request({url:t,method:"POST",body:e})}},{key:"put",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:void 0;return this.request({url:t,method:"PUT",body:e})}},{key:"patch",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:void 0;return this.request({url:t,method:"PATCH",body:e})}},{key:"delete",value:function(t){return this.request({url:t,method:"DELETE"})}},{key:"request",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return this.dispatchRequest(t)}},{key:"cancel",value:function(t){var e=this.requestTagMap[t];e&&e.forEach((function(t){t&&t.abort&&t.abort()}))}},{key:"restoreConfig",value:function(){this.config={baseURL:this.initConfig.baseURL||void 0,requestType:this.initConfig.requestType||"json",responseType:this.initConfig.responseType||"json",tag:this.initConfig.tag||void 0,timeout:this.initConfig.timeout||0,credentials:this.initConfig.credentials||"same-origin",authorization:this.initConfig.authorization||void 0,withOnUploadProgress:this.initConfig.withOnUploadProgress||void 0,withOnDownloadProgress:this.initConfig.withOnDownloadProgress||void 0}}},{key:"tagRequest",value:function(t,e){var n=this;Object.keys(this.requestTagMap).forEach((function(t){n.requestTagMap[t]=n.requestTagMap[t].filter((function(t){return t.readyState>0&&t.readyState<4}))})),t&&(this.requestTagMap[t]=[].concat(a(this.requestTagMap[t]||[]),[e]))}},{key:"dispatchRequest",value:function(){var t,e=this,n=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},r=this.config,o=r.baseURL,a=r.requestType,s=r.responseType,u=r.tag,c=r.timeout,f=r.credentials,h=r.authorization,l=r.withOnUploadProgress,p=r.withOnDownloadProgress,d={url:n.url,method:n.method||"GET",tag:u,timeout:c||0,withCredentials:void 0,responseType:"text",headers:i({},n.headers||{}),body:n.body,handleUploadProgress:l,handleDownloadProgress:p};return/^([a-z][a-z\d+-.]*:)?\/\//i.test(n.url)||(d.url="".concat(o).concat(n.url)),"include"===f?d.withCredentials=!0:"omit"===f&&(d.withCredentials=!1),d.headers.authorization&&(d.headers.Authorization=d.headers.authorization,delete d.headers.authorization),h&&!d.headers.Authorization&&("string"==typeof h&&(d.headers.Authorization=h),"function"==typeof h&&(d.headers.Authorization=h())),"text"===a&&(d.headers["Content-Type"]="text/plain;charset=UTF-8",d.body=this.transformToText(n.body)),"json"===a&&(d.headers["Content-Type"]="application/json;charset=UTF-8",d.body=this.transformToJson(n.body)),"form"===a&&(d.body=this.transformToForm(n.body)),"text"!==s&&"json"!==s||(d.responseType="text"),"blob"===s&&(d.responseType="blob"),t="undefined"==typeof XMLHttpRequest?this.dispatchServerRequest(d).then((function(t){return e.transformResponse(s,t)})):this.dispatchClientRequest(d).then((function(t){return e.transformResponse(s,t)})),this.restoreConfig(),t}},{key:"dispatchServerRequest",value:function(t){var e=this,n=t.url,r=t.method,o=t.tag,i=t.timeout,a=t.headers,s=t.body;return new Promise((function(t,u){var l=h.parse(n),p=("https:"===l.protocol?f:c).request({method:r,headers:a,hostname:l.hostname,path:l.path,port:l.port},(function(e){t(e)}));i&&p.setTimeout(i),p.on("timeout",(function(){p.abort();var t=new Error("Request timeout");u(t)})),p.on("abort",(function(){var t=new Error("Request aborted");u(t)})),p.on("error",(function(){var t=new Error("Request failed");u(t)})),p.end(s),e.tagRequest(o,p)}))}},{key:"dispatchClientRequest",value:function(t){var e=this,n=t.url,r=t.method,o=t.tag,i=t.timeout,a=t.withCredentials,s=t.responseType,u=t.headers,c=t.body,f=t.handleUploadProgress,h=t.handleDownloadProgress;return new Promise((function(t,l){var p=new XMLHttpRequest;p.open(r,n),p.timeout=i,p.withCredentials=a,p.responseType=s,u&&Object.keys(u).length>0&&Object.keys(u).forEach((function(t){p.setRequestHeader(t,u[t])})),"function"==typeof f&&(p.upload.onprogress=f),"function"==typeof h&&(p.onprogress=h),p.onloadend=function(){if(p.status){var e=p.status,r=p.statusText,o=p.responseURL,i=p.response,a={};p.getAllResponseHeaders&&p.getAllResponseHeaders().trim().split("\n").forEach((function(t){var e=t.split(": "),n=e.shift(),r=e.join(": ");a[n]=r}));var s=new Response(i,{status:e,statusText:r,headers:a});Object.defineProperty(s,"url",{value:n}),Object.defineProperty(s,"responseURL",{value:o}),t(s)}else{var u=new Error("Request failed");l(u)}},p.ontimeout=function(){var t=new Error("Request timeout");l(t)},p.onabort=function(){var t=new Error("Request aborted");l(t)},p.send(c),e.tagRequest(o,p)}))}},{key:"transformResponse",value:function(t,e){var n;if("undefined"==typeof XMLHttpRequest){var r=e.statusCode,o=e.statusMessage;n=new Promise((function(t,n){var i=[];e.on("data",(function(t){i.push(t)})),e.on("end",(function(){var a=Buffer.concat(i);if(r>=200&&r<300)e.data=a,t(e);else{var s=new Error("".concat(r," ").concat(o));n(s)}})),e.on("error",(function(t){n(t)}))}))}else{var i=e.clone(),a=e.ok,s=e.status,u=e.statusText;"text"===t&&"function"==typeof e.text&&(n=new Promise((function(t,n){e.text().then((function(e){if(i.data=e,!a){var n=new Error("".concat(s," ").concat(u));throw n.response=i,n}t(i)})).catch((function(t){n(t)}))}))),"json"===t&&"function"==typeof e.text&&(n=new Promise((function(t,n){e.text().then((function(e){try{i.data=JSON.parse(e)}catch(t){i.data=e}if(!a){var n=new Error("".concat(s," ").concat(u));throw n.response=i,n}t(i)})).catch((function(t){n(t)}))}))),"blob"===t&&"function"==typeof e.blob&&(n=new Promise((function(t,n){e.blob().then((function(e){if(i.data=e,!a){var n=new Error("".concat(s," ").concat(u));throw n.response=i,n}t(i)})).catch((function(t){n(t)}))})))}return n}},{key:"transformToText",value:function(e){return e&&"function"==typeof FormData&&e instanceof FormData?new URLSearchParams(e).toString():e&&"object"===t(e)?JSON.stringify(e):e}},{key:"transformToJson",value:function(e){if(e&&"function"==typeof FormData&&e instanceof FormData){var n={};return e.forEach((function(t,e){void 0!==t&&(n[e]?n[e]=[].concat(a(n[e]),[t]):n[e]=t)})),JSON.stringify(n)}return e&&"object"===t(e)?JSON.stringify(e):e}},{key:"transformToForm",value:function(e){if(e&&"function"==typeof FormData&&e instanceof FormData)return e;if(e&&"object"===t(e)&&"function"==typeof FormData){var n=new FormData;return Object.keys(e).forEach((function(t){var r=e[t];"function"!=typeof r&&null!=r&&(Array.isArray(r)?r.forEach((function(e){n.append(t,e)})):r instanceof File?n.append(t,r):n.append(t,JSON.stringify(r)))})),n}return e}}])&&n(o.prototype,s),u&&n(o,u),r}());export default l;
