import Evaluator from '../src/index';
import test from 'tape';

test('assertEqual', (t) => {
  t.plan(1);

  const results = Evaluator.run(`
    const x = 1;
    assertEqual(x, 1);
    assertEqual(0, false);
    assertEqual('hello', 'hello');
    assertEqual(true, 1);
    assertEqual(2, 1);
  `);

  results.then((r) => {
    t.deepEqual(r, [
      { assertion: 'equal', args: [1, 1], passed: true },
      { assertion: 'equal', args: [0, false], passed: true },
      { assertion: 'equal', args: ['hello', 'hello'], passed: true },
      { assertion: 'equal', args: [true, 1], passed: true },
      { assertion: 'equal', args: [2, 1], passed: false }
    ]);
  });
});

test('assertStrictEqual', (t) => {
  t.plan(1);

  const results = Evaluator.run(`
    const x = 1;
    assertStrictEqual(x, 1);
    assertStrictEqual(0, false);
    assertStrictEqual('hello', 'hello');
    assertStrictEqual(true, 1);
  `);

  results.then((r) => {
    t.deepEqual(r, [
      { assertion: 'strictEqual', args: [1, 1], passed: true },
      { assertion: 'strictEqual', args: [0, false], passed: false },
      { assertion: 'strictEqual', args: ['hello', 'hello'], passed: true },
      { assertion: 'strictEqual', args: [true, 1], passed: false },
    ]);
  });
});

test('assertResolvesTo', (t) => {
  t.plan(1);

  const results = Evaluator.run(`
    const x = 1;
    assertResolvesTo(Promise.resolve(x), 1);
    assertResolvesTo(Promise.resolve(x), 2);
  `);
  results.then((r) => {
    t.deepEqual(r, [
      { assertion: 'resolvesTo', args: [1, 1], passed: true },
      { assertion: 'resolvesTo', args: [1, 2], passed: false },
    ]);
  });
});
