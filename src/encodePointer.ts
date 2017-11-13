const encodePointer = (pointer: string) => pointer.replace('~', '~0').replace('/', '~1');

export {
  encodePointer,
};
