const decodePointer = (pointer: string) => pointer.replace('~1', '/').replace('~0', '~');

export {
  decodePointer,
};
