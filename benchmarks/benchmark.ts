import { Suite } from 'benchmark';
import * as chalk from 'chalk';

type Test = {
    id: string,
    exec: any,
};

const benchmark = (title: string, description: string, tests: Test[]) => {
    const suite = new Suite();
    const h1 = chalk.bgBlack.white;
    const h2 = chalk.white;

    tests.forEach((t) => suite.add(t.id, t.exec));

    suite.on('cycle', function(event) {
        console.log(String(event.target));
    })
        .on('complete', function() {
            const fastest = this.filter('fastest').map('name');
            console.log('\n', chalk.white(`Fastest: ${chalk.green(fastest)}`), '\n');
        });

    console.log(h1('\n', `Benchmark: ${title}`), '\n');
    console.log(h2(description), '\n', '\n', chalk.blue.bold('-------'), '\n');

    return suite.run({
        async: false,
        minSamples: 250,
        defer: true,
    });
};

export default benchmark;
