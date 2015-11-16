import Evaluator from '../src/index';

import test from 'tape';

test('It can have some assertions', (t) => {
  t.plan(1);

  const results = Evaluator.run(`
    var x = 1;
    assertEqual(x, 1);
  `);

  t.deepEqual(results, [
    { assertion: 'equal', args: [1, 1], passed: true }
  ]);
});

test('Assertions can fail', (t) => {
  t.plan(1);

  const results = Evaluator.run(`assertEqual(2, 1);`);

  t.deepEqual(results, [
    { assertion: 'equal', args: [2, 1], passed: false }
  ]);
});

test('It returns an error when given a syntax error', (t) => {
  t.plan(1);

  const results = Evaluator.run(`assertEqual(2, 1;`);

  t.deepEqual(results, [
    {
      error: true,
      errorType: 'SyntaxError',
      message: 'Unexpected token (1:16)'
    }
  ]);
});

test('It returns an error when there is a runtime error', (t) => {
  t.plan(1);

  const results = Evaluator.run(`assertEqual(x, 1);`);
  t.deepEqual(results, [
    {
      error: true,
      errorType: 'ReferenceError',
      message: 'x is not defined'
    }
  ]);
});

test('You can have many assertions', (t) => {
  t.plan(1);
  const results = Evaluator.run(`assertEqual(1, 1); assertEqual(2, 1)`);

  t.deepEqual(results, [
    { assertion: 'equal', args: [1, 1], passed: true },
    { assertion: 'equal', args: [2, 1], passed: false },
  ]);
});
