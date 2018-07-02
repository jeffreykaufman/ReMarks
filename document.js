'use strict';

const fs = require('fs');

/**
 * Creates a new instance of the `Document` class.
 *
 * @class
 * @param {string} path
 * @param {string} [encoding='utf-8']
 */
function Document(path, encoding = 'utf-8') {
    this.path   = path;
    this.source = fs.readFileSync(path).toString(encoding);
}

module.exports = Document;
