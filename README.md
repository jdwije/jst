JST - JSON Schema Toolkit
===

> A utility belt for working with [json schema](http://json-schema.org/).

[![Build Status](https://travis-ci.org/jdwije/jst.svg?branch=master)](https://travis-ci.org/jdwije/jst)

JST is a robust and modular library for working with json schema and provides
practical utilities for some of the many specifications surrounding this
standard such as:

- [json references](https://tools.ietf.org/html/draft-pbryan-zyp-json-ref-03)
- [json pointers](https://tools.ietf.org/html/rfc6901).

For exhaustive documentation please see the project homepage [homepage](). For a
quick overview of `jst`'s functionality and capabilities see below.

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

### dereference

#### dereference( schema )

In it's most basic form `dereference` takes a schema without any external
references as an argument and resolves any of it's internal pointers.

```
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

This de-references to:

```
{
    'car': {
        'type': 'string',
        'enum': ['ferrari', 'mercedes', 'bmw', 'vw']
    }
}
```

#### dereference ( schema, resolve )

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

Here is an example of fetching schema by id from the web using the `node-wget`
package:

```
import wget from 'node-wget';

dereferece(schema, (id) => {
    return wget(id);
});
```

#### dereference ( array, resolve )

When an array of schema is provided to the `dereference` function, it
dereferences each of these before merging them from right to left:

```
schema = [
    {
      'boats': {
          'type': 'string'
      }
    },
    {
     'boats': {
         'enum': ['yacht', 'cruiser', 'dingy']
     }
    }
]

dereference(schema);
```

The above operations would output a de-referenced schema of:
```
{
    'boats': {
        'type': 'string',
        'enum': ['yacht', 'cruiser', 'dingy']
    }
},

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


