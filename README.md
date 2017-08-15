JST - JSON Schema Toolkit
===

> A library for working with [json schema](http://json-schema.org/).
[![Build Status](https://travis-ci.org/jdwije/jst.svg?branch=master)](https://travis-ci.org/jdwije/jst)

JST is a robust and modular library for working with json schema and provides
practical utilities for some of the many specifications surrounding this
standard such as [json references](https://tools.ietf.org/html/draft-pbryan-zyp-json-ref-03) and [json pointers](https://tools.ietf.org/html/rfc6901).

For exhaustive documentation please see the project
homepage [homepage](http://www.jwije.com/jst). For a quick overview of `jst`'s
functionality and capabilities see below.

## Quick-start

Install JST to your project:
```
npm i --save @jdw/jst
```

Import and begin using the functions (ES6):
```
import { dereference, get, set, isPointer } from '@jdw/jst';
```

## API

### get

Retrieve a value from an object as referenced by a json pointer.

* `get(object: Object, pointer: String) => any`

#### Usage

```javascript
import { get } from '@jdw/jst';

const data = {
    foo: 99
};

get(data, '#/foo'); // 99
```

### set

Sets a value on an object as referenced by a json pointer;

* `set(object: Object, pointer: String, value: any) => void`

#### Usage

```javascript
import { set } from '@jdw/jst';

const data = {
    foo: 99
};

set(data, '#/foo', 77);

console.log(data); // { foo: 77 }
```

#### isPointer

Performs a logical test on a string to determine if it is a json pointer.

* `isPointer(subject: string) => boolean`

#### Usage

```javascript
import { isPointer } from '@jdw/jst';

console.log(isPointer('#/foo/0/blah')); // true
console.log(isPointer('#'));            // true
console.log(isPointer('some string'));  // false
```

### dereference

Dereferences a schema according to the [json references](https://tools.ietf.org/html/draft-pbryan-zyp-json-ref-03) specification.

* `dereference(schema: Object)`
* `dereference(schema: Object, resolve: (id) => Object)`

#### Usage

In it's most basic form `dereference` takes a schema without any external
references as an argument and resolves any of it's internal pointers.

```javascript
import { dereference } from '@jdw/jst';

const schema = {
    'car': {
        '#/def/car'
    },
    'def': {
        'car': {
            'type': 'string',
            'enum': ['ferrari', 'mercedes', 'bmw', 'vw']
        }
    }
};

// a resolver function is not required when de-referencing schema without external
// uri references
console.log( dereference(schema) );
```

This dereferences to:

```
{
    'car': {
        'type': 'string',
        'enum': ['ferrari', 'mercedes', 'bmw', 'vw']
    }
}
```

The `dereference` function may be injected with a schema resolver function as
its second argument. The resolve function is expected to take a schema id (uri
reference) as it's input and return that schema as an object literal. This
allows you to flexible in how you provision your schema be it over the wire or
storing it in memory. If the resolve function cannot find the schema it is
expected to throw an error.

The following is an example of using an AJV instance as supplier for a `resolve`
function.

```
dereference(schema, (id) => {
    return ajv.getSchema(id).schema
});
```

## Contributing

Contributions to JST are most welcome, here we outline how to get setup for
development.

### Requirements

- NodeJS >= 6

### Setup

Fork and clone this project then navigate to the project directory. Open up a
terminal and run the following commands and execute `npm i` to install the
projects development dependencies, try the following scripts out to get started -
you can find more in `package.json`.

- `npm build`: build all source code and documentation
- `npm test`: run all unit test.
- `npm benchmark`: run the benchmark suite (requires `npm build` to have been run)

Make your changes and commit your code. When you are ready, send a pull request
to this repository.
