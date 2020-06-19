import Ajv from 'ajv';

const validate = (new Ajv()).compile({
  $schema: 'http://json-schema.org/draft-07/schema',
  $id: '',
  type: 'object',
  required: [
    'message',
    'receiver',
    'token',
  ],
  additionalProperties: false,
  properties: {
    message: {
      $id: '#/properties/message',
      type: 'string',
      minLength: 1,
    },
    receiver: {
      $id: '#/properties/receiver',
      type: 'object',
      required: [
        'name',
        'isAlias',
        'category',
      ],
      additionalProperties: false,
      properties: {
        name: {
          $id: '#/properties/receiver/properties/name',
          type: 'string',
          minLength: 1,
        },
        isAlias: {
          $id: '#/properties/receiver/properties/isAlias',
          type: 'boolean',
        },
        category: {
          $id: '#/properties/category',
          type: 'string',
          enum: [
            'friend',
            'group',
          ],
        },
      },
    },
    token: {
      $id: '#/properties/token',
      type: 'string',
      maxlength: 64,
      minLength: 1,
    },
  },
});

export { validate };
