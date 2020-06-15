const { forwardTo } = require('prisma-binding');
const { hasPermission } = require('../utils');

const Query = {
  items: forwardTo('db'),
  // async items(parent, args, context, info) {
  //   const items = await context.db.query.items();

  //   return items;
  // }
  item: forwardTo('db'),
  itemsConnection: forwardTo('db'),
  me: (parent, args, context, info) => {
    if (!context.request.userId) {
      return null;
    }

    const user = context.db.query.user({
      where: { id: context.request.userId }
    }, info);

    return user;
  },
  async users(parent, args, context, info) {
    // Check if they are logged in
    if (!context.request.userId) {
      throw new Error('You must be logged in!');
    }

    // Check if the user has the permissions to query all the users
    hasPermission(context.request.user, ['ADMIN', 'PERMISSION_UPDATE']);

    // if they do, query all the users!
    return context.db.query.users({}, info);
  }
};

module.exports = Query;
