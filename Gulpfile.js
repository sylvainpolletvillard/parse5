var gulp      = require('gulp');
var babel     = require('gulp-babel');
var mocha     = require('gulp-mocha');
var install   = require('gulp-install');
var benchmark = require('gulp-benchmark');
var rename    = require('gulp-rename');
var through   = require('through2');
var del       = require('del');

gulp.task('clean', function (cb) {
    del('lib/tokenizer', cb);
});

gulp.task('generate-trie', function () {
    function trieGenerator (file, enc, callback) {
        var entitiesData = JSON.parse(file.contents.toString());

        var trie = Object.keys(entitiesData).reduce(function (trie, entity) {
            var codepoints = entitiesData[entity].codepoints;

            entity = entity.replace(/^&/, '');

            var last = entity.length - 1,
                leaf = trie;

            entity
                .split('')
                .map(function (ch) {
                    return ch.charCodeAt(0);
                })
                .forEach(function (key, idx) {
                    if (!leaf[key])
                        leaf[key] = {};

                    if (idx === last)
                        leaf[key].c = codepoints;

                    else {
                        if (!leaf[key].l)
                            leaf[key].l = {};

                        leaf = leaf[key].l;
                    }
                });

            return trie;
        }, {});

        var out = '\'use strict\';\n\n' +
                  '//NOTE: this file contains auto-generated trie structure that is used for named entity references consumption\n' +
                  '//(see: http://www.whatwg.org/specs/web-apps/current-work/multipage/tokenization.html#tokenizing-character-references and\n' +
                  '//http://www.whatwg.org/specs/web-apps/current-work/multipage/named-character-references.html#named-character-references)\n' +
                  'module.exports = ' + JSON.stringify(trie).replace(/"/g, '') + ';\n';


        file.contents = new Buffer(out);

        callback(null, file);
    }

    return gulp
        .src('src/tokenizer/entities.json')
        .pipe(through.obj(trieGenerator))
        .pipe(rename('named-entity-trie.js'))
        .pipe(gulp.dest('lib/tokenizer'));
});

gulp.task('install-upstream-parse5', function () {
    return gulp
        .src('test/benchmark/package.json')
        .pipe(install());
});

gulp.task('benchmark', ['build', 'install-upstream-parse5'], function () {
    return gulp
        .src('test/benchmark/*.js', { read: false })
        .pipe(benchmark({
            failOnError: true,
            reporters:   benchmark.reporters.etalon('Upstream')
        }));
});

gulp.task('build', ['generate-trie'], function () {
    return gulp
        .src('src/**/*.js')
        .pipe(babel())
        .pipe(gulp.dest('lib'));
});

gulp.task('test', ['build'], function () {
    return gulp
        .src('test/fixtures/tokenizer-test.js')
        .pipe(mocha({
            ui:       'exports',
            reporter: 'progress',
            timeout:  typeof v8debug === 'undefined' ? 2000 : Infinity // NOTE: disable timeouts in debug
        }));
});
