import { useState, useEffect } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { useNavigate, useParams } from 'react-router-dom'
import {UPDATE_AUTHOR_BIRTHDAY, ALL_AUTHORS} from "../queries"

const EditBirthYear = ({notify}) => {
  const [author, setAuthor] = useState(null)
  const navigate = useNavigate()
  const { name } = useParams();
  const [ updateAuthorBirthday ] = useMutation(UPDATE_AUTHOR_BIRTHDAY, {
    refetchQueries: [  {query: ALL_AUTHORS } ],
    onError: (error) => {
      const messages = error.graphQLErrors.map(e => e.message).join('\n')
      notify(messages)
    }
  })

  const result = useQuery(ALL_AUTHORS)

  useEffect(() => {
    if (result.data && result.data.allAuthors) {
      // console.log('EditBirthYear - useEffect', name)
      setAuthor(result.data.allAuthors.find(a => a.name === name))
    }
  }, [result.data, name])

  const submit = async (event) => {
    event.preventDefault()
    updateAuthorBirthday({  variables: { name: author.name, birthYear: Number(author.born) } })
    setAuthor(null)
    navigate('/authors', { replace: true })
  }

  if (result.loading || author === null)  {
    return null
  }

  // console.log('EditBirthYear', author)

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          <span>name: {author.name}</span>
        </div>
        <div>
          <input
            value={author.born ? author.born : ''}
            type="number"
            onChange={({ target }) => setAuthor({...author, born: target.value})}
          />
        </div>
        <button type="submit">update author</button>
      </form>
    </div>
  )
}

export default EditBirthYear