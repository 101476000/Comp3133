const { GraphQLError } = require('graphql');

function badRequest(message, details = null) {
  return new GraphQLError(message, {
    extensions: { code: 'BAD_REQUEST', details }
  });
}

function unauthorized(message = 'Unauthorized') {
  return new GraphQLError(message, {
    extensions: { code: 'UNAUTHORIZED' }
  });
}

function notFound(message = 'Not found') {
  return new GraphQLError(message, {
    extensions: { code: 'NOT_FOUND' }
  });
}

function conflict(message = 'Conflict') {
  return new GraphQLError(message, {
    extensions: { code: 'CONFLICT' }
  });
}

module.exports = { badRequest, unauthorized, notFound, conflict };
