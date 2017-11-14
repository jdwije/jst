// The `decodeToken` function unescapes a previously escaped JSON pointer reference
// token replacing the values '~1' with '/' and '~0' with '~'.

// ## Usage
//
// ```javascript
// import { decodeToken } from '@jdw/jst';
//
// decodeToken('~0~1home') // '~/home'
// ```
//
// **Arguments**
// - `token: string A string to decode
//
// **Returns**
// - `string`: The decoded string.
//
// **Throws**
// - {Error}: If something went wrong.

// ## Implementation

const decodeToken = (pointer: string) => {
  return pointer
    .replace(new RegExp('~1', 'g'), '/')
    .replace(new RegExp('~0', 'g'), '~');
};

export {
  decodeToken,
};
