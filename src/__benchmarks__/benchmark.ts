import { Suite } from 'benchmark';

// tslint:disable
export interface ITest {
  id: string;
  deferred: boolean;
  exec: any;
}

const benchmark = (title: string, description: string, tests: ITest[]) => {
  const suite = new Suite();
  tests.forEach((t) => {
    if (!t.deferred) {
      suite.add(t.id, t.exec);
    } else {
      suite.add(t.id, {
        defer: true,
        fn(deferred) {
          t.exec(deferred);
        },
      });
    }
  });

  suite.on('cycle', function(event) {
    console.log(String(event.target));
  }).on('complete', function() {
    const fastest = this.filter('fastest').map('name');
    console.log('\n', `Fastest: ${fastest}`, '\n');
  });

  console.log('\n', `Benchmark: ${title}`, '\n');
  console.log(description, '\n', '\n', '-------', '\n');

  return suite.run({
    async: false,
  });
};

export { benchmark };
