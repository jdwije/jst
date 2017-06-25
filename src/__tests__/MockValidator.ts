import * as Ajv from 'ajv';

const person = require('./schema/person+v1.schema.json');
const address = require('./schema/address+v1.schema.json');
const addressOverride = require('./schema/address-override+v1.schema.json');
const editPerson = require('./schema/edit-person+v1.schema.json');
const credentials = require('./schema/credentials+v1.schema.json');
const profile = require('./schema/profile+v1.schema.json');

/**
 * A validation helper for our test schema.
 */
export default class MockValidator {
    public schema: Array<Object> = [];
    private ajv;

    constructor(config: Object = {}) {
        const schema = [
            person,
            address,
            addressOverride,
            editPerson,
            credentials,
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
