// The `get` function dereferences [json
// pointers](https://tools.ietf.org/html/rfc6901) according to the IETF RFC6901
// specification. It takes a `schema` and a json `pointer` as its arguments and
// then returns the value in `schema` described by `pointer` throwing an error
// if the path described by the `pointer` was not found in the `schema`.
//
// ## Usage:
//
// ```
// import { get } from '@jdw/jst';
//
// const schema = { definitions: { foo: 123 }};
// get(schema, '#/definitions/foo'); // resolves value 123
// ```
//
// **Arguments**
// - `schema` {Object}: The object to query.
// - `pointer` {string}: The JSON pointer path of the property to get.
//
// **Returns**
// - {any}: The resolved pointer value.
//
// **Throws**
// - {Error}: If `pointer` cannot be resolved in `schema`.
//
// ## Dependencies

import { has } from 'lodash';

// #### Implementation

// The `get` function implements the `Jst.Getter` signature as described in
// [typings.d.ts](typings.d.html).
export const get: Jst.getPointer = (schema, pointer) => {
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
  return fragments.reduce((object, fragment) => {
    // If `fragment` points to the root path of `object` we can just return
    // the `object` itself.
    if (fragment === '#' || fragment === '/' || fragment === '') {
      return object;
    }

    // Here we decode `fragment` according to the JSON pointer
    // specification, replacing the character codes '~1' and '~0' with the
    // symbols '/' and '~' respectively.
    const token = fragment.replace('~1', '/').replace('~0', '~');
    let reference = null;

    // If the 'object' is array assume that `token` indicates an index in
    // this array and try to resolve it appropriately.
    if (Array.isArray(object)) {
      const index = parseInt(token, 10);

      if (!object.indexOf(index)) {
        throw new Error(
          `could not dereference JSON pointer: ${pointer}. Array does not have`
          + ` index: ${index}::${JSON.stringify(object)}`);
      }

      reference = object[index];
    // Otherwise if `object` *is not* an Array we expect `object` to be of
    // type Object and that `token` references a valid path in `object`.
    } else {
      if (!has(object, token)) {
        throw new Error(
          `could not dereference pointer '${pointer}'. The fragment ${token}`
          + ` is not a valid property of object: ${JSON.stringify(object, null, 2)}`);
      }
      reference = object[token];
    }

    // Now return `reference`
    return reference;
  }, schema);
};
