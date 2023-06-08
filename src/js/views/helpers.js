import { TIMEOUT_SEC } from '../config';

// Returns a rejcet promise after a certain period of time
const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const AJAX = async function (url, uploadData = undefined) {
  try {
    const fetchPro = uploadData
      ? fetch(url, {
          method: 'POST',
          // Snippets of text that are information about the request itself - data will be in JSON format here
          headers: {
            'Content-type': 'application/json',
          },
          // Data we want to send
          body: JSON.stringify(uploadData),
        })
      : fetch(url);

    // Takes the promise that is fulfilled first - promise are passed as a list
    const response = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await response.json();

    if (!response.ok) throw new Error(`${data.message} (${response.status})`);
    return data;
  } catch (err) {
    // To handle error in model.js - Rethrowing the error
    throw err;
  }
};

// export const getJSON = async function (url) {
//   try {
//     const fetchPro = fetch(url);
//     // Takes the promise that is fulfilled first - promise are passed as a list
//     const response = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
//     const data = await response.json();

//     if (!response.ok) throw new Error(`${data.message} (${response.status})`);
//     return data;
//   } catch (err) {
//     // To handle error in model.js - Rethrowing the error
//     throw err;
//   }
// };

// export const sendJSON = async function (url, uploadData) {
//   try {
//     // const fetchPro = fetch(url, {
//     //   method: 'POST',
//     //   // Snippets of text that are information about the request itself - data will be in JSON format here
//     //   headers: {
//     //     'Content-type': 'application/json',
//     //   },
//     //   // Data we want to send
//     //   body: JSON.stringify(uploadData),
//     // });

//     // Takes the promise that is fulfilled first - promise are passed as a list
//     const response = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
//     const data = await response.json();

//     if (!response.ok) throw new Error(`${data.message} (${res.status})`);
//     return data;
//   } catch (err) {
//     // To handle error in model.js - Rethrowing the error
//     throw err;
//   }
// };
