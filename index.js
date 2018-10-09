'use strict';

const Document          = require('./document');
const Element           = require('./element');
const Interpreter       = require('./interpreter');
const Peek              = require('./peek');
const PeekRequest       = require('./peek_request');
const PeekResult        = require('./peek_result');
const ReMarksDirectives = require('./directives/ReMarks_directives');
const ReMarksRenderers  = require('./renderers/ReMarks_renderers');

function dedupe(tree) {
    let i = 0;

    while(i < tree.length - 2) {
        if(tree[i].identifier === tree[i + 1].identifier) {
            tree[i].content += tree[i + 1].content;
            tree.splice(i + 1, 1);
        } else {
            i++;
        }
    }

    for(let j = 0; j < tree.length;  j++) {
        if((tree[j].content === null || tree[j].content === '') && tree[j].children.length === 0) {
            tree.splice(j, 1);
        }
    }

    return tree;
}

function render(array, output = '', depth = 0) {
    for(let i = 0; i < array.length; i++) {
        let parent   = array[i],
            children = parent.children;

        if(children.length > 0) {
            parent.content = render(children, '', depth + 1);
            output += ReMarksRenderers[parent.identifier](parent);
        } else {
            output += ReMarksRenderers[parent.identifier](parent);
        }
    }

    return output;
}

function convert(str, directives = ReMarksDirectives) {
    let i    = new Interpreter(directives),
        tree = i.decipher(function(value) {
                    return value.split(/^/gm);
               }, str);

    return render(dedupe(tree));
}

module.exports = {
    convert,
    Document,
    Element,
    Interpreter,
    Peek,
    PeekRequest,
    PeekResult,
    ReMarksDirectives,
    ReMarksRenderers
};
