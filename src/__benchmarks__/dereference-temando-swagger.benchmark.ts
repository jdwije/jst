import * as $RefParser from 'json-schema-ref-parser';
import * as derefSync from 'json-schema-deref-sync';
import { benchmark } from './benchmark';
import { dereference } from './../index';
import { resolve } from './../__tests__/lib/';

const title = 'jst/dereference comparision - temando.swagger.json';
const description =
  'This benchmark tests the performance of the jst/dereference function using ' +
  'the Temando Phoenix API swagger payload. This is a large json payload.';
const refParser = new $RefParser();
const tests = [
  {
    id: 'jst/dereference',
    deferred: false,
    exec: () => {
      dereference(require('./../__tests__/fixture/temando.swagger.json'), resolve);
    },
  },
  {
    id: 'json-schema-deref-sync',
    deferred: false,
    exec: () => {
      derefSync(require('./../__tests__/fixture/temando.swagger.json'));
    },
  },
  {
    id: 'json-schmea-ref-parser',
    deferred: true,
    exec: (defer) => {
      refParser.dereference(
        require('./../__tests__/fixture/temando.swagger.json'),
        (err, x) => {
          if (err) {
            throw err;
          }
          defer.resolve();
        },
      ).catch((reason) => {
        defer.reject(reason);
      });
    },
  },
];

benchmark(title, description, tests);
