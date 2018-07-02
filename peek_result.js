'use strict';

/**
 * Creates a new instance of the `PeekResult` class.
 *
 * @class
 * @param {Element} element
 * @param {number} nextIndex
 */
function PeekResult(element, nextIndex) {
    this.element   = element;
    this.nextIndex = nextIndex;
}

module.exports = PeekResult;
