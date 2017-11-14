// The `encodeToken` function encodes a string for use as a JSON pointer token
// replacing the values '~' with '~0' and '/' with '~1'.

// ## Usage
//
// ```javascript
// import { encodeToken } from '@jdw/jst';
//
// encodeToken('~/home') // '~0~1home'
// ```
//
// **Arguments**
// - `token: string A string to encode
//
// **Returns**
// - `string`: The escaped string
//
// **Throws**
// - {Error}: If something went wrong.

// ## Implementation

const encodeToken = (pointer: string) => {
  return pointer
    .replace(new RegExp('~', 'g'), '~0')
    .replace(new RegExp('/', 'g'), '~1');
};

export {
  encodeToken,
};
