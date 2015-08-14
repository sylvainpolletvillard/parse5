var assert = require('assert'),
    HTML = require('../../lib/common/html'),
    OpenElementStack = require('../../lib/tree_construction/open_element_stack'),
    TestUtils = require('../test_utils');

//Aliases
var NS = HTML.NAMESPACES;

TestUtils.generateTestsForEachTreeAdapter(module.exports, function (_test, treeAdapter) {
    _test['Push element'] = function () {
        var document = treeAdapter.createDocument(),
            element1 = treeAdapter.createElement('#element1', 'namespace1', []),
            element2 = treeAdapter.createElement('#element2', 'namespace2', []),
            stack = new OpenElementStack(document, treeAdapter);

        assert.strictEqual(stack.current, document);
        assert.strictEqual(stack.stackTop, -1);

        stack.push(element1);
        assert.strictEqual(stack.current, element1);
        assert.strictEqual(stack.currentTagName, treeAdapter.getTagName(element1));
        assert.strictEqual(stack.stackTop, 0);

        stack.push(element2);
        assert.strictEqual(stack.current, element2);
        assert.strictEqual(stack.currentTagName, treeAdapter.getTagName(element2));
        assert.strictEqual(stack.stackTop, 1);
    };

    _test['Pop element'] = function () {
        var element = treeAdapter.createElement('#element', 'namespace1', []),
            stack = new OpenElementStack(treeAdapter.createDocument(), treeAdapter);

        stack.push(element);
        stack.push('#element2');
        stack.pop();
        assert.strictEqual(stack.current, element);
        assert.strictEqual(stack.currentTagName, treeAdapter.getTagName(element));
        assert.strictEqual(stack.stackTop, 0);

        stack.pop();
        assert.ok(!stack.current);
        assert.ok(!stack.currentTagName);
        assert.strictEqual(stack.stackTop, -1);
    };

    _test['Replace element'] = function () {
        var element = treeAdapter.createElement('#element', 'namespace', []),
            newElement = treeAdapter.createElement('#newElement', 'newElementNamespace', []),
            stack = new OpenElementStack(treeAdapter.createDocument(), treeAdapter);

        stack.push('#element2');
        stack.push(element);
        stack.replace(element, newElement);
        assert.strictEqual(stack.current, newElement);
        assert.strictEqual(stack.currentTagName, treeAdapter.getTagName(newElement));
        assert.strictEqual(stack.stackTop, 1);
    };

    _test['Insert element after element'] = function () {
        var element1 = treeAdapter.createElement('#element1', 'namespace1', []),
            element2 = treeAdapter.createElement('#element2', 'namespace2', []),
            element3 = treeAdapter.createElement('#element3', 'namespace3', []),
            stack = new OpenElementStack(treeAdapter.createDocument(), treeAdapter);

        stack.push(element1);
        stack.push(element2);
        stack.insertAfter(element1, element3);
        assert.strictEqual(stack.stackTop, 2);
        assert.strictEqual(stack.items[1], element3);

        stack.insertAfter(element2, element1);
        assert.strictEqual(stack.stackTop, 3);
        assert.strictEqual(stack.current, element1);
        assert.strictEqual(stack.currentTagName, treeAdapter.getTagName(element1));
    };

    _test['Pop elements until popped with given tagName'] = function () {
        var element1 = treeAdapter.createElement('#element1', '', []),
            element2 = treeAdapter.createElement('#element2', '', []),
            stack = new OpenElementStack(treeAdapter.createDocument(), treeAdapter);

        stack.push(element2);
        stack.push(element2);
        stack.push(element2);
        stack.push(element2);
        stack.popUntilTagNamePopped(treeAdapter.getTagName(element1));
        assert.ok(!stack.current);
        assert.strictEqual(stack.stackTop, -1);

        stack.push(element2);
        stack.push(element1);
        stack.push(element2);
        stack.popUntilTagNamePopped(treeAdapter.getTagName(element1));
        assert.strictEqual(stack.current, element2);
        assert.strictEqual(stack.stackTop, 0);
    };

    _test['Pop elements until given element popped'] = function () {
        var element1 = treeAdapter.createElement('#element1', '', []),
            element2 = treeAdapter.createElement('#element2', '', []),
            stack = new OpenElementStack(treeAdapter.createDocument(), treeAdapter);

        stack.push(element2);
        stack.push(element2);
        stack.push(element2);
        stack.push(element2);
        stack.popUntilElementPopped(element1);
        assert.ok(!stack.current);
        assert.strictEqual(stack.stackTop, -1);

        stack.push(element2);
        stack.push(element1);
        stack.push(element2);
        stack.popUntilElementPopped(element1);
        assert.strictEqual(stack.current, element2);
        assert.strictEqual(stack.stackTop, 0);
    };

    _test['Pop elements until numbered header popped'] = function () {
        var element1 = treeAdapter.createElement('h3', '', []),
            element2 = treeAdapter.createElement('#element2', '', []),
            stack = new OpenElementStack(treeAdapter.createDocument(), treeAdapter);

        stack.push(element2);
        stack.push(element2);
        stack.push(element2);
        stack.push(element2);
        stack.popUntilNumberedHeaderPopped();
        assert.ok(!stack.current);
        assert.strictEqual(stack.stackTop, -1);

        stack.push(element2);
        stack.push(element1);
        stack.push(element2);
        stack.popUntilNumberedHeaderPopped();
        assert.strictEqual(stack.current, element2);
        assert.strictEqual(stack.stackTop, 0);
    };

    _test['Pop all up to <html> element'] = function () {
        var htmlElement = treeAdapter.createElement('html', NS.HTML, []),
            stack = new OpenElementStack(treeAdapter.createDocument(), treeAdapter);

        stack.push(htmlElement);
        stack.push('#element1');
        stack.push('#element2');

        stack.popAllUpToHtmlElement();
        assert.strictEqual(stack.current, htmlElement);
    };

    _test['Clear back to a table context'] = function () {
        var htmlElement = treeAdapter.createElement('html', '', []),
            tableElement = treeAdapter.createElement('table', '', []),
            divElement = treeAdapter.createElement('div', '', []),
            stack = new OpenElementStack(treeAdapter.createDocument(), treeAdapter);

        stack.push(htmlElement);
        stack.push(divElement);
        stack.push(divElement);
        stack.push(divElement);
        stack.clearBackToTableContext();
        assert.strictEqual(stack.current, htmlElement);
        assert.strictEqual(stack.stackTop, 0);

        stack.push(divElement);
        stack.push(tableElement);
        stack.push(divElement);
        stack.push(divElement);
        stack.clearBackToTableContext();
        assert.strictEqual(stack.current, tableElement);
        assert.strictEqual(stack.stackTop, 2);
    };

    _test['Clear back to a table body context'] = function () {
        var htmlElement = treeAdapter.createElement('html', '', []),
            theadElement = treeAdapter.createElement('thead', '', []),
            divElement = treeAdapter.createElement('div', '', []),
            stack = new OpenElementStack(treeAdapter.createDocument(), treeAdapter);

        stack.push(htmlElement);
        stack.push(divElement);
        stack.push(divElement);
        stack.push(divElement);
        stack.clearBackToTableBodyContext();
        assert.strictEqual(stack.current, htmlElement);
        assert.strictEqual(stack.stackTop, 0);

        stack.push(divElement);
        stack.push(theadElement);
        stack.push(divElement);
        stack.push(divElement);
        stack.clearBackToTableBodyContext();
        assert.strictEqual(stack.current, theadElement);
        assert.strictEqual(stack.stackTop, 2);
    };

    _test['Clear back to a table row context'] = function () {
        var htmlElement = treeAdapter.createElement('html', '', []),
            trElement = treeAdapter.createElement('tr', '', []),
            divElement = treeAdapter.createElement('div', '', []),
            stack = new OpenElementStack(treeAdapter.createDocument(), treeAdapter);

        stack.push(htmlElement);
        stack.push(divElement);
        stack.push(divElement);
        stack.push(divElement);
        stack.clearBackToTableRowContext();
        assert.strictEqual(stack.current, htmlElement);
        assert.strictEqual(stack.stackTop, 0);

        stack.push(divElement);
        stack.push(trElement);
        stack.push(divElement);
        stack.push(divElement);
        stack.clearBackToTableRowContext();
        assert.strictEqual(stack.current, trElement);
        assert.strictEqual(stack.stackTop, 2);
    };

    _test['Remove element'] = function () {
        var element = treeAdapter.createElement('#element', '', []),
            stack = new OpenElementStack(treeAdapter.createDocument(), treeAdapter);

        stack.push(element);
        stack.push(treeAdapter.createElement('element1', '', []));
        stack.push(treeAdapter.createElement('element2', '', []));

        stack.remove(element);

        assert.strictEqual(stack.stackTop, 1);

        for (var i = stack.stackTop; i >= 0; i--)
            assert.notStrictEqual(stack.items[i], element);
    };

    _test['Try peek properly nested <body> element'] = function () {
        var bodyElement = treeAdapter.createElement('body', '', []),
            stack = new OpenElementStack(treeAdapter.createDocument(), treeAdapter);

        stack.push(treeAdapter.createElement('html', '', []));
        stack.push(bodyElement);
        stack.push(treeAdapter.createElement('div', '', []));
        assert.strictEqual(stack.tryPeekProperlyNestedBodyElement(), bodyElement);

        stack = new OpenElementStack(treeAdapter.createDocument(), treeAdapter);
        stack.push(treeAdapter.createElement('html', '', []));
        assert.ok(!stack.tryPeekProperlyNestedBodyElement());
    };

    _test['Is root <html> element current'] = function () {
        var stack = new OpenElementStack(treeAdapter.createDocument(), treeAdapter);

        stack.push(treeAdapter.createElement('html', '', []));
        assert.ok(stack.isRootHtmlElementCurrent());

        stack.push(treeAdapter.createElement('div', '', []));
        assert.ok(!stack.isRootHtmlElementCurrent());
    };

    _test['Get common ancestor'] = function () {
        var stack = new OpenElementStack(treeAdapter.createDocument(), treeAdapter),
            element = treeAdapter.createElement('#element', '', []),
            ancestor = treeAdapter.createElement('#ancestor', '', []);

        stack.push(treeAdapter.createElement('#someElement', '', []));
        assert.ok(!stack.getCommonAncestor(element));

        stack.pop();
        assert.ok(!stack.getCommonAncestor(element));

        stack.push(element);
        assert.ok(!stack.getCommonAncestor(element));

        stack.push(treeAdapter.createElement('#someElement', '', []));
        stack.push(ancestor);
        stack.push(element);
        assert.strictEqual(stack.getCommonAncestor(element), ancestor);
    };

    _test['Contains element'] = function () {
        var stack = new OpenElementStack(treeAdapter.createDocument(), treeAdapter),
            element = treeAdapter.createElement('#element', '', []);

        stack.push(treeAdapter.createElement('#someElement', '', []));
        assert.ok(!stack.contains(element));

        stack.push(element);
        assert.ok(stack.contains(element));
    };

    _test['Has element in scope'] = function () {
        var stack = new OpenElementStack(treeAdapter.createDocument(), treeAdapter);

        stack.push(treeAdapter.createElement('html', NS.HTML, []));
        stack.push(treeAdapter.createElement('div', NS.HTML, []));
        assert.ok(!stack.hasInScope('p'));

        stack.push(treeAdapter.createElement('p', NS.HTML, []));
        stack.push(treeAdapter.createElement('ul', NS.HTML, []));
        stack.push(treeAdapter.createElement('button', NS.HTML, []));
        stack.push(treeAdapter.createElement('option', NS.HTML, []));
        assert.ok(stack.hasInScope('p'));

        stack.push(treeAdapter.createElement('title', NS.SVG, []));
        assert.ok(!stack.hasInScope('p'));
    };

    _test['Has numbered header in scope'] = function () {
        var stack = new OpenElementStack(treeAdapter.createDocument(), treeAdapter);

        stack.push(treeAdapter.createElement('html', NS.HTML, []));
        stack.push(treeAdapter.createElement('div', NS.HTML, []));
        assert.ok(!stack.hasNumberedHeaderInScope());

        stack.push(treeAdapter.createElement('p', NS.HTML, []));
        stack.push(treeAdapter.createElement('ul', NS.HTML, []));
        stack.push(treeAdapter.createElement('h3', NS.HTML, []));
        stack.push(treeAdapter.createElement('option', NS.HTML, []));
        assert.ok(stack.hasNumberedHeaderInScope());

        stack.push(treeAdapter.createElement('title', NS.SVG, []));
        assert.ok(!stack.hasNumberedHeaderInScope());

        stack.push(treeAdapter.createElement('h6', NS.HTML, []));
        assert.ok(stack.hasNumberedHeaderInScope());
    };

    _test['Has element in list item scope'] = function () {
        var stack = new OpenElementStack(treeAdapter.createDocument(), treeAdapter);

        stack.push(treeAdapter.createElement('html', NS.HTML, []));
        stack.push(treeAdapter.createElement('div', NS.HTML, []));
        assert.ok(!stack.hasInListItemScope('p'));

        stack.push(treeAdapter.createElement('p', NS.HTML, []));
        stack.push(treeAdapter.createElement('button', NS.HTML, []));
        stack.push(treeAdapter.createElement('option', NS.HTML, []));
        assert.ok(stack.hasInListItemScope('p'));

        stack.push(treeAdapter.createElement('ul', NS.HTML, []));
        assert.ok(!stack.hasInListItemScope('p'));
    };

    _test['Has element in button scope'] = function () {
        var stack = new OpenElementStack(treeAdapter.createDocument(), treeAdapter);

        stack.push(treeAdapter.createElement('html', NS.HTML, []));
        stack.push(treeAdapter.createElement('div', NS.HTML, []));
        assert.ok(!stack.hasInButtonScope('p'));

        stack.push(treeAdapter.createElement('p', NS.HTML, []));
        stack.push(treeAdapter.createElement('ul', NS.HTML, []));
        stack.push(treeAdapter.createElement('option', NS.HTML, []));
        assert.ok(stack.hasInButtonScope('p'));

        stack.push(treeAdapter.createElement('button', NS.HTML, []));
        assert.ok(!stack.hasInButtonScope('p'));
    };


    _test['Has element in table scope'] = function () {
        var stack = new OpenElementStack(treeAdapter.createDocument(), treeAdapter);

        stack.push(treeAdapter.createElement('html', NS.HTML, []));
        stack.push(treeAdapter.createElement('div', NS.HTML, []));
        assert.ok(!stack.hasInTableScope('p'));

        stack.push(treeAdapter.createElement('p', NS.HTML, []));
        stack.push(treeAdapter.createElement('ul', NS.HTML, []));
        stack.push(treeAdapter.createElement('td', NS.HTML, []));
        stack.push(treeAdapter.createElement('option', NS.HTML, []));
        assert.ok(stack.hasInTableScope('p'));

        stack.push(treeAdapter.createElement('table', NS.HTML, []));
        assert.ok(!stack.hasInTableScope('p'));
    };

    _test['Has table body context in table scope'] = function () {
        var stack = new OpenElementStack(treeAdapter.createDocument(), treeAdapter);

        stack.push(treeAdapter.createElement('html', NS.HTML, []));
        stack.push(treeAdapter.createElement('div', NS.HTML, []));
        assert.ok(!stack.hasTableBodyContextInTableScope());

        stack.push(treeAdapter.createElement('table', NS.HTML, []));
        stack.push(treeAdapter.createElement('ul', NS.HTML, []));
        stack.push(treeAdapter.createElement('tbody', NS.HTML, []));
        stack.push(treeAdapter.createElement('option', NS.HTML, []));
        assert.ok(stack.hasTableBodyContextInTableScope());

        stack.push(treeAdapter.createElement('table', NS.HTML, []));
        assert.ok(!stack.hasTableBodyContextInTableScope());

        stack.push(treeAdapter.createElement('tfoot', NS.HTML, []));
        assert.ok(stack.hasTableBodyContextInTableScope());
    };

    _test['Has element in select scope'] = function () {
        var stack = new OpenElementStack(treeAdapter.createDocument(), treeAdapter);

        stack.push(treeAdapter.createElement('html', NS.HTML, []));
        stack.push(treeAdapter.createElement('div', NS.HTML, []));
        assert.ok(!stack.hasInSelectScope('p'));

        stack.push(treeAdapter.createElement('p', NS.HTML, []));
        stack.push(treeAdapter.createElement('option', NS.HTML, []));
        assert.ok(stack.hasInSelectScope('p'));

        stack.push(treeAdapter.createElement('div', NS.HTML, []));
        assert.ok(!stack.hasInSelectScope('p'));
    };

    _test['Generate implied end tags'] = function () {
        var stack = new OpenElementStack(treeAdapter.createDocument(), treeAdapter);

        stack.push(treeAdapter.createElement('html', NS.HTML, []));
        stack.push(treeAdapter.createElement('li', NS.HTML, []));
        stack.push(treeAdapter.createElement('div', NS.HTML, []));
        stack.push(treeAdapter.createElement('li', NS.HTML, []));
        stack.push(treeAdapter.createElement('option', NS.HTML, []));
        stack.push(treeAdapter.createElement('p', NS.HTML, []));

        stack.generateImpliedEndTags();

        assert.strictEqual(stack.stackTop, 2);
        assert.strictEqual(stack.currentTagName, 'div');
    };

    _test['Generate implied end tags with exclusion'] = function () {
        var stack = new OpenElementStack(treeAdapter.createDocument(), treeAdapter);

        stack.push(treeAdapter.createElement('html', NS.HTML, []));
        stack.push(treeAdapter.createElement('li', NS.HTML, []));
        stack.push(treeAdapter.createElement('div', NS.HTML, []));
        stack.push(treeAdapter.createElement('li', NS.HTML, []));
        stack.push(treeAdapter.createElement('option', NS.HTML, []));
        stack.push(treeAdapter.createElement('p', NS.HTML, []));

        stack.generateImpliedEndTagsWithExclusion('li');

        assert.strictEqual(stack.stackTop, 3);
        assert.strictEqual(stack.currentTagName, 'li');
    };

    _test['Template count'] = function () {
        var stack = new OpenElementStack(treeAdapter.createDocument(), treeAdapter);

        stack.push(treeAdapter.createElement('html', NS.HTML, []));
        stack.push(treeAdapter.createElement('template', NS.MATHML, []));
        assert.strictEqual(stack.tmplCount, 0);

        stack.push(treeAdapter.createElement('template', NS.HTML, []));
        stack.push(treeAdapter.createElement('li', NS.HTML, []));
        assert.strictEqual(stack.tmplCount, 1);

        stack.push(treeAdapter.createElement('option', NS.HTML, []));
        stack.push(treeAdapter.createElement('template', NS.HTML, []));
        assert.strictEqual(stack.tmplCount, 2);

        stack.pop();
        assert.strictEqual(stack.tmplCount, 1);

        stack.pop();
        stack.pop();
        stack.pop();
        assert.strictEqual(stack.tmplCount, 0);
    };
});
