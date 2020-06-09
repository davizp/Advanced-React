const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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
  },
  async signUp(parent, args, context, info) {
    const email = args.email.toLowerCase();
    const password = await bcrypt.hash(args.password, 10);

    const user = await context.db.mutation.createUser(
      {
        data: {
          name: args.name,
          email,
          password,
          permissions: {
            set: ['USER'],
          },
        },
      },
      info
    );

    // Create JWT
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);

    // We set the jwt as a cookie
    context.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year cookie
    });

    return user;
  },
  async signIn(parent, args, context, info) {
    const { email, password } = args;

    // check if user exists
    const user = await context.db.query.user({ where: { email }});

    console.log('user', user);

    if (!user) {
      throw new Error('Invalid email or password');
    }

    // check if password is correct
    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      throw new Error('Invalid email or password')
    }

    // generate JWT Token
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);

    // Set Cookie
    context.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365
    })

    // Return the user
    return user;
  }
};

module.exports = mutations;
