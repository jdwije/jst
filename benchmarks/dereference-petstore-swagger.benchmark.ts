import * as derefSync from 'json-schema-deref-sync';
import resolve from './../tests/mockResolve';
import { dereference } from './../src/index';
import benchmark from './benchmark';

const title = 'jst/dereference comparision - temando.swagger.json';
const description =
  'This benchmark tests the performance of the jst/dereference function using ' +
  'the demo Petstore API swagger from the open api homepage. This is a medium ' +
  'sized json payload.'
const tests = [
  {
    id: 'jst/dereference',
    exec: () => {
      dereference(require('./../resources/petstore.swagger.json'), resolve)
    },
  },
  {
    id: 'json-schema-deref-sync',
    exec: () => {
      derefSync(require('./../resources/petstore.swagger.json'));
    }
  }
];

benchmark(title, description, tests);
