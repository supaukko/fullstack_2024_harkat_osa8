import { gql } from '@apollo/client'

export const ALL_AUTHORS = gql`
query {
  allAuthors {
    name
    born
    bookCount
  }
}
`

export const ALL_BOOKS = gql`
  query findAllBooks($author: String, $genre: String) {
    allBooks(author: $author, genre: $genre) {
      title
      published
      author
      genres
    }
  }
`
export const CREATE_BOOK = gql`
  mutation createBook($title: String!, $author: String!, $published: Int!, $genres: [String!]!) {
    addBook(
      title: $title
      author: $author
      published: $published
      genres: $genres
    )
    {
      title
      author
    }
  }
`

export const UPDATE_AUTHOR_BIRTHDAY = gql`
  mutation updateAuthorBirthday($name: String!, $birthYear: Int!) {
    editAuthor(
      name: $name
      setBornTo: $birthYear
    )
    {
      name
      born
      bookCount
    }
  }
`