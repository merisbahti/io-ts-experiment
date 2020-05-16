"use strict";
exports.__esModule = true;
var io = require("io-ts");
var extract_errors_with_path_1 = require("./extract-errors-with-path");
var O = require("optics-ts");
var friendsNames = O.optic()
    .prop('friends')
    .elems()
    .prop('name');
describe('lens/filter', function () {
    var source = [{ bar: 'baz' }, { bar: 'quux' }, { bar: 'xyzzy' }];
    var traversal = O.optic_()
        .filter(function (item) { return item.bar !== 'quux'; })
        .elems()
        .prop('bar');
    it('collect', function () {
        var result = O.collect(traversal)(source);
        expect(result).toEqual(['baz', 'xyzzy']);
    });
});
var value = {
    hello: [{ waddup: 5, snaddup: 'hello2' }, { snaddup: 'hello' }]
};
var lens = O.optic().prop('hello');
describe('test lenses', function () {
    it('okay should work', function () {
        var gotten = O.get(lens)(value);
        expect(gotten).toBe(value.hello);
    });
    it('okay should work 2', function () {
        var gotten = O.collect(lens.elems())(value);
        expect(gotten).toBe(value.hello);
    });
});
var carCodec = io.type({
    name: io.string,
    wheels: io.literal(4)
});
var bikeCodec = io.type({
    name: io.string,
    wheels: io.literal(2)
});
var codec = io.type({
    name: io.string,
    vehicles: io.array(io.union([carCodec, bikeCodec])),
    someTuple: io.tuple([io.string, io.number])
});
describe('extractErrorsWithPath', function () {
    var wrongTypeCarName = {
        name: 'heya',
        vehicles: [
            {
                name: 5 /* error here, should be string */,
                wheels: 4
            },
        ],
        someTuple: [100 /* error here, should be string */, 5]
    };
    it('just works', function () {
        var result = codec.decode(wrongTypeCarName);
        if (result._tag === 'Left') {
            var extracted = extract_errors_with_path_1["default"]('wrongTypeCarName', result.left);
            expect(extracted).toStrictEqual([
                {
                    path: 'wrongTypeCarName.vehicles.0.name',
                    expected: 'string',
                    found: 5
                },
                {
                    path: 'wrongTypeCarName.someTuple.0',
                    expected: 'string',
                    found: 100
                },
            ]);
        }
    });
});
