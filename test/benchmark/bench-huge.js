var path        = require('path');
var fs          = require('fs');
var upstream    = require('parse5');
var workingCopy = require('../../index');
var testUtils   = require('../test_utils');

var wcParser = new workingCopy.Parser();
var usParser = new upstream.Parser();
var hugePage = fs.readFileSync(path.join(__dirname, '../data/benchmark/huge-page.html')).toString();

function runHugePage (parser) {
    parser.parse(hugePage);
}

module.exports = {
    name:  'parse5 regression benchmark - HUGE',
    tests: [
        {
            name: 'Working copy',

            fn: function () {
                runHugePage(wcParser);
            }
        },
        {
            name: 'Upstream',

            fn: function () {
                runHugePage(usParser);
            }
        }
    ]
};

