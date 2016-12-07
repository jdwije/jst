JST - JSON Schema Toolkit
===

> A utility belt for working with [JSON schema](http://json-schema.org/).

JST is a toolkit to help work with JSON schema. It currently includes the
following features:

- A generic validator object that wraps AJV with some convenience methods for
  loading your schema set.
- Object literal helper functions for deep traversal and manipulation of object
  literals.
- The resolve function, which takes a schema along with any extensions to it and
  _resolves_ these to a single logical schema.

## Quick-start

Install JST to your project:
```
npm i --save jst
```

Import and begin using the functions (ES6):
```
import { merge, map, iterate, resolve } from 'jst';
```

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


