import { Suite } from 'benchmark';
import * as chalk from 'chalk';

type Test = {
    id: string,
    deferred: boolean,
    exec: any,
};

const benchmark = (title: string, description: string, tests: Test[]) => {
    const suite = new Suite();
    const h1 = chalk.bgBlack.white;
    const h2 = chalk.white;

    tests.forEach((t) => {
        if (!t.deferred) {
            suite.add(t.id, t.exec);
        } else {
            suite.add(t.id, {
                defer: true,
                fn: function(deferred) {
                    t.exec(deferred);
                }
            });
        }
    });

    suite.on('cycle', function(event) {
        console.log(String(event.target));
    }).on('complete', function() {
        const fastest = this.filter('fastest').map('name');
        console.log('\n', chalk.white(`Fastest: ${chalk.green(fastest)}`), '\n');
    });

    console.log(h1('\n', `Benchmark: ${title}`), '\n');
    console.log(h2(description), '\n', '\n', chalk.blue.bold('-------'), '\n');

    return suite.run({
        async: false,
    });
};

export default benchmark;
