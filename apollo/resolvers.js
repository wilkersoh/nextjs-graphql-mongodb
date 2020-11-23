export const resolvers = {
  Query: {
    users(_parent, _args, _context, _info) {
      return _context.db
        .collection("users")
        .find()
        .toArray()
        .then((data) => {
          return data;
        });
    },
  },
};
