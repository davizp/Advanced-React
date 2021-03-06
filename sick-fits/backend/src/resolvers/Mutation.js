const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { randomBytes } = require('crypto');
const { promisify } = require('util');
const { resetPasswordTemplate, transport } = require('../mail');
const { hasPermission } = require('../utils');

const randomBytesPromisified = promisify(randomBytes);

const mutations = {
  async createItem(parent, args, context, info) {

    if (!context.request.userId) {
      throw Error('You must be logged in to do that!');
    }

    const item = await context.db.mutation.createItem(
      {
        data: {
          // This is how to create a relationship between and the Item and the user
          user: {
            connect: {
              id: context.request.userId
            }
          },
          ...args
        },
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
      user {
        id
      }
    }`);

    // 2. Check if they own that item, or have the permissions
    const ownsItem = item.user.id === context.request.userId;
    const hasPermissions = context.request.user.permissions.some(
      permission => ['ADMIN', 'ITEM_DELETE'].includes(permission)
    );

    if (!ownsItem || !hasPermissions) {
      throw new Error ('You don\'t have permission to do this.');
    }

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
  },
  signOut(parent, args, context, info) {
    context.response.clearCookie('token');

    return { message: 'done' };
  },
  async requestReset(parent, args, context, info) {
    const { email } = args;

    // check if is a real user
    const user = await context.db.query.user({ where: { email } });

    if (!user) {
      throw new Error(`No such user found for email ${email}`);
    }
    // set a reset token and expiry on that user
    const resetToken = (await randomBytesPromisified(20)).toString('hex');
    const resetTokenExpiry = Date.now() + 1000 * 60 * 60; // 1 hour from now
    const res = await context.db.mutation.updateUser({
      where: { email },
      data: { resetToken, resetTokenExpiry }
    });

    // email them the reset token
    const mailResponse = await transport.sendMail({
      from: 'dh_nz@hotmail.com',
      to: user.email,
      subject: 'Your Password Reset Token',
      html: resetPasswordTemplate(`\n
        Your Password Reset Token is here! \n\n
        <a href="${process.env.FRONTEND_URL}/reset?resetToken=${resetToken}">
          Click Here to Reset
        </a>
      `)
    });

    return { message: 'done' };
  },
  async resetPassword(parent, args, context, info) {
    const { password, confirmPassword, resetToken } = args;
    // check if the passwords match
    if (password !== confirmPassword) {
      throw new Error('Your passwords don\'t match!');
    }

    // check if its a legit reset token
    // check if its expired
    const [user] = await context.db.query.users({
      where: {
        resetToken,
        resetTokenExpiry_gte: Date.now() - 1000 * 60 * 60
      }
    });

    if (!user) {
      throw new Error('This token is either invalid or expired!');
    }

    // hash their new password
    const newPassword = await bcrypt.hash(args.password, 10);

    // save the new password and remove resetToken
    const updatedUser = await context.db.mutation.updateUser({
      where: { email: user.email },
      data: {
        password: newPassword,
        resetToken: null,
        resetTokenExpiry: null
      }
    });

    // Generate JWT
    const token = jwt.sign({ userId: updatedUser.id }, process.env.APP_SECRET);

    // SET JWT cookie
    context.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365
    });

    // return the user
    return updatedUser;
  },
  async updatePermissions(parent, args, context, info) {
    // Check if they are logged in
    if (!context.request.userId) {
      throw new Error('You must be logged in!');
    }

    // Query the current user
    const currentUser = await context.db.query.user(
      { where: { id: context.request.userId } },
      '{ id, permissions, email, name }'
    );

    if (!currentUser) {
      throw new Error('User doesn\'t exists!');
    }

    // check if they have permissions to do this
    hasPermission(currentUser, ['ADMIN', 'PERMISSION_UPDATE'])

    // update permissions
    return context.db.mutation.updateUser({
      data: {
        permissions: {
          set: args.permissions
        }
      },
      where: {
        id: args.userId
      }
    }, info);

  },
  async addToCart(parent, args, context, info) {
    const { userId } = context.request;

    if (!userId) {
      throw Error('You must be logged in to do that!');
    }

    const [existingCartItem] =  await context.db.query.cartItems({
      where: {
        user: { id: userId },
        item: { id: args.id }
      }
    });

    if (existingCartItem) {
      return context.db.mutation.updateCartItem({
        where: { id: existingCartItem.id },
        data: { quantity: existingCartItem.quantity + 1 }
      }, info);
    }

    return context.db.mutation.createCartItem({
      data: {
        user: {
          connect: { id: userId }
        },
        item: {
          connect: { id: args.id }
        }
      }
    }, info);
  }
};

module.exports = mutations;
