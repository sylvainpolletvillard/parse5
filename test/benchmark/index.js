var path        = require('path');
var fs          = require('fs');
var upstream    = require('parse5');
var workingCopy = require('../../index');

var testHtml = fs.readFileSync(path.join(__dirname, './spec.html')).toString();
var wcParser = new workingCopy.Parser();
var usParser = new upstream.Parser();

module.exports = {
    name:  'parse5 regression benchmark',
    tests: [
        {
            name: 'Working copy',

            fn: function () {
                wcParser.parse(testHtml);
            }
        },
        {
            name: 'Upstream',

            fn: function () {
                usParser.parse(testHtml);
            }
        }
    ]
};
