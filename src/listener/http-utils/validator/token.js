import Ajv from 'ajv';

const validate = (new Ajv()).compile({
  $schema: 'http://json-schema.org/draft-07/schema',
  $id: '',
  required: [
    'rpcToken',
  ],
  additionalProperties: false,
  properties: {
    rpcToken: {
      $id: '#/properties/rpcToken',
      type: 'string',
      maxLength: 64,
      minLength: 1,
    },
  },
});

export { validate };
