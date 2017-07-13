import * as Ajv from 'ajv';

const address = require('./../resources/address+v1.schema.json');
const addressOverride = require('./../resources/address-override+v1.schema.json');
const circular = require('./../resources/circular.schema.json');
const credentials = require('./../resources/credentials+v1.schema.json');
const editPerson = require('./../resources/edit-person+v1.schema.json');
const person = require('./../resources/person+v1.schema.json');
const profile = require('./../resources/profile+v1.schema.json');

/**
 * A validation helper for our test schema.
 */
export default class MockValidator {
    public schema: Array<Object> = [];
    private ajv;

    constructor(config: Object = {}) {
        const schema = [
            address,
            addressOverride,
            circular,
            credentials,
            editPerson,
            person,
            profile,
        ];
        const cnf = {
            extendRefs: true,
            allErrors: true,
            ...config
        };
        this.ajv = new Ajv(cnf);
        this.load(schema);
    }

    load(schema: Array<Object>) {
        schema.map((scm) => {
            this.ajv.addSchema(scm)
            this.schema.push(scm);
        });

        return this;
    }

    getSchema(id: string): Object | undefined {
        const lookup = this.ajv.getSchema(id);

        return !lookup ? undefined : lookup.schema;
    }
}
