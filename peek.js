'use strict';

/**
 * Creates a new instance of the `Peek` class.
 *
 * @class
 * @param {number[]} indices
 * @param {string[]} values
 */
function Peek(indices, values) {
    this.indices = indices;
    this.values  = values;
}

module.exports = Peek;
