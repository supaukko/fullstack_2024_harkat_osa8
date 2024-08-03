const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const { v1: uuid } = require('uuid')
const { GraphQLError } = require('graphql')
const config = require('./utils/config')
const logger = require('./utils/logger')
const db = require('./utils/db')
const Author = require('./models/author')
const Book = require('./models/book')

const typeDefs = `
  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }

  type Book {
    title: String!
    published: Int!
    author: String!
    genres: [String!]!
    id: ID!
  }

  type Author {
    name: String!
    born: Int
    bookCount: Int
  }

  type EditAuthor {
    name: String!
    born: Int!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
    me: User
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ): Book
    editAuthor(
      name: String!
      setBornTo: Int!
    ): Author
    createUser(
      username: String!
      favoriteGenre: String!
    ): User
    login(
      username: String!
      password: String!
    ): Token
  }
`

const getAuthor = async (name) => {
  const result = await Author.findOne({ name: name })
  return result
}

const findBookByTitleAndAuthor = async (title, authorName) => {
  try {
    const book = await Book.findOne({ title }).populate({
      path: 'author',
      match: { name: authorName }
    }).exec()

    if (!book) {
      logger.info('findBookByTitleAndAuthor - No book found with the given title and author name')
    }
    return book
  } catch (err) {
    logger.error('findBookByTitleAndAuthor - error', err)
  }
}

const addBookIfNotExists = async (book) => {
  try {
    let author = await Author.findOne({ name: book.author })
    if (!author) {
      author = new Author({ name: book.author })
      const newAuthor = await author.save()
      logger.info('addBookIfNotExists - author added', author, newAuthor)
    }

    const bookExists = await Book.findOne({ title: book.title, author: author._id })
    if (!bookExists) {
      newBook = new Book({
        title: book.title,
        published: book.published,
        genres: book.genres,
        author: author._id })
      const newBook2 = await newBook.save()
      logger.info('Book added:', newBook, newBook2)
      return newBook
    } else {
      logger.info('Book already exists:', bookExists)
      throw new GraphQLError('Title must be unique', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: bookExists.title
          }
        })
    }
  }
  catch(err) {
    if (err.name === 'GraphQLError') {
      throw(err)
    }
    if (err.name === 'CastError' || err.name === 'ValidationError') {
      logger.error('addBookIfNotExists - validation error:', err)
      throw new GraphQLError(err.message, {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })
    }
  }
}

const getAuthorsAndBookCounts = async () => {
  let authors = null
  try {
    authors = await Author.aggregate([
      {
        $lookup: {
          from: 'books', // Collection name in MongoDB
          localField: '_id',
          foreignField: 'author',
          as: 'books'
        }
      },
      {
        $project: {
          name: 1,
          born: 2,
          bookCount: { $size: '$books' }
        }
      }
    ])
    logger.info(authors)
  } catch (err) {
      logger.error('getAuthorsAndBookCounts error:', err)
  }
  return authors
}

const updateAuthorBornYear = async (authorName, newBornYear) => {
  try {
    const author = await Author.findOne({ name: authorName })
    if (author) {
      author.born = newBornYear
      const updatedAuthor = await author.save()
      logger.info('updateAuthorBornYear - updated:', updatedAuthor, author)
      return updatedAuthor
    } else {
      logger.error('updateAuthorBornYear - author not found.')
    }
  } catch (err) {
    logger.error('updateAuthorBornYear - error:', err)
  }
  return null
}

const resolvers = {
  Query: {
    // t8.1
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    // t8.3
    allAuthors: async () => getAuthorsAndBookCounts(),
    // t8.2, t8.4, t8.5
    allBooks: async (root, args) => {
      let query = {}
      if (args.genre) {
        query = { ...query, genres: args.genre }
      }
      const books  = await Book.find(query).populate('author', 'name').exec()
      let result = books.map(book => ({
            title: book.title,
            published: book.published,
            genres: book.genres,
            author: book.author.name,
          }));
      if (args.author) {
        result = result.filter(book => book.author === args.author)
      }
      logger.info('allBooks', result)
      return result
    }
  },
  Mutation: {
    // t8.6
    addBook: async (root, args) => {
      console.log('addBook', args)
      const book = { ...args }
      const currentBook = await findBookByTitleAndAuthor(book.title, book.author)
      if (currentBook) {
        throw new GraphQLError('Title must be unique', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: book.title
          }
        })
      }
      const newBook = await addBookIfNotExists(book)
      return newBook
    },
    // t8.7
    editAuthor: async (root, args) => {
      const author = await updateAuthorBornYear(args.name, args.setBornTo)
      logger.info('editAuthor', author)
      return author
    }
  }
}

db.connect()

const server = new ApolloServer({
  typeDefs,
  resolvers,
  formatResponse: (response, requestContext) => {
    logger.info('Response:', {
      query: requestContext.request.query,
      variables: requestContext.request.variables,
      response
    })
    return response
  },
  formatError: (error) => {
    logger.error('Error:', {
      message: error.message,
      locations: error.locations,
      path: error.path
    })
    return error
  },
  context: ({ req }) => {
    logger.info('Request:', {
      method: req.method,
      headers: req.headers,
      body: req.body
    })
    return {}
  }
})

startStandaloneServer(server, {
  listen: { port: 4000 },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})