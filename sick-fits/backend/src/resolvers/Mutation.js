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
  async updateItem(parent, args, context, info) {
    const updates = { ...args };

    delete updates.id;

    const item = await context.db.mutation.updateItem(
      {
        data: updates,
        where: {
          id: args.id,
        },
      },
      info
    );

    return item;
  },
  async deleteItem(parent, args, context, info) {
    const where = { id: args.id };

    // 1. find the item
    const item = await context.db.query.item({ where }, `{
      id
      title
    }`);

    // 2. Check if they own that item, or have the permissions

    // 3. Delete it
    const deleteItemPromise = context.db.mutation.deleteItem({ where }, info);

    return deleteItemPromise;
  }
};

module.exports = mutations;
