'use strict';

const Peek        = require('./peek');
const PeekRequest = require('./peek_request');

function Interpreter(directives) {
    this.directives = directives;
}

Interpreter.prototype.read = function(document) {
    return this.decipher(function(value) {
        return value.split(/^/gm);
    }, document.source);
}

Interpreter.prototype.decipher = function(split, source) {
    let values     = split(source),
        vIndex     = 0,
        elements   = [ ];

    while(vIndex < values.length) {
        let value      = values[vIndex],
            isComplete = false,
            dIndex     = 0;

        while(!isComplete && dIndex < this.directives.length) {
            let directive = this.directives[dIndex],
                result    = directive.elementOf(value);

            if(result instanceof PeekRequest) {
                if(!result.distance && vIndex + result.distance < values.length) {
                    let distance = result.distance ? result.distance + 1 : values.length - vIndex;

                    let peek = new Peek([...Array(distance).keys()].map(i => i + vIndex), values.slice(vIndex, vIndex + distance));
                    result = directive.elementOf(peek);

                    if(result) {
                        if(directive.isRecursive) {
                            result.element.children = this.decipher(split, result.element.content);
                            result.element.content  = null;
                        }

                        elements.push(result.element);
                        vIndex = result.nextIndex;
                        isComplete = true;
                    }
                }
            } else if(result) {
                if(directive.isRecursive) {
                    result.children = this.decipher(split, result.content);
                    result.content  = null;
                }

                elements.push(result);
                vIndex++;
                isComplete = true;
            }

            if(!isComplete)
                dIndex++;
        }
    }

    return elements;
}

/*Controller.prototype.parse = function(document) {
    let blocks     = document.source.split(/^/gm),
        blockIndex = 0,
        tree       = [ ];

    while(blockIndex < blocks.length) {
        // console.log('===============================================================================');
        // console.log('Block: ' + blocks[blockIndex]);
        // console.log('  * Evaluating block #' + (blockIndex + 1) + '...');

        let block          = blocks[blockIndex],
            blockComplete  = false,
            directiveIndex = 0;

        while(!blockComplete && directiveIndex < this.directives.length) {
            // console.log('    * Attempting directive #' + (directiveIndex + 1) + ' on block #' + (blockIndex + 1) + '...');

            let directive = this.directives[directiveIndex],
                result    = directive(block);

            if(result instanceof PeekRequest) {
                // console.log('      * Directive #' + (directiveIndex + 1) + ' requests a Peek on block #' + (blockIndex + 1) + '...');

                if(!result.distance && blockIndex + result.distance < blocks.length) {
                    let distance = result.distance ? result.distance + 1 : blocks.length - blockIndex;

                    let peek = new Peek([...Array(distance).keys()].map(i => i + blockIndex), blocks.slice(blockIndex, blockIndex + distance));
                    result = directive(peek);

                    if(result) {
                        // console.log('      * Directive #' + (directiveIndex + 1) + '\'s Peek matches on block #' + (blockIndex + 1) + '!');

                        tree.push(result.element);
                        blockIndex = result.nextIndex;
                        blockComplete = true;
                    }
                }
            } else if(result) {
                // console.log('      * Directive #' + (directiveIndex + 1) + ' matches on block #' + (blockIndex + 1) + '!');

                tree.push(result);
                blockIndex++;
                blockComplete = true;
            }

            if(!blockComplete)
                directiveIndex++;
        }

        // console.log('  * Done evaluating block.');
    }

    return tree;
}*/

/*Controller.prototype.execute = function(document) {
    let blocks = document.source.split(/^/gm), map = [ ];

    for(let j = 0; j < blocks.length; j++) {
        console.log('  * now evaluating block ' + j);

        let block = blocks[j];

        for(let k = 0; k < this.directives.length; k++) {
            console.log('    * attempting directive ' + k + ' on block ' + j);

            let directive = this.directives[k], isPeekRequest = directive(block) instanceof PeekRequest;

            if(isPeekRequest) {
                console.log('    * directive ' + k + ' requested a peek, fulfilling...');

                let peekRequest = directive(value);

                if(!peekRequest.distance && j + peekRequest.distance >= blocks.length)
                    throw new Error();

                let distance = peekRequest.distance ? peekRequest.distance + 1: blocks.length - j,
                    peek = new Peek([...Array(distance).keys()].map(i => i + j), blocks.slice(j, j + distance)),
                    result = directive(peek);

                if(result) {
                    console.log('      * directive ' + k + '\'s peek was successful');

                    map.push(result.element);
                    j = result.nextIndex;
                }
            } else {
                if(directive(block)) {
                    console.log('      * directive ' + k + ' was a success');
                    map.push(directive(value));
                }
            }

            console.log('    * finished directive ' + k + ' on block ' + j);
        }

        console.log('  * done evaluating block ' + j);
    }

    return map;
}*/

module.exports = Interpreter;
