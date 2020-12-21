// https://dev.to/karataev/handling-a-lot-of-requests-in-javascript-with-promises-1kbb

const request = require('request');
const getIdList = n => [...new Array(n)].map((item, i) => i + 1);

const promisifiedRequest = function (options) {
  return new Promise((resolve, reject) => {
    try {
      request(options, (error, response, body) => {
        if (response) {
          return resolve(response);
        }
        if (error) {
          return reject(error);
        }
      });
    }
    catch {
      console.log("failed in promisifiedRequest")
    }
  });
};


async function fetchPhoto(id) {
  const url = `https://jsonplaceholder.typicode.com/photos/${id}`;
  const options = {
    url: url,
    proxy: "http://" + "167.71.194.112:8080",
    method: 'GET',
    gzip: true,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.96 Safari/537.36'
    }
  };
  let response = await promisifiedRequest(options);
  return response.body;
};

function all(items, fn) {
  const promises = items.map(item => fn(item));
  return Promise.all(promises);
}

function series(items, fn) {
  let result = [];
  return items.reduce((acc, item) => {
    acc = acc.then(() => {
      return fn(item).then(res => result.push(res));
    });
    return acc;
  }, Promise.resolve())
    .then(() => result);
}

function splitToChunks(items, chunkSize = 50) {
  const result = [];
  for (let i = 0; i < items.length; i += chunkSize) {
    result.push(items.slice(i, i + chunkSize));
  }
  return result;
}

function chunks(items, fn, chunkSize = 50) {
  let result = [];
  const chunks = splitToChunks(items, chunkSize);
  return series(chunks, chunk => {
    return all(chunk, fn)
      .then(res => result = result.concat(res))
  })
    .then(() => result);
}

module.exports = {
  getIdList,
  fetchPhoto,

  all,
  series,
  chunks
};
