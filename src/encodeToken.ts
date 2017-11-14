// The `encodeToken` function encodes a string for use as a JSON pointer token
// replacing the values '~' with '~0' and '/' with '~1'.
const encodeToken = (pointer: string) => {
  return pointer
    .replace(new RegExp('~', 'g'), '~0')
    .replace(new RegExp('/', 'g'), '~1');
};

export {
  encodeToken,
};
