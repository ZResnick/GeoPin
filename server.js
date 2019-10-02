const { ApolloServer } = require('apollo-server');
const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');
const mongoose = require('mongoose');
const { findOrCreateUser } = require('./controllers/userController');

require('dotenv').config();

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true })
  .then(() => console.log('DB was successfully connected'))
  .catch(err => console.error(err));

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    //must make this async due to the async funcs in userController
    let authToken = null;
    let currentUser = null;
    try {
      authToken = req.headers.authorization;
      if (authToken) {
        currentUser = await findOrCreateUser(authToken); //see above note about controllers
      }
    } catch (error) {
      console.error(
        `Unable to authenticate user with OAuth token ${authToken}`
      );
    }
    return { currentUser };
  },
});

server.listen().then(({ url }) => {
  console.log(`Studiously serving on ${url}`);
});
