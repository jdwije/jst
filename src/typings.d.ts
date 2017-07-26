// ## JST Type Definitions

// JST is a library for working with JSON Schema. It aims to be both simple and
// performant. We begin by covering JST internal data-structures and interfaces.
declare module Jst {
  // ### Interfaces

  // A **Resolver** function takes a schema ID as its argument and looks it
  // up, returning them schema as an `Object` if found or `undefined` if not.
  export const resolve = (schemaId: string) => Object | undefined;

  // A **Dereferencer** function takes a `schema` and a `resolver` function
  // and then dereferences `schema` in accordance with the [IETF JSON
  // Reference Draft v3
  // Specification](https://tools.ietf.org/html/draft-pbryan-zyp-json-ref-03).
  export const dereference =
    (schema: Object | Array<any>, resolver: Resolver) => Object | Array<any>;

  // A **Getter** function dereferences a JSON pointer in accordance with the
  // [IETF RFC6901 specification](https://tools.ietf.org/html/rfc6901)
  // returning its value if `path` is found in `schema` or throw an error
  // otherwise.
  export const getPointer = (schema: Object, path: string) => any;
  export const setPointer = (schema: Object, path: string, value: any) => void;

  export const Mapper = (json: Object, cb: (key, value, object) => any) => any;
}
