import Ajv from 'ajv';

const validate = (new Ajv()).compile({
  $schema: 'http://json-schema.org/draft-07/schema',
  $id: '',
  type: 'object',
  required: [
    'id',
    'message',
    'token',
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
    token: {
      $id: '#/properties/token',
      type: 'string',
      maxlength: 64,
      minLength: 1,
    },
  },
});

const test = (json, token) => {
  let payload;
  try {
    payload = JSON.parse(json);
    if (!validate(payload)) {
      throw {
        status: 400,
        payload: JSON.stringify(validate.errors),
      };
    }
    if (token && payload.token !== token) {
      throw {
        status: 403,
        payload: 'invalid token',
      };
    }
  } catch (error) {
    if (!error.status) {
      return {
        status: 400,
        payload: error.toString(),
      };
    }
    return error;
  }
  return {
    status: 204,
    payload,
  };
};

export { test };
