import * as derefSync from 'json-schema-deref-sync';
import { dereference } from './../dist/index';
import resolve from './../tests/mockResolve';
import benchmark from './benchmark';

const title = 'jst/dereference comparision: http://footown.com/generic/address#';
const description =
    'This benchmark tests the performance of the jst/dereference function using ' +
    'a basic schema of our own invention and a variety of other similar open source ' +
    'tools.';
const tests = [
    {
        id: 'jst/dereference',
        deferred: false,
        exec: () => {
            dereference(resolve('http://footown.com/generic/address#'), resolve);
        },
    },
    {
        id: 'json-schema-deref-sync',
        deferred: false,
        exec: () => {
            derefSync(resolve('http://footown.com/generic/address#'));
        }
    }
];

benchmark(title, description, tests);
