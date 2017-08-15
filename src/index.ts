// JST - JSON Schema Toolkit [![Build Status](https://travis-ci.org/jdwije/jst.svg?branch=master)](https://travis-ci.org/jdwije/jst)
// ===

// > A library for working with [json schema](http://json-schema.org/).

// JST is a utility library for working with json schema. It provides functions
// for json pointers and json references.

// ## Interface

// ### dereference(schema: Object, resolve: (id) => Object)

// A generic dereferencer function to resolve all `$ref` tags in a schema and
// inline the results.

// * [documentation](dereference.html)

import { dereference } from './dereference';

// ### get(object: Object, pointer: String)

// Retrieve a value from an object using a json pointer.

// * [documentation](get.html)

import { get } from './get';

// ### set(object: Object, pointer: String, value: any)

// Set a value on an object using a json pointer.

// * [documentation](set.html)

import { set } from './set';

// ### isPointer(string: string)

// Checks of a string is a valid json pointer.

// * [documentation](isPointer.html)

import { isPointer } from './isPointer';

// ## Usage

// Install JST via npm.
// ```bash
// npm i --save @jdw/jst
// ```

// Then use it.

// ```javascript
// import { get, set, isPointer, dereference } from '@jdw/jst'; // ES6
//
// var jst = require('@jdw/jst');                               // ES2015
// ```

export {
  dereference,
  get,
  isPointer,
  set,
};
