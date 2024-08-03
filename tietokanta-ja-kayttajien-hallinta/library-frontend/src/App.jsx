import { useState } from "react"
import Authors from "./components/Authors"
import Menu from "./components/Menu"
import Notify from "./components/Notify"
import Books from "./components/Books"
import NewBook from "./components/NewBook"
import EditBirthYear from "./components/EditBirthYear"
import NotFound from "./components/NotFound"
import { Routes, Route } from 'react-router-dom'

const App = () => {
  const [errorMessage, setErrorMessage] = useState(null)

  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 10000)
  }

  return (
    <div>
      <Menu />
      <Notify errorMessage={errorMessage} />
      <Routes>
        <Route path="/authors" element={<Authors />} />
        <Route path="/" element={<Authors />} />
        <Route path="/books" element={<Books />} />
        <Route path="/books/create" element={<NewBook notify={notify} />} />
        <Route path="/authors/:name/edit" element={<EditBirthYear notify={notify} />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  )
}

export default App
