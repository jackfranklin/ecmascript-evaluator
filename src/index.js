import { transform } from 'babel-core';


const createAssertResult = function(passed, type, args) {
  _results.push(
    Promise.resolve(passed).then((passed) => {
      return Promise.all(args.map(a => Promise.resolve(a))).then((resolvedArgs) => {
        return {
          passed: passed,
          assertion: type,
          args: resolvedArgs
        };
      });
    })
  );
}

const CREATE_ASSERT_RESULT = `const createAssertResult = ${createAssertResult.toString()}`;

const ASSERT_EQUAL = `const assertEqual = (x, y) => createAssertResult(x == y, 'equal', [x, y])`;

const ASSERT_STRICT_EQUAL = `const assertStrictEqual = (x, y) => createAssertResult(x === y, 'strictEqual', [x, y]);`;

const ASSERT_RESOLVES_TO = `const assertResolvesTo = (promise, x) => createAssertResult(promise.then(y => x == y), 'resolvesTo', [promise, x]);`;

const ASSERTION_FUNCTIONS = [
  CREATE_ASSERT_RESULT,
  ASSERT_EQUAL,
  ASSERT_STRICT_EQUAL,
  ASSERT_RESOLVES_TO
].join('\n');

const Evaluator = {
  run(code) {
    const transpiled = this.transpile(code);
    if (!transpiled.error) {
      return this.evalCode(transpiled);
    } else {
      return Promise.reject([transpiled]);
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
      return Promise.reject([{
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
