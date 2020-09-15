import Ajv from 'ajv';

const validate = (new Ajv({ allErrors: true })).compile({
  $schema: 'http://json-schema.org/draft-07/schema',
  $id: '',
  type: 'object',
  required: [
    'id',
    'message',
    'rpcToken',
  ],
  additionalProperties: false,
  properties: {
    id: {
      $id: '#/properties/id',
      type: 'integer',
      maximum: 9007199254740991,
      minimum: -9007199254740991,
    },
    message: {
      $id: '#/properties/message',
      type: 'string',
      minLength: 1,
    },
    rpcToken: {
      $id: '#/properties/rpcToken',
      type: 'string',
      maxLength: 64,
      minLength: 1,
    },
  },
});

export { validate };
