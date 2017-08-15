import forIn from 'lodash.forin';
import benchmark from './benchmark';

const schema = require('./../resources/temando.swagger.json');
const title = 'jst/experimental: Basic object traversal';
const description =
  'This benchmark tests various methods for iterating and walking an objects top level properties.';

const tests = [
  {
    id: 'ES5/for-in',
    deferred: false,
    exec: () => {
      for (const prop in schema) {
        if (schema.hasOwnProperty(prop)) {
          return prop;
        }
      }
    },
  },
  {
    id: 'ES2016/for-of',
    deferred: false,
    exec: () => {
      for (const key of Object.keys(schema)) {
        return key;
      }
    },
  },
  {
    id: 'lodash/object/forIn',
    deferred: false,
    exec: () => {
      forIn(schema, (value) => value);
    },
  },
  {
    id: 'ES5/while-loop',
    deferred: false,
    exec: () => {
      const keys = Object.keys(schema);
      const len = keys.length;
      let i = 0;
      let prop;

      while (i < len) {
        prop = keys[i];
        i += 1;
        return prop;
      }
    },
  },
];

benchmark(title, description, tests);
