import { assert } from "chai";
import { IQux, isQux } from "./typeGuardSample";

import * as sourceMapSupport from "source-map-support";

import { Case, DefaultCase, match, NumberCase, StringCase, TypeCase } from "../src/index";
import OtherSampleClass from "./OtherSampleClass";
import SampleClass from "./SampleClass";
import UnmatchedClass from "./UnmatchedClass";

sourceMapSupport.install();

describe("match", () => {

    it("calls the right function depending on its type", () => {
        function testMatch(a: any): number {
            return match(a,
                Case(SampleClass, (sampleClass) => sampleClass.myData),
                Case(OtherSampleClass, (otherSampleClass) => otherSampleClass.myOtherData),
                TypeCase(isQux, (qux) => qux.q),
                Case(23, (n) => n + 1),
                Case("asdf", (s) => s.length),
                Case(a + 1 === 2, () => 2),
                NumberCase((n) => n + 5),
                StringCase((s) => s.length + 1),
                DefaultCase(-1),
            );
        }

        const sampleClass = new SampleClass(1);
        assert.equal(testMatch(sampleClass), sampleClass.myData);

        const otherSampleClass = new OtherSampleClass(2);
        assert.equal(testMatch(otherSampleClass), otherSampleClass.myOtherData);

        const qux = { q: 3 };
        assert.equal(testMatch(qux), qux.q);

        assert.equal(testMatch(23), 23 + 1);

        assert.equal(testMatch("asdf"), "asdf".length);

        assert.equal(testMatch(true), 2);

        assert.equal(testMatch(24), 24 + 5);

        assert.equal(testMatch("arbitrarystring"), "arbitrarystring".length + 1);

        assert.equal(testMatch(new UnmatchedClass()), -1);
    });
});
