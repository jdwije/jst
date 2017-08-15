import * as has from 'lodash.has';

export const set: Jst.setPointer = (obj, pointer, value) => {

  // A JSON `pointer` must begin with the symbols '#', '/' or be an empty
  // string ''. So as a first step, we check that this assumption is true and
  // bail if not.
  if (!(pointer.indexOf('#') === 0 || pointer.indexOf('/') === 0 || pointer === '')) {
    throw new Error(`invalid JSON pointer specified: '${pointer}'`);
  }

  // If this check passes we have a valid `pointer`. In order to dereference
  // its value, we will split the pointer into its orthogonal pieces and then
  // iterate `schema` checking from left to right that each piece of `pointer`
  // references a valid path in `schema`.
  const fragments = pointer.split('/');
  let ref = obj;
  return fragments.forEach((fragment, index) => {
    // If `fragment` points to the root path of `object` we can just return
    // the `object` itself.
    if (fragment === '#' || fragment === '/' || fragment === '') {
      return;
    }

    // Here we decode `fragment` according to the JSON pointer
    // specification, replacing the character codes '~1' and '~0' with the
    // symbols '/' and '~' respectively.
    const token = fragment.replace('~1', '/').replace('~0', '~');

    // If the 'object' is array assume that `token` indicates an index in
    // this array and try to resolve it appropriately.
    if (Array.isArray(ref)) {
      const i = parseInt(token, 10);

      if (!ref.indexOf(i)) {
        throw new Error(
          `could not dereference JSON pointer: ${pointer}. Array does not have`
          + ` index: ${index}::${JSON.stringify(obj)}`);
      }

      if ((index + 1) === fragments.length) {
        ref[i] = value;
        return;
      }

      ref = ref[i];
    // Otherwise if `object` *is not* an Array we expect `object` to be of
    // type Object and that `token` references a valid path in `object`.
    } else {
      if (!has(ref, token)) {
        throw new Error(
          `could not dereference pointer '${pointer}'. The fragment ${token}`
          + ` is not a valid property of object: ${JSON.stringify(obj, null, 2)}`);
      }

      if ((index + 1) === fragments.length) {
        ref[token] = value;
        return;
      }
      ref = ref[token];
    }
  });
};
