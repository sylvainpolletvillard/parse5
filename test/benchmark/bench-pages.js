var path        = require('path');
var fs          = require('fs');
var upstream    = require('parse5');
var workingCopy = require('../../index');
var testUtils   = require('../test_utils');

var wcParser = new workingCopy.Parser();
var usParser = new upstream.Parser();
var pages    = testUtils
    .loadSerializationTestData(path.join(__dirname, '../data/simple_api_parsing'))
    .map(function (test) {
        return test.src;
    });

function runPages (parser) {
    for (var j = 0; j < pages.length; j++)
        parser.parse(pages[j]);
}

module.exports = {
    name:  'parse5 regression benchmark - PAGES',
    tests: [
        {
            name: 'Working copy',

            fn: function () {
                runPages(wcParser);
            }
        },
        {
            name: 'Upstream',

            fn: function () {
                runPages(usParser);
            }
        }
    ]
};

