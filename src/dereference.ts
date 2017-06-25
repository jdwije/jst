import { merge, iterate, contains } from './index';
import * as uri from 'valid-url';

/**
 * This function _dereferences_ a schema set into one logical schema in
 * accordance with the IETF JSON Reference Draft v3 specification:
 *
 * https://tools.ietf.org/html/draft-pbryan-zyp-json-ref-03
 *
 * It allows for one to inject a schema resolution function in order to provide
 * it with referenced schema. This allows developers to be flexible in choosing
 * there schema sources such as HTTP or in-memory resolvers.
 *
 * The dereference function also resolves JSON Pointers according to the IETF
 * RFC6901 specification:
 *
 * https://tools.ietf.org/html/rfc6901
 *
 * It does so internaly rather than through an external resolver in order to
 * remain efficient.
 *
 * @param {Array|Object} schema A schema or array of schema to dereference.
 * @param {Object} resolve A function to resolve referenced schema by its id.
 * @return {Object} The dereferenced schema as an object.
 */
const dereference = (schema: any, resolve = null): any => {
    // If schema is an array we dereference each schema and then merge them from
    // right-to-left.
    if (Array.isArray(schema)) {
        // first validate our arguments assumption!
        schema.forEach((s) => {
            if (typeof s !== 'object' && !Array.isArray(s))
                throw new TypeError(`expect typeof object got: ${typeof s}`);
        });

        // then dereference each schema in the array before eventually merging them
        // from right to left using a reducer function.
        return schema
            .map((s) => dereference(s, resolve))
            .reduce((accumulator, value) => merge(accumulator, value, true), {});
    }
    // If schema is not an array of json objects we expect a singlular json schema
    // be provided
    else if (typeof schema === 'object' && !Array.isArray(schema)) {
        // traverse is an internal recursive function that we bind to this lexical
        // scope in order to easily resolve to schema definitons whilst traversing
        // an objects nested properties. This is primarily for efficiency concerns.
        const traverse = (node) => {
            let resolution = {};

            if (typeof node !== 'object' || node === null) return node;

            // if only one argument is provided and it is an array we must recursively
            // dereference it's individual values
            if (Array.isArray(node)) {
                return node.map((v) => traverse(v));
            }

            // if we are here, the first argument is not an array or value and we expect
            // it to be a json schema.
            iterate(node, (key, value) => {
                // Skip the following properties
                if (key === 'definitions') return;

                // If value is not an array, object, or JSON schema reference we can
                // dereference it immediately. 'typeof array' equals 'object' in JS.
                if (typeof value !== 'object' && key !== '$ref') {
                    resolution[key] = value;
                }
                // If we have a schema reference we must fetch it, dereference it, then merge
                // it into the base schema object.
                else if (key === '$ref') {
                    // We have two types of references - definitions which are defined
                    // within the current schema and external schema references which we
                    // have to query AJV for as such we must fetch the schema for the
                    // reference appropriately.
                    let reference = null;

                    // de-reference a json uri
                    if (uri.isUri(value)) {
                        if (!resolve)
                            throw new TypeError(
                                'resolver function is required to dereference a json uri.')
                            ;
                        reference = resolve(value);

                        if (!reference) throw new Error(`unable to resolve URI reference: ${value}`);

                        resolution = merge(
                            resolution,
                            dereference(reference, resolve),
                            true
                        );
                    }
                    // de-reference a json pointer
                    else if (
                        value.indexOf('#') === 0 ||
                        value.indexOf('/') === 0 ||
                        value === ''
                    ) {
                        const fragments = value.split('/');

                        reference = fragments.reduce((acc, token) => {
                            // when root document pointer return accumulator
                            if (token === '#' || token === '/' || token === '')
                                return acc;

                            // decode token according to spec
                            const refToken = token.replace('~1', '/').replace('~0', '~');

                            let refValue = null;

                            // if current accumulator is array we must dereference the array
                            // index
                            if (Array.isArray(acc)) {
                                const index = parseInt(token, 10);

                                if (!acc.indexOf(index))
                                    throw new Error(`could not dereference array index ${value}`);

                                refValue = acc[index];
                            }
                            // otherwise we expect an object, validate reference token
                            else {
                                if (!contains(acc, refToken))
                                    throw new Error(`could not dereference pointer ${value}`);

                                refValue = acc[refToken];
                            }

                            return refValue;
                        }, schema);

                        resolution = merge(
                            resolution,
                            traverse(reference),
                            true
                        );
                    }
                    else {
                        throw new Error(
                            `could not dereference value as a json pointer or uri: ${value}`);
                    }

                    if (!reference)
                        throw new ReferenceError(`could not find a reference to ${value}`);
                }
                // Otherwise the value is an array or object and we need to traverse it
                // and dereference it's properties.
                else {
                    resolution[key] = traverse(value);
                }
            });

            return resolution;
        };

        return traverse(schema);
    }
    // if any other combination of arguments is provided we throw
    else {
        throw new TypeError(`expected first parameter to be object or array: ${schema}`);
    }
};

export default dereference;
