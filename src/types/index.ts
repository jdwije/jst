// ## JST Type Definitions

// JST is a library for working with JSON Schema. It aims to be both simple and
// performant. We begin by covering JST internal data-structures and interfaces.

// ### Interfaces

// A **Resolver** function takes a schema ID as its argument and looks it
// up, returning them schema as an `Object` if found or `undefined` if not.
export type Resolver = (schemaId: string) => Object | undefined;

// A **Dereferencer** function takes a `schema` and a `resolver` function
// and then dereferences `schema` in accordance with the [IETF JSON
// Reference Draft v3
// Specification](https://tools.ietf.org/html/draft-pbryan-zyp-json-ref-03).
export type Dereferencer =
  (schema: Object | Array<any>, resolve: Resolver) => Object | Array<any>;

// A **Getter** function dereferences a JSON pointer in accordance with the
// [IETF RFC6901 specification](https://tools.ietf.org/html/rfc6901)
// returning its value if `path` is found in `schema` or throw an error
// otherwise.
export type GetPointer = (schema: Object, path: string) => any;
export type SetPointer = (schema: Object, path: string, value: any) => void;

export type IsPointer = (input: any) => boolean;
