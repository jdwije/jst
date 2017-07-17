// The `dereference` function _dereferences_ schema, that is it resolves all
// `$ref` declarations in a schema and inlines those references into one logical
// schema in accordance with the IETF [json reference
// draft-03](https://tools.ietf.org/html/draft-pbryan-zyp-json-ref-03)
// specification.
//
// ## Usage
//
// ```javascript
// import { dereference } from '@jdw/jst';
//
// const schema = {
//         foo: { $ref: '#/definitions/foo' },
//         definitions: { foo: 123 }
//       };
//
// dereference(schema); // { foo: 123, definitions: { foo: 123 }};
// ```
//
// **Arguments**
// - `subject: Object|number|string|boolean|null` A json value.
// - `resolve: Jst.Resolver` A function to resolve a schema by its id.
//
// **Returns**
// - `any`: The dereferenced object.
//
// **Throws**
// - {Error}: If something went wrong when dereferencing the schema.
//
// ## Dependencies

// ## Implementation

// Here begins the implementation of the `dereference` function. This being
// version 2 there are some specific goals being targeted.
// 
// **Design Goals:**
//
// * JSON in JSON out. Any valid json value as defined by the spec will do.
// * Support for asynchronous resolvers... If you want them.
// * Robust json pointer support, including circular references. Correctness
//   is paramount.
// * Caching of schema lookups.
// * Cleaner and more modular design of codebase. It is ok to sacrifice
//   performance for elegance.
//
const dereference: Jst.Dereferencer = (json, resolve) => {
  // ### JSON In, JSON Out
  //
  // The [json specification](http://www.ietf.org/rfc/rfc4627.txt) section 2.1
  // states:

  // >  A JSON value MUST be an object, array, number, or string, or one of
  // >  the following three literal names: false null true

  // Any other value should result in an `TypeError` being thrown.

  if (!(typeof json).match(/object|string|number|boolean/)) {
    throw new TypeError(
      `@jst/dereference: argument not a valid json value: ${typeof json} | ${json}`);
  }

  // Next we must begin to 'walk' the `json` value provided. This means
  // iterating or enumerating its properties if `json` is an `array` or an
  // `object`, otherwise simple returning it if its a primitive `number`,
  // `string`, `boolean`, or `null` value.

  if ((typeof json).match(/string|number|boolean/) || json === null) {
    return json;
  }

  // At this point we know `json` is either of type `object` or `array`, and
  // we will walk it using a while loop.

  const keys = Object.keys(json);
  let index = 0;

  while (index < keys.length) {
    index++;
  }
};

export default dereference;
