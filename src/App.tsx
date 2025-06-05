import Login from './components/Login'
import Navbar from './components/Navbar'
import { Route, BrowserRouter, Routes } from 'react-router'
function App(){
  // const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Login />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
