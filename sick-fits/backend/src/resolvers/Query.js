const { forwardTo } = require('prisma-binding');

const Query = {
  items: forwardTo('db'),
  // async items(parent, args, context, info) {
  //   const items = await context.db.query.items();

  //   return items;
  // }
  item: forwardTo('db'),
  itemsConnection: forwardTo('db'),
};

module.exports = Query;
