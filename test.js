const gotch = require('.');

(async () => {
  setTimeout(() => {
    // gotch.cancel('q');
  }, 0);
  try {
    const res = await gotch.withTag('q').withTimeout(2000).post('https://api.bridge.bsos.tech/users/me/credentials', {
      // email: 'bob@gmail.com',
      // password: 'bobobobo',
    });

    // console.log(res.data.toString());
    console.log('wating...');
  } catch (e) {
    console.log(e);
  }
})();

// gotch.post('http://localhost:3000/users/me/credentials', {
//   email: 'bob@gmail.com',
//   password: 'bobobobo',
// });

// gotch.get('https://www.google.com');
