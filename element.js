'use strict';

/**
 * Creates a new instance of the `Element` class.
 *
 * @class
 * @param {string} identifier
 * @param {string} [content]
 * @param {Object} [options]
 */
function Element(identifier, content, options) {
    this.identifier = identifier;
    this.content    = content;
    this.options    = options;
    this.children   = [ ];
}

module.exports = Element;
