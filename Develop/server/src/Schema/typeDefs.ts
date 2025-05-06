const typeDefs = `
  type User {
    _id: ID!
    username: String!
    email: String!
    savedBooks: [Book]
  }

  type Book {
    bookId: String!
    title: String!
    authors: [String]
    description: String
    image: String
    link: String
  }

  type Auth {
    token: String!
    user: User!
  }

  type Query {
    me: User
    getUser(id: ID, username: String): User
  }

  type Mutation {
    login(username: String, email: String, password: String!): Auth
    createUser(username: String!, email: String!, password: String!): Auth
    saveBook(book: BookInput!): User
    deleteBook(bookId: String!): User
  }

  input BookInput {
    bookId: String!
    title: String!
    authors: [String]
    description: String
    image: String
    link: String
  }
`;
export default typeDefs;