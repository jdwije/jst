import { Suite } from 'benchmark';
import { dereference } from './../index';
import resolve from './mockResolve';

const suite = new Suite();

suite
    .add('@jdw/jst/dereference::address#', function() {
        return dereference(resolve('http://footown.com/generic/address#'), resolve);
    })
    .add('@jdw/jst/dereference::profile#', function() {
        return dereference(resolve('http://footown.com/generic/profile+v1#'), resolve);
    })
    .on('cycle', function(event) {
        console.log(String(event.target));
    })
    .on('complete', function() {
        const fns = this.filter('fastest').map('name');
        console.log(`fastest is: ${fns}`);
    })
    .run({
        async: false,
        minSamples: 250,
    });


