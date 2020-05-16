"use strict";
exports.__esModule = true;
var extractErrorsWithPath = function (topObjectName, errors) {
    return errors.map(function (error) {
        var context = error.context;
        var path = context.reduce(function (acc, context) {
            if (context.key === '' ||
                // @ts-ignore
                context.type._tag === 'UnionType' ||
                // @ts-ignore
                context.type._tag === 'IntersectionType')
                return acc;
            return acc + "." + context.key;
        }, topObjectName);
        var lastContext = context[context.length - 1];
        return { path: path, expected: lastContext.type.name, found: lastContext.actual };
    });
};
console.log('hello world');
exports["default"] = extractErrorsWithPath;
