// The `isPointer` function determines if its argument is a valid json pointer
// or not returning a boolean indicating the result of the operation.

// ## Usage

// ```javascript
// import { isPointer } from '@jdw/jst';
//
// isPointer('#/foo');   // true
// isPointer({})         // false
// ```

// ## Dependencies

import { IsPointer } from './types';

// ## Implementation

export const isPointer: IsPointer = (input) => {
  // A JSON `pointer` must begin with the symbols '#', '/' or be an empty string
  // ''.

  if (typeof input !== 'string') {
    return false;
  }

  if (input === '') {
    return true;
  }

  if (/^#|^\//.test(input)) {
    return true;
  }
  // If it is not one of these values then `input` is not a json pointer.
  return false;
};
