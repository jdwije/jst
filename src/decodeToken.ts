// The `decodeToken` function unescapes a previously escaped JSON pointer reference
// token replacing the values '~1' with '/' and '~0' with '~'.
const decodeToken = (pointer: string) => {
  return pointer
    .replace(new RegExp('~1', 'g'), '/')
    .replace(new RegExp('~0', 'g'), '~');
};

export {
  decodeToken,
};
