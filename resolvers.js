const { AuthenticationError } = require('apollo-server');
//to create a new pin we need the pin model so...
const Pin = require('./models/Pin');

const authenticated = next => (root, args, ctx, info) => {
  if (!ctx.currentUser) {
    throw new AuthenticationError('You must be logged in');
  }
  return next(root, args, ctx, info);
};

module.exports = {
  Query: {
    me: (root, args, ctx) => ctx.currentUser, //all resolvers get access to (root, args, ctx)
  },
  Mutation: {
    createPin: authenticated(async (root, args, ctx) => {
      const newPin = await new Pin({
        ...args.input,
        author: ctx.currentUser._id,
      }).save();
      const pinAdded = await Pin.populate(newPin, 'author');
      return pinAdded;
    }),
  },
};
