
# async-chunk-requests

### Fetch data patterns in javascript with promises

1. All - start all requests at the same time  
2. Series - process request one by one  
3. Chunks - process requests in chunks

Results for 2000 requests:  
`all`: ❌ Fetch error (too many requests)  
`series`: ✅ 11 min 35 s  
`chunks`: ✅ 1 min 12 s


##### Example
```js
const { getIdList, fetchPhoto, chunks } = require('./helpers');

const t0 = Date.now();
chunks(getIdList(150), fetchPhoto, 50)
  .then(res => {
    const t1 = Date.now();
    console.log(res)
    console.log(`Fetch time: ${t1 - t0} ms`);
  });

```
