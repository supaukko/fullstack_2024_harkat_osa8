const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const { v1: uuid } = require('uuid')
const { GraphQLError } = require('graphql')
const winston = require('winston')

let authors = [
  {
    name: 'Robert Martin',
    id: "afa51ab0-344d-11e9-a414-719c6709cf3e",
    born: 1952,
  },
  {
    name: 'Martin Fowler',
    id: "afa5b6f0-344d-11e9-a414-719c6709cf3e",
    born: 1963
  },
  {
    name: 'Fyodor Dostoevsky',
    id: "afa5b6f1-344d-11e9-a414-719c6709cf3e",
    born: 1821
  },
  { 
    name: 'Joshua Kerievsky', // birthyear not known
    id: "afa5b6f2-344d-11e9-a414-719c6709cf3e",
  },
  { 
    name: 'Sandi Metz', // birthyear not known
    id: "afa5b6f3-344d-11e9-a414-719c6709cf3e",
  },
]

/*
 * Suomi:
 * Saattaisi olla järkevämpää assosioida kirja ja sen tekijä tallettamalla kirjan yhteyteen tekijän nimen sijaan tekijän id
 * Yksinkertaisuuden vuoksi tallennamme kuitenkin kirjan yhteyteen tekijän nimen
 *
 * English:
 * It might make more sense to associate a book with its author by storing the author's id in the context of the book instead of the author's name
 * However, for simplicity, we will store the author's name in connection with the book
 *
 * Spanish:
 * Podría tener más sentido asociar un libro con su autor almacenando la id del autor en el contexto del libro en lugar del nombre del autor
 * Sin embargo, por simplicidad, almacenaremos el nombre del autor en conexión con el libro
*/

let books = [
  {
    title: 'Clean Code',
    published: 2008,
    author: 'Robert Martin',
    id: "afa5b6f4-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring']
  },
  {
    title: 'Agile software development',
    published: 2002,
    author: 'Robert Martin',
    id: "afa5b6f5-344d-11e9-a414-719c6709cf3e",
    genres: ['agile', 'patterns', 'design']
  },
  {
    title: 'Refactoring, edition 2',
    published: 2018,
    author: 'Martin Fowler',
    id: "afa5de00-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring']
  },
  {
    title: 'Refactoring to patterns',
    published: 2008,
    author: 'Joshua Kerievsky',
    id: "afa5de01-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring', 'patterns']
  },  
  {
    title: 'Practical Object-Oriented Design, An Agile Primer Using Ruby',
    published: 2012,
    author: 'Sandi Metz',
    id: "afa5de02-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring', 'design']
  },
  {
    title: 'Crime and punishment',
    published: 1866,
    author: 'Fyodor Dostoevsky',
    id: "afa5de03-344d-11e9-a414-719c6709cf3e",
    genres: ['classic', 'crime']
  },
  {
    title: 'Demons',
    published: 1872,
    author: 'Fyodor Dostoevsky',
    id: "afa5de04-344d-11e9-a414-719c6709cf3e",
    genres: ['classic', 'revolution']
  },
]

/*
  you can remove the placeholder query once your first one has been implemented 
*/

const typeDefs = `
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
  }
`

const getAuthor = (name) => {
  return authors.find(a => a.name === name)
}

const bookExists = (book) => {
  return books.find(b => b.author === book.author &&
    b.title === book.title)
}

const addBook = (book) => {
  if (!getAuthor(book.author)) {
    authors = [...authors, {name: book.author, id: uuid()}]
  }
  books = [...books, {...book}]
  return book
}

const resolvers = {
  Query: {
    // t8.1
    bookCount: () => books.length,
    authorCount: () => {
      const authors = books.reduce((acc, book) => {
        if (!acc.includes(book.author)) {
          acc.push(book.author)
        }
        return acc
      }, [])
      return authors.length
    },
    // t8.3
    allAuthors: () => {
      const authorBooks = {}
      books.forEach(book => {
        if (authorBooks[book.author]) {
          authorBooks[book.author].push(book.title)
        }
        else {
          authorBooks[book.author] = [book.title]
        }
      });
      const result = Object.keys(authorBooks).map(authorName => {
        const author = authors.find(a => a.name === authorName)
        return {
          ...author,
          bookCount: authorBooks[authorName].length
        }
      });
      return result
    },
    // t8.2, t8.4, t8.5
    allBooks: (root, args) => {
      let result = [...books]
      if (args.author) {
        result = result.filter(book => book.author === args.author)
      }
      if (args.genre) {
        result = result.filter(book => book.genres.includes(args.genre))
      }
      return result
    }
  },
  Mutation: {
    // t8.6
    addBook: (root, args) => {
      console.log('addBook', args)
      const book = { ...args, id: uuid() }
      if (bookExists(book)) {
        throw new GraphQLError('Title must be unique', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: book.title
          }
        })
      }
      return addBook(book)
    },
    // t8.7
    editAuthor: (root, args) => {
      const author = getAuthor(args.name)
      console.log(author)
      if (author) {
        const updatedAuthor = {...author, born: args.setBornTo}
        authors = authors.map(a => a.name === updatedAuthor.name ? updatedAuthor : a)
        return updatedAuthor
      }
      return null
    }
  }
}

// Configure winston logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
  ]
})

const server = new ApolloServer({
  typeDefs,
  resolvers,
  formatResponse: (response, requestContext) => {
    logger.info('Response:', {
      query: requestContext.request.query,
      variables: requestContext.request.variables,
      response
    });
    return response;
  },
  formatError: (error) => {
    logger.error('Error:', {
      message: error.message,
      locations: error.locations,
      path: error.path
    });
    return error;
  },
  context: ({ req }) => {
    logger.info('Request:', {
      method: req.method,
      headers: req.headers,
      body: req.body
    });
    return {};
  }
})

startStandaloneServer(server, {
  listen: { port: 4000 },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})