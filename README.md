# pattern-matcher

[![CircleCI](https://circleci.com/gh/jroitgrund/pattern-matcher.svg?style=svg)](https://circleci.com/gh/jroitgrund/pattern-matcher)

An NPM package for [rob3c](https://github.com/rob3c)'s implementation of pattern matching, from his [GitHub comment](https://github.com/Microsoft/TypeScript/issues/165#issuecomment-259598080).

Includes TypeScript typings.

## Example:

```javascript
import { Case, DefaultCase, match, NumberCase, StringCase } from "pattern-matcher";


class SampleClass {
    constructor(myData) {
      this.myData = myData
    }
}

class OtherSampleClass {
    constructor(myOtherData) {
      this.myOtherData = myOtherData
    }
}

class UnmatchedClass {
}


function testMatch(a: any): number {
  return match(a,
      // matches if argument is of type SampleClass
      Case(SampleClass, (sampleClass) => sampleClass.myData),
      // matches if argument is of type OtherSampleClass
      Case(OtherSampleClass, (otherSampleClass) => otherSampleClass.myOtherData),
      // matches if argument === 23
      Case(23, (n) => n + 1),
      // matches if argument === "asdf"
      Case("asdf", (s) => s.length),
      // matches if a + 1 === 2
      Case(a + 1 === 2, () => 2),
      // matches any number
      NumberCase((n) => n + 5),
      // matches any string
      StringCase((s) => s.length + 1),
      // matches if nothing else matched
      DefaultCase(-1),
  );
}

const sampleClass = new SampleClass(1);
assert.equal(testMatch(sampleClass), sampleClass.myData);

const otherSampleClass = new OtherSampleClass(2);
assert.equal(testMatch(otherSampleClass), otherSampleClass.myOtherData);

assert.equal(testMatch(23), 23 + 1);

assert.equal(testMatch("asdf"), "asdf".length);

assert.equal(testMatch(true), 2);

assert.equal(testMatch(24), 24 + 5);

assert.equal(testMatch("arbitrarystring"), "arbitrarystring".length + 1);

assert.equal(testMatch(new UnmatchedClass()), -1);
```
