import { useState } from "react";
import Authors from "./components/Authors";
import Menu from "./components/Menu";
import Notify from "./components/Notify";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
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
      </Routes>
    </div>
  );
};

export default App;
