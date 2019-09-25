<p align="center">
  <img src="./docs/logo.png" alt="Gotch" />
</p>

<p align="center">
  A simple, elegant and lightweight HTTP client for browser
</p>

# 

![npm version](https://img.shields.io/npm/v/gotch?style=flat-square)
![install size](https://flat.badgen.net/packagephobia/install/gotch)
![dev dependencies](https://img.shields.io/david/dev/jeremyxgo/gotch?style=flat-square)
![github license](https://img.shields.io/github/license/jeremyxgo/gotch?style=flat-square)

## Features

- Promise based
- Configurable and chainable API
- Transform JSON data automatically
- Monitor download and upload progress
- Cancel requests
- Less than 30kb

## Installation

Install via npm/yarn
```bash
$ npm install gotch --save
```
```bash
$ yarn add gotch
```
or via CDN
```html
<script src="https://unpkg.com/gotch/dist/gotch.js"></script>
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
  .then((data) => {
    console.log(data);
  })
  .catch((error) => {
    console.log(error);
  });

// handle with async/await syntax
// NOTE: you should wrap the following code in an async function
try {
  const data = await gotch.get('/users/1');
  console.log(data);
} catch (e) {
  console.log(error);
}
```

Send a `POST` request
```js
// handle with promise chaining
gotch
  .withType('json')
  .post('/users', {
    firstName: 'Jermey',
    lastName: 'Lin',
  })
  .then((data) => {
    console.log(data);
  })
  .catch((error) => {
    console.log(error);
  });

// handle with async/await syntax
// NOTE: you should wrap the following code in an async function
try {
  const data = await gotch
    .withType('json')
    .post('/users', {
      firstName: 'Jermey',
      lastName: 'Lin',
    });
  console.log(data);
} catch (error) {
  console.log(error);
}
```

Create an instance

```js
const exampleAPI = gotch.create({
  baseURL: 'https://example.com/api/v1',
  timeoot: 2000,
  type: 'json',
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

  // `type` determines how Gotch transform your request params
  // and set a coresponding Content-Type in request headers automa
  // Acceptable values are: 'text', 'json', 'form'
  // - 'text': 'text/plain;charset=UTF-8'
  // - 'json': 'application/json;charset=UTF-8'
  // - 'form': automatically generated by browser
  type: '',

  // `tag` will be used to grouping requests, request(s) with a tag
  // can be canceled by using .cancel(tag)
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

  // `onUploadProgress` is a function to handle upload progress
  // - fn(loaded, total)
  onUploadProgress: undefined,

  // `onDownloadProgress` is a function to handle download progress
  // - fn(loaded, total)
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

### .withTag(tag)
Overwrite `tag` for next request
```js
gotch.withTag('get_user_req');
// returns a Gotch instance
```

### .withType(type)
Overwrite `type` for next request
```js
gotch.withType('json');
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
gotch.withAuthorization('Bearer xxxxx.yyyyy.zzzzz');
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
gotch.withOnUploadProgress((loaded, total) => {
  console.log(loaded / total);
});
// returns a Gotch instance
```

### .withOnDownloadProgress(handleEvent)
Overwrite `onDownloadProgress` for next request
```js
gotch.withOnDownloadProgress((loaded, total) => {
  console.log(loaded / total);
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
gotch.cancel('get_user_req');
// all the requests have the `get_user_req` tag will be aborted
```

## Recommended way to organize your API

Create an API entry file to hold the `Gotch` instances and separate your API by domains or anyway you like:

```js
// api/index.js
import UserAPI from './UserAPI';
import ItemAPI from './ItemAPI';

class API {
  constructor() {
    this.userAPI = new UserAPI();
    this.itemAPI = new ItemAPI();
  }
}

export default new API();
```

```js
// api/UsersAPI.js
import gotch from 'gotch';

class UserAPI {
  constructor() {
    this.API = gotch.create({
      baseURL: 'https://example.com/api/v1/users',
      type: 'json',
    });
  }

  getUser(id) {
    return this.API.get(`/${id}`);
  }

  addUser(user) {
    return this.API.post('', user);
  }
}

export default UserAPI;
```

```js
// api/ItemAPI.js
import gotch from 'gotch';

class ItemAPI {
  constructor() {
    this.API = gotch.create({
      baseURL: 'https://example.com/api/v1/items',
      type: 'json',
    });
  }

  getItems() {
    return this.API.get();
  }

  getItem(id) {
    return this.API.get(`/${id}`);
  }

  removeItem(id) {
    return this.API.delete(`/${id}`);
  }
}

export default ItemAPI;
```

Import API entry and use the `Gotch` instance as how you use it before:

```js
// someFile.js
import api from 'your-relative-path/api';
// ...
try {
  const user = await api.userAPI.getUser(1);
  console.log(user);
} catch (e) {
  console.log(e);
}
// ...
```

## License

MIT
