import * as derefSync from 'json-schema-deref-sync';
import resolve from './../tests/mockResolve';
import { dereference } from './../src/index';
import benchmark from './benchmark';

const title = 'jst/dereference comparision - temando.swagger.json';
const description =
  'This benchmark tests the performance of the jst/dereference function using ' +
  'the Temando Phoenix API swagger payload. This is a large json payload.'
const tests = [
  {
    id: 'jst/dereference',
    exec: () => {
      dereference(require('./../resources/temando.swagger.json'), resolve)
    },
  },
  {
    id: 'json-schema-deref-sync',
    exec: () => {
      derefSync(require('./../resources/temando.swagger.json'));
    }
  }
];

benchmark(title, description, tests);
