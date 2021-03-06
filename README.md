<p align="center">
  <img src="./docs/logo.png" alt="Gotch" />
</p>

<p align="center">
  A simple, elegant and lightweight HTTP client for browser
</p>

# 

[![npm version](https://img.shields.io/npm/v/gotch?style=flat-square)](https://www.npmjs.com/package/gotch)
[![npm bundle size](https://img.shields.io/bundlephobia/min/gotch?style=flat-square)](https://bundlephobia.com/result?p=gotch)
[![install size](https://flat.badgen.net/packagephobia/install/gotch)](https://packagephobia.now.sh/result?p=gotch)
[![dev dependencies](https://img.shields.io/david/dev/jeremyxgo/gotch?style=flat-square)](https://david-dm.org/jeremyxgo/gotch?type=dev)
![github license](https://img.shields.io/github/license/jeremyxgo/gotch?style=flat-square)

## Features

- Promise based
- Configurable and chainable API
- Automatically transforms for JSON data 
- Supports request body transforms
- Monitor download and upload progress
- Cancel requests

## Installation

Using npm:
```bash
$ npm install gotch --save
```

Using yarn:
```bash
$ yarn add gotch
```

Using CDN:
```html
<script src="https://unpkg.com/gotch/dist/gotch.min.js"></script>
```

## Basic Usage

Import

```js
import gotch from 'gotch';
```

Send a `GET` request
```js
// handle with promise chaining
gotch
  .get('/users/1')
  .then((res) => {
    console.log(res);
  })
  .catch((e) => {
    console.log(e);
  });

// handle with async/await syntax
// NOTE: you should wrap the following code in an async function
try {
  const res = await gotch.get('/users/1');
  console.log(res);
} catch (e) {
  console.log(e);
}
```

Send a `POST` request
```js
// handle with promise chaining
gotch
  .post('/users', {
    firstName: 'Jermey',
    lastName: 'Lin',
  })
  .then((res) => {
    console.log(res);
  })
  .catch((e) => {
    console.log(e);
  });

// handle with async/await syntax
// NOTE: you should wrap the following code in an async function
try {
  const res = await gotch
    .post('/users', {
      firstName: 'Jermey',
      lastName: 'Lin',
    });
  console.log(res);
} catch (e) {
  console.log(e);
}
```

Create an instance

```js
const exampleAPI = gotch.create({
  baseURL: 'https://example.com/api/v1',
  timeout: 2000,
});

// exampleAPI
//   .get(...)
//   .then(...)
//   .catch(...);
```

## Instance configuration

Available configuration for creating an instance by using `.create([config])`

```js
{
  // `baseURL` will be prepended to the request url unless it is absolute`
  baseURL: '',

  // `requestType` determines how Gotch transform your request parameters and
  // set a coresponding Content-Type in request headers automatically
  // Acceptable values are: 'text', 'json', 'form'
  // - 'text': 'text/plain;charset=UTF-8'
  // - 'json': 'application/json;charset=UTF-8'
  // - 'form': automatically generated by browser
  requestType: 'json',

  // `responseType` determines how Gotch transform your response data
  // Acceptable values are: 'text', 'json', 'blob'
  // - 'text': response.data will be a string
  // - 'json': response.data will be a object, fallback to 'text' if not parsable
  // - 'blob': response.data will be a blob
  responseType: 'json',

  // `tag` will be used to grouping requests, request(s) with a tag can 
  // be canceled by using .cancel(tag)
  tag: '',

  // `timeout` is a number of milliseconds, if the request takes longer
  // than this number, it will be aborted
  timeout: 0,

  // `credentials` determines whether or not cross-site Access-Control
  // requests should be made using credentials
  // Acceptable values are: 'include', 'same-origin', 'omit'
  credentials: 'same-origin',

  // `authorization` is a string or a function that returns a string which
  // to authenticate a user agent with a server
  authorization: undefined,

  // `onUploadProgress` is a function to handle upload progress event
  onUploadProgress: undefined,

  // `onDownloadProgress` is a function to handle download progress event
  onDownloadProgress: undefined,
}
```

## Request options

Available options for sending a request by using `.request(url[, options])`

```js
{
  // `method` is the request method
  method: 'GET',

  // `headers` are custom headers to be sent with the request
  headers: {},

  // `body` is the data to be sent as the request body
  body: undefined,
}
```

## API

> **NOTE:** `.with*` methods are chainable and can be used to overwrite the instance configuration, but the overwritten configuration will **just works once for the next request**, so if you want to reuse the same configuration multiple times, please create an instance by using `.create([config])`

### .create([config])
Create a new instance of `Gotch`
```js
gotch.create({
  baseURL: 'https://example.com/api/v1',
});
// returns a Gotch instance
```

### .withBaseURL(baseURL)
Overwrite `baseURL` for next request
```js
gotch.withBaseURL('https://example.com/api/v1');
// returns a Gotch instance
```

### .withRequestType(requestType)
Overwrite `requestType` for next request
```js
gotch.withRequestType('json');
// returns a Gotch instance
```

### .withResponseType(responseType)
Overwrite `responseType` for next request
```js
gotch.withResponseType('json');
// returns a Gotch instance
```

### .withTag(tag)
Overwrite `tag` for next request
```js
gotch.withTag('get-user-req');
// returns a Gotch instance
```

### .withTimeout(timeout)
Overwrite `timeout` for next request
```js
gotch.withTimeout(2000);
// returns a Gotch instance
```

### .withCredentials(credentials)
Overwrite `credentials` for next request
```js
gotch.withCredentials('include');
// returns a Gotch instance
```

### .withAuthorization(authorization)
Overwrite `authorization` for next request
```js
gotch.withAuthorization('Bearer ***********');
// returns a Gotch instance

// or 
gotch.withAuthorization(() => {
  const token = window.localStorage.getItem('token');
  return `Bearer ${token}`;
});
// returns a Gotch instance
```

### .withOnUploadProgress(handleEvent)
Overwrite `onUploadProgress` for next request
```js
gotch.withOnUploadProgress((e) => {
  console.log(e.loaded / e.total);
});
// returns a Gotch instance
```

### .withOnDownloadProgress(handleEvent)
Overwrite `onDownloadProgress` for next request
```js
gotch.withOnDownloadProgress((e) => {
  console.log(e.loaded / e.total);
});
// returns a Gotch instance
```

### .request(url[, options])
Send a customized request
```js
gotch.request('/users', {
  method: 'POST',
  headers: {
    Authorization: 'Bearer xxxxx.yyyyy.zzzzz',
    'Content-Type': 'application/json;charset=UTF-8',
  },
  body: '{"firstName":"Jeremy","lastName":"Lin"}'
});
// returns a promise
```

### .get(url)
Send a `GET` request
```js
gotch.get('/users/1');
// returns a promise
```

### .post(url[, params])
Send a `POST` request
```js
gotch.post('/users', {
  firstName: 'Jeremy',
  lastName: 'Lin',
});
// returns a promise
```

### .put(url[, params])
Send a `PUT` request
```js
gotch.put('/users/1', {
  firstName: 'Jeremy',
  lastName: 'Lin',
});
// returns a promise
```

### .patch(url[, params])
Send a `PATCH` request
```js
gotch.patch('/users/1', {
  age: 99,
});
// returns a promise
```

### .delete(url)
Send a `DELETE` request
```js
gotch.delete('/users/1');
// returns a promise
```

### .cancel(tag)
Cancel request(s) grouping by the same tag
```js
gotch.cancel('get-user-req');
// all the requests have the `get-user-req` tag will be aborted
```

## License

MIT
