import { assert } from "chai";

import { Case, DefaultCase, match } from "../src/index";
import OtherSampleClass from "./OtherSampleClass";
import SampleClass from "./SampleClass";

describe("match", () => {
    it("calls the right function depending on its type", () => {
        function testMatch(a: any): number {
            return match(a,
                Case(SampleClass, (sampleClass) => sampleClass.myData),
                Case(OtherSampleClass, (otherSampleClass) => otherSampleClass.myOtherData),
                Case(23, (n) => n + 1),
                Case("asdf", (s) => s.length),
                Case(a + 1 === 2, () => 2),
                DefaultCase(-1),
            );
        }

        const sampleClass = new SampleClass(1);
        assert.equal(testMatch(sampleClass), 1);

        const otherSampleClass = new OtherSampleClass(2);
        assert.equal(testMatch(otherSampleClass), 2);

        assert.equal(testMatch(23), 24);

        assert.equal(testMatch("asdf"), 4);

        assert.equal(testMatch(true), 2);

        assert.equal(testMatch(24), -1);
    });
});
