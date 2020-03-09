const mutations = {
  async createItem(parent, args, context, info) {
    // Todo: Check if they are logged in

    const item = await context.db.mutation.createItem(
      {
        data: { ...args },
      },
      info
    );

    return item;
  },
};

module.exports = mutations;
