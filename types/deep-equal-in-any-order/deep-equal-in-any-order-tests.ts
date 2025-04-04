import deepEqualInAnyOrder = require("deep-equal-in-any-order");

declare const expect: Chai.ExpectStatic;
declare const assert: Chai.AssertStatic;

import("chai").then(({ use }) => use(deepEqualInAnyOrder));

expect([1, 2]).to.deep.equalInAnyOrder([2, 1]);
expect([1, 2]).to.not.deep.equalInAnyOrder([2, 1, 3]);
expect({ foo: [1, 2], bar: [4, 89, 22] }).to.deep.equalInAnyOrder({ foo: [2, 1], bar: [4, 22, 89] });
expect({ foo: ["foo-1", "foo-2", [1, 2], null] }).to.deep.equalInAnyOrder({ foo: [null, [1, 2], "foo-1", "foo-2"] });
expect({ foo: [1, 2], bar: { baz: ["a", "b", { lorem: [5, 6] }] } }).to.deep.equalInAnyOrder({
    foo: [2, 1],
    bar: { baz: ["b", "a", { lorem: [6, 5] }] },
});

assert.deepEqualInAnyOrder([1, 2], [2, 1]);
assert.notDeepEqualInAnyOrder([1, 2], [2, 1, 3]);
assert.deepEqualInAnyOrder({ foo: [1, 2], bar: [4, 89, 22] }, { foo: [2, 1], bar: [4, 22, 89] });
assert.deepEqualInAnyOrder({ foo: ["foo-1", "foo-2", [1, 2], null] }, { foo: [null, [1, 2], "foo-1", "foo-2"] });
assert.deepEqualInAnyOrder({ foo: [1, 2], bar: { baz: ["a", "b", { lorem: [5, 6] }] } }, {
    foo: [2, 1],
    bar: { baz: ["b", "a", { lorem: [6, 5] }] },
});
