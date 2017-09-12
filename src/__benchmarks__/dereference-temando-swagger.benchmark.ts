import * as derefSync from 'json-schema-deref-sync';
import * as $RefParser from 'json-schema-ref-parser';
import { dereference } from './../index';
import { resolve } from './../__tests__/lib/';
import benchmark from './benchmark';

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
      dereference(require('./../__tests__/fixture/temando.swagger.json'), resolve)
    },
  },
  {
    id: 'json-schema-deref-sync',
    deferred: false,
    exec: () => {
      derefSync(require('./../__tests__/fixture/temando.swagger.json'));
    }
  },
  {
    id: 'json-schmea-ref-parser',
    deferred: true,
    exec: (defer) => {
      refParser.dereference(
        require('./../__tests__/fixture/temando.swagger.json'),
        (err, x) => {
          defer.resolve();
        }
      );
    },
  },
];

benchmark(title, description, tests);
