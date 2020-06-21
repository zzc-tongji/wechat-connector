import Ajv from 'ajv';

const validate = (new Ajv()).compile({
  $schema: 'http://json-schema.org/draft-07/schema',
  $id: '',
  required: [
    'token',
  ],
  additionalProperties: true,
  properties: {
    token: {
      $id: '#/properties/token',
      type: 'string',
      maxLength: 64,
      minLength: 1,
    },
  },
});

export { validate };
