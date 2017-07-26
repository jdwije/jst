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

import { forIn, merge, has, isObject, cloneDeep } from 'lodash';
import { getPointer, isPointer, setPointer } from './index';

// ## Implementation

// Here begins the implementation of the `dereference` function. This being
// version 2 there are some specific goals being targeted.
// 
// **Design Goals:**
//
// * JSON in JSON out. Any valid json value as defined by the spec will do.
// * More robust json pointer support, including circular references. Correctness
//   is paramount.
// * Caching of schema lookups.
// * Cleaner and more modular design of codebase. It is ok to sacrifice
//   performance for this.

const dereference: Jst.dereference = (root, resolver) => {
  // ### JSON In, JSON Out
  //
  // The [json specification](http://www.ietf.org/rfc/rfc4627.txt) section 2.1
  // states:

  // >  A JSON value MUST be an object, array, number, or string, or one of
  // >  the following three literal names: false null true

  // Any other value should result in an `TypeError` being thrown.

  if (!(typeof root).match(/object|string|number|boolean/)) {
    throw new TypeError(
      `@jst/dereference: argument not a valid json value: ${typeof json} | ${json}`);
  }
  const circularRefs = {};

  const walk = (schema: any, resolve: Jst.resolve = null, path: string = '#'): any => {
    // If schema is an array we dereference each schema and then merge them from
    // right-to-left.
    if (Array.isArray(schema)) {
      // first validate our arguments assumption!
      schema.forEach((s) => {
        if (typeof s !== 'object' && !Array.isArray(s))
          throw new TypeError(`expect typeof object got: ${typeof s}`);
      });

      // then dereference each schema in the array before eventually merging them
      // from right to left using a reducer function.
      return schema
        .map((scm, index) => walk(scm, resolve, `${path}/${index}`))
        .reduce((acc, scm) => merge(acc, scm), {});
    }
    // If schema is not an array of json objects we expect a singlular json schema
    // be provided
    else if (isObject(schema)) {
      const schemaId = schema.id || undefined;
      let isCircular = false;
      // traverse is an internal recursive function that we bind to this lexical
      // scope in order to easily resolve to schema definitons whilst traversing
      // an objects nested properties. This is primarily for efficiency concerns.
      const traverse = (node, path: string = '#') => {
        let resolution = {};

        if (typeof node !== 'object' || node === null) return node;

        // if only one argument is provided and it is an array we must recursively
        // dereference it's individual values
        if (Array.isArray(node)) {
          return node.map((v, index) => traverse(v, `${path}/${index}`));
        }

        // if we are here, the first argument is not an array or value and we expect
        // it to be a json schema.
        forIn(node, (value, key) => {
          // Skip the following properties
          if (key === 'definitions') return;

          // If value is not an array, object, or JSON schema reference we can
          // dereference it immediately. 'typeof array' equals 'object' in JS.
          if (typeof value !== 'object' && key !== '$ref') {
            resolution[key] = value;
          }
          // If we have a schema reference we must fetch it, dereference it, then merge
          // it into the base schema object.
          else if (key === '$ref') {
            // We have two types of references - definitions which are defined
            // within the current schema and external schema references which we
            // have to query AJV for as such we must fetch the schema for the
            // reference appropriately.
            let reference = null;

            // Here we resolve a JSON reference (uri). In order to do so
            // correctly we must make a distinction between external
            // references and internal (circular) references.
            if (value.indexOf('http') === 0) {
              if (!resolve) {
                throw new TypeError(
                  'argument: resolver is required to dereference a json uri.');
              }

              if (value !== schemaId) {
                reference = resolve(value);

                if (!reference) throw new Error(`unable to resolve URI reference: ${value}`);

                resolution = merge(
                  resolution,
                  walk(reference, resolve, `${path}/${key}`),
                  true
                );
              } else {
                reference = resolution;
                circularRefs[path] = value;
                isCircular = true;
              }
            }
            // de-reference a json pointer
            else if (isPointer(value)) {
              reference = getPointer(schema, value)
              resolution = merge(
                resolution,
                traverse(reference, `${path}/${key}`),
                true
              );
            }
            else {
              throw new Error(
                `could not dereference value as a json pointer or uri: ${value}`);
            }

            if (!reference) {
              throw new ReferenceError(`could not find a reference to ${value}`);
            }
          }
          // Otherwise the value is an array or object and we need to traverse it
          // and dereference it's properties.
          else {
            resolution[key] = traverse(value, `${path}/${key}`);
          }
        });

        return resolution;
      };

      const result = traverse(schema, path);
      if (isCircular) {
        forIn(circularRefs, (value, key) => {
          setPointer(result, key, cloneDeep(result));
        });
      }
      return result;
    }
    // if any other combination of arguments is provided we throw
    else {
      throw new TypeError(`expected first parameter to be object or array: ${schema}`);
    }
  };

  return walk(root, resolver);
};

export default dereference;
