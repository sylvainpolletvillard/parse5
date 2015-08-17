var path        = require('path');
var upstream    = require('parse5');
var workingCopy = require('../../index');
var testUtils   = require('../test_utils');

var wcParser = new workingCopy.Parser();
var usParser = new upstream.Parser();

var testData = testUtils.loadTreeConstructionTestData(
    [path.join(__dirname, '../data/tree_construction')],
    workingCopy.TreeAdapters.default
);

module.exports = {
    name:  'parse5 regression benchmark',
    tests: [
        {
            name: 'Working copy',

            fn: function () {
                for (var i = 0; i < testData.length; i++) {
                    if (testData[i].fragmentContext)
                        wcParser.parseFragment(testData[i].input, testData[i].fragmentContext);
                    else
                        wcParser.parse(testData[i].input);

                }
            }
        },
        {
            name: 'Upstream',

            fn: function () {
                for (var i = 0; i < testData.length; i++) {
                    if (testData[i].fragmentContext)
                        usParser.parseFragment(testData[i].input, testData[i].fragmentContext);
                    else
                        usParser.parse(testData[i].input);

                }
            }
        }
    ]
};
