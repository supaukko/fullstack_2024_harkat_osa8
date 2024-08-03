
import { Link } from 'react-router-dom';

const Author = ({author}) => {
  return (
    <>
      <tr>
        <td><Link to={`/authors/${author.name}/edit`}>{author.name}</Link></td>
        <td>{author.born}</td>
        <td>{author.bookCount}</td>
      </tr>
      
    </>
  )
}

export default Author
