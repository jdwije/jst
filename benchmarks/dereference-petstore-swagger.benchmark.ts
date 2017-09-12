import * as derefSync from 'json-schema-deref-sync';
import * as $RefParser from 'json-schema-ref-parser';
import { dereference } from './../dist/index';
import { mockResolve as resolve } from './../src/__tests__/mockResolve';
import benchmark from './benchmark';

const title = 'jst/dereference comparision - petstore.swagger.json';
const description =
  'This benchmark tests the performance of the jst/dereference function using ' +
  'the demo Petstore API swagger from the open api homepage. This is a medium ' +
  'sized json payload.';
const refParser = new $RefParser();
const tests = [
  {
    id: 'jst/dereference',
    deferred: false,
    exec: () => {
      dereference(require('./../src/__tests__/fixture/petstore.swagger.json'), resolve)
    },
  },
  {
    id: 'json-schema-deref-sync',
    deferred: false,
    exec: () => {
      derefSync(require('./../src/__tests__/fixture/petstore.swagger.json'));
    }
  },
  {
    id: 'json-schmea-ref-parser',
    deferred: true,
    exec: (defer) => {
      refParser.dereference(
        require('./../src/__tests__/fixture/petstore.swagger.json'),
        (err, x) => {
          defer.resolve();
        }
      );
    },
  },
];

benchmark(title, description, tests);
