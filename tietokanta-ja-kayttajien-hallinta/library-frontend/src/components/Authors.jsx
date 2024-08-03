import { useQuery } from '@apollo/client'
import { Link, useNavigate } from 'react-router-dom';
import Select from 'react-select';
import {ALL_AUTHORS} from "../queries"
import Author from "./Author";

const Authors = () => {

  const result = useQuery(ALL_AUTHORS)
  const navigate = useNavigate()

  if (result.loading)  {
    return <div>Loading authors...</div>
  }

  // console.log('Authors', result.data.allAuthors)

  const authorOptions = result.data.allAuthors.map(author => ({
    value: author.name,
    label: author.name
  }))

  const handleAuthorChange = (selectedOption) => {
    navigate(`/authors/${selectedOption.value}/edit`, { replace: true })
  }

  return (
    <div>
      <h2>authors</h2>
      <Select options={authorOptions} onChange={handleAuthorChange} />
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {result.data.allAuthors.map((a) => (
            <Author key={a.name} author={a} />
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Authors
