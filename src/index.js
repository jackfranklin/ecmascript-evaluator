import { transform } from 'babel-core';

const CREATE_ASSERT_RESULT = (function createAssertResult(passed, type, args) {
  _results.push(
    Promise.resolve(passed).then((passed) => {
      return {
        passed: passed,
        assertion: type,
        args: args
      };
    })
  );
}).toString();

const ASSERT_EQUAL = (function assertEqual(x, y) {
  createAssertResult(x == y, 'equal', [x, y]);
}).toString();

const ASSERT_STRICT_EQUAL = (function assertStrictEqual(x, y) {
  createAssertResult(x === y, 'strictEqual', [x, y]);
}).toString();

const ASSERT_RESOLVES_TOO = (function assertResolvesTo(promise, x) {
  createAssertResult(promise.then((y) => x == y), 'resolvesTo', ['promise', x]);
});

const ASSERT_THROWS = (function assertThrows(fn) {
  try {
    fn();
    // TODO: returning 'function' as the arg isn't useful
    createAssertResult(false, 'throws', ['function']);
  } catch(e) {
    createAssertResult(true, 'throws', ['function']);

  }
}).toString();

const ASSERTION_FUNCTIONS = [
  CREATE_ASSERT_RESULT,
  ASSERT_EQUAL,
  ASSERT_STRICT_EQUAL,
  ASSERT_THROWS,
  ASSERT_RESOLVES_TOO
].join('\n');

const Evaluator = {
  run(code) {
    const transpiled = this.transpile(code);
    if (!transpiled.error) {
      return this.evalCode(transpiled);
    } else {
      return Promise.resolve([transpiled]);
    }
  },
  evalCode(transpiledCode) {
    const code = `
      var _results = [];
      ${ASSERTION_FUNCTIONS};
      ${transpiledCode};
      return Promise.all(_results);
    `;

    try {
      const result = new Function(code)();
      return result;
    } catch (e) {
      return Promise.resolve([{
        error: true,
        errorType: e.name,
        message: e.message
      }]);
    }
  },
  transpile(code) {
    try {
      return transform(code, {}).code;
    } catch (e) {
      return {
        error: true,
        message: e.message.replace('unknown: ', ''),
        errorType: 'SyntaxError'
      };
    }
  }
}

export default Evaluator;
