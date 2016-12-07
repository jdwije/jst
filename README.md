JST - JSON Schema Toolkit
===

> A utility belt for working with [JSON schema](http://json-schema.org/).

[![Build Status](https://travis-ci.org/jdwije/jst.svg?branch=master)](https://travis-ci.org/jdwije/jst)

JST is a toolkit to help work with JSON schema. It currently includes the
following features:

- A generic validator object that wraps AJV with some convenience methods for
  loading your schema set.
- Object literal helper functions for deep traversal and manipulation of object
  literals.
- The resolve function, which takes a schema along with any extensions to it and
  _resolves_ these to a single logical schema.

For a full list of available methods and exports, including more detailed
documentation see: https://doc.esdoc.org/github.com/jdwije/jst/.

## Quick-start

Install JST to your project:
```
npm i --save json-schema-toolkit
```

Import and begin using the functions (ES6):
```
import { merge, map, iterate, resolve } from 'json-schema-toolkit';
```

## Functionality

### Validator

The validator class is a generic validator object which extends AJV. Its primary
purpose is to supply AJV with a given schema set at run-time. This class is
useful for building API interfaces with JSON schema, it allows you to neatly
wrap your interface validation in the one class.

Usage:

```
import { Validator } from 'json-schema-toolkit';

// Initialize with one or more JSON schema object literals
const schema = require('path/to/schema.json');
const validator = new Validator(schema);
```

Validator extends AJV so it shares the same method set. See AJV's documentation
for more information.

### Object Literal Helpers

JST includes some utility methods for working with, traversing, and manipulating
object literals.

Usage:

```
import { clone, merge, map, contains, iterate} from 'json-schema-toolkit';

const schema = require('path/to/schema.json');

// iterate the properties of a schema without recursion
iterate(schema, (key, value) => {
    // key is the property name, value is that keys value
});

// check if an object contains some property. returns true/false
contains(schema, 'foo');

// map the properties of an object applying some function to it and return a new object
const object = map(schema, (k, v) return v); // copy schema properties to a new object

// merge two object together. defaults left-to-right, set override true for right-to-left
const mergedObject = merge(schema, object, true); // does not override existing properties in 'schema'.

// clone an object
const object = clone(schema, true); // set boolean true to recurse, false to limit.
```

JST object methods additionally expose the `clone` function from
the [clone](https://github.com/pvorb/node-clone) npm package for
convenience. This method can be used to recursively clone an object literal, see
it's documentation for more information on this functions usage.

### Schema Resolver

JST includes a function called `resolve` which can resolve (flatten) a schema
set.

## Contributing

First fork and clone this project. Then `cd` into your project directory.

Install dependencies:
```
yarn
```

Run tests:
```
npm test
```

Make your changes and commit your code. When you are ready, send a pull request
to this repository.


