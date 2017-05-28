import clone from 'clone';

/**
 * A method to safely iterate the properties of an object and execute some
 * function for each of them.
 *
 * @param {Object} object An object literal to iterate over.
 * @param {Function} fn A function to execute for each key in the object.
 */
const iterate = function(object, fn) {
    for (const prop in object) {
        if (object.hasOwnProperty(prop)) {
            fn(prop, object[prop]);
        }
    }
};

/**
 * An object literal variant of the Array.map function. Iterate the properties
 * of an object applying some function to each one of them and return a new object
 * with the results.
 *
 * @param {Object} object An object literal to iterate over.
 * @param {Function} fn A function to execute for each key in the object.
 * @return {Object} A new object literal.
 */
const map = function(object, fn) {
    const result = {};

    iterate(object, (key, value) => {
        result[key] = fn(key, value);
    });

    return result;
};

/**
 * A simple function to safely check if an object has a given property
 *
 * @param {Object} object An object literal to iterate over.
 * @param {String} key The property to check the object for.
 * @return {Boolean} The boolean result of the check.
 */
const contains = function(object, key) {
    return object.hasOwnProperty(key);
};

/**
 * A function to allowing deep merging of object literals using various
 * strategies.
 *
 * @param {Object} object The base object we would like to merge into.
 * @param {Object} object The object we would like to extend base with.
 * @param {Boolean} overide Whether to override properties in base if they exist in both objecys.
 * @return {Object} A new object literal.
 */
const merge = function(base, extension, overide = false) {
    const object = clone(base, true);

    iterate(extension, (key, value) => {
        if (contains(base, key) && overide === false) return;

        // if object recurse
        if (typeof value === 'object' && contains(base, key)) {
            // we expect object node to also be an object
            object[key] = merge(base[key], value, overide);
        }
        // otherwise assign property/value, should we be merging arrays?
        else {
            object[key] = value;
        }
    });

    return object;
};

export {
    iterate,
    map,
    merge,
    contains,
    clone, // we export this here for convenience
};
