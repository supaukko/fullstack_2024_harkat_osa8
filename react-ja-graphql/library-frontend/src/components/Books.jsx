
import { useQuery } from '@apollo/client'
import {ALL_BOOKS} from "../queries";

const Books = () => {

  const result = useQuery(ALL_BOOKS, {
    variables: { author: null, genre: null }
  })

  if (result.loading)  {
    return <div>Loading books...</div>
  }

  // console.log('Books', result.data.allBooks)

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {result.data.allBooks.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Books
