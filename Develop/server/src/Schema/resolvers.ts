import User from "../models/User";
import { signToken, AuthenticationError } from "../services/auth";

// types/graphql.ts

export interface Book {
    bookId: string;
    title: string;
    authors?: string[];
    description?: string;
    image?: string;
    link?: string;
  }
  
  export interface User {
    isCorrectPassword(password: string): unknown;
    _id: string;
    username: string;
    email: string;
    password: string;
    savedBooks?: Book[];
  }
  
  export interface AuthPayload {
    token: string;
    user: User;
  }
  
  export interface Context {
    user?: User;
  }
  
  export interface LoginArgs {
    email?: string;
    username?: string;
    password: string;
  }
  
  export interface AddUserArgs {
    username: string;
    email: string;
    password: string;
  }
  
  export interface SaveBookArgs {
    book: Book;
  }
  
  export interface DeleteBookArgs {
    bookId: string;
  }
  

  const resolvers = {
    Query: {
      me: async (_parent: unknown, _args: unknown, context: Context): Promise<User | null> => {
        if (!context.user) throw AuthenticationError;
        return await User.findById(context.user._id);
      },
    },
  
    Mutation: {
      createUser: async (_parent: unknown, args: AddUserArgs): Promise<AuthPayload> => {
        const user = (await User.create(args)).toObject() as User;
        const token = signToken(user.username, user.email, user._id);
        return { token, user };
      },
  
      login: async (_parent: unknown, args: LoginArgs): Promise<AuthPayload> => {
        const user = await User.findOne({
            $or: [{ username: args.username }, { email: args.email }]
        }).lean() as unknown as User;
  
        if (!user) throw AuthenticationError;
  
        const correctPw = await user.isCorrectPassword(args.password);
        if (!correctPw) throw AuthenticationError;
  
        const token = signToken(user.username, user.email, user._id);
        return { token, user };
      },
  
      saveBook: async (_parent: unknown, { book }: SaveBookArgs, context: Context): Promise<User | null> => {
        if (!context.user) throw AuthenticationError;
  
        return await User.findByIdAndUpdate(
          context.user._id,
          { $addToSet: { savedBooks: book } },
          { new: true, runValidators: true }
        );
      },
  
      deleteBook: async (_parent: unknown, { bookId }: DeleteBookArgs, context: Context): Promise<User | null> => {
        if (!context.user) throw AuthenticationError;
  
        return await User.findByIdAndUpdate(
          context.user._id,
          { $pull: { savedBooks: { bookId } } },
          { new: true }
        );
      },
    },
  };
  
  export default resolvers;