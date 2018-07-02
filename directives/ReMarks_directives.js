'use strict';

const Element     = require('../element');
const Peek        = require('../peek');
const PeekRequest = require('../peek_request');
const PeekResult  = require('../peek_result');

let ReMarksDirectives = [ ];

ReMarksDirectives.push({
    isRecursive: false,
    elementOf: function() {
        if(arguments[0] instanceof Peek) {
            let peek = arguments[0];

            if(peek.values.length < 2)
                return null;

            let isComplete = false, content = /^(```)([\s\S]*)$/g.exec(peek.values[0].trim())[2], i = 1;

            while(!isComplete && i < peek.values.length) {
                isComplete = /^([\s\S]*)(```)$/g.test(peek.values[i].trim());
                if(!isComplete)
                    content += peek.values[i];
                i++;
            }

            if(!isComplete)
                return null;

            return new PeekResult(new Element('preformatted_monospaced_code', content), peek.indices[i - 1] + 1);
        } else
            if(/^(```)([\s\S]*)$/g.test(arguments[0].trim()))
                return new PeekRequest(null);
            else
                return null;
    }
});

ReMarksDirectives.push({
    isRecursive: true,
    elementOf: function() {
        if(arguments[0] instanceof Peek) {
            let peek = arguments[0];

            let isComplete = false, content = /^>([\s\S]*)$/g.exec(peek.values[0].trim())[1].trim() + '\n', i = 1;

            while(!isComplete && i < peek.values.length) {
                isComplete = /^(\n*)$/g.test(peek.values[i]);
                if(!isComplete)
                    content += peek.values[i].trimLeft().replace(/^>/g, '');
                i++;
            }

            if(!isComplete && peek.values.length !== 1)
                return null;

            return new PeekResult(new Element('blockquote', content), peek.indices[i - 1] + 1);
        } else
            if(/^>[\s\S]*/g.test(arguments[0].trim()))
                return new PeekRequest(null);
            else
                return null;
    }
});

ReMarksDirectives.push({
    isRecursive: false,
    elementOf: function() {
        let match = /^(#{1,6})(.+?)(#{1,6})?$/g.exec(arguments[0].trim());
        return match ? new Element('heading', match[2].trim(), { level: match[1].length }) : null;
    }
});

ReMarksDirectives.push({
    isRecursive: false,
    elementOf: function() {
        if(arguments[0] instanceof Peek) {
            let peek = arguments[0];

            if(peek.values.length < 2)
                return null;

            let match = /^=+$/g.exec(peek.values[1].trim());
            return match ? new PeekResult(new Element('heading', peek.values[0].trim(), { level: 1 }), peek.indices[1] + 1) : null;
        } else
            return new PeekRequest(1);
    }
});

ReMarksDirectives.push({
    isRecursive: false,
    elementOf: function() {
        if(arguments[0] instanceof Peek) {
            let peek = arguments[0];

            if(peek.values.length < 2)
                return null;

            let match = /^-+$/g.exec(peek.values[1].trim());
            return match ? new PeekResult(new Element('heading', peek.values[0].trim(), { level: 2 }), peek.indices[1] + 1) : null;
        } else
            return new PeekRequest(1);
    }
});

ReMarksDirectives.push({
    isRecursive: false,
    elementOf: function() {
        let match = /^([-=*]+ *)+$/g.exec(arguments[0].trim());
        return match ? new Element('horizontal_rule') : null;
    }
});

ReMarksDirectives.push({
    isRecursive: false,
    elementOf: function() {
        return new Element('paragraph', arguments[0].trim());
    }
});

module.exports = ReMarksDirectives;
