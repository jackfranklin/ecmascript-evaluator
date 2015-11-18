import Evaluator from '../src/index';

import test from 'tape';

test('It can have some assertions', (t) => {
  t.plan(1);

  const results = Evaluator.run(`
    var x = 1;
    assertEqual(x, 1);
  `);

  results.then((r) => {
    t.deepEqual(r, [
      { assertion: 'equal', args: [1, 1], passed: true }
    ]);
  });
});

test('Assertions can fail', (t) => {
  t.plan(1);

  const results = Evaluator.run(`assertEqual(2, 1);`);

  results.then((r) => {
    t.deepEqual(r, [
      { assertion: 'equal', args: [2, 1], passed: false }
    ]);
  });
});

test('It throws on a syntax error', (t) => {
  t.plan(1);

  const results = Evaluator.run(`assertEqual(2, 1;`);

  results.catch((r) => {
    t.deepEqual(r, [
      {
        error: true,
        errorType: 'SyntaxError',
        message: 'Unexpected token (1:16)'
      }
    ]);
  });
});

test('It throws on a runtime error', (t) => {
  t.plan(1);

  const results = Evaluator.run(`assertEqual(x, 1);`);
  results.catch((r) => {
    t.deepEqual(r, [
      {
        error: true,
        errorType: 'ReferenceError',
        message: 'x is not defined'
      }
    ]);
  });
});
