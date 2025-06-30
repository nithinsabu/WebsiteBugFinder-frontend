import Login from './components/Login'
import Navbar from './components/Navbar'
import Upload from './components/Upload'
import { Route, BrowserRouter, Routes } from 'react-router'
import ViewResult from './components/ViewResult'
function App(){
  // const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <Navbar/>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/upload" element={<Upload/>} />
        <Route path="/view-webpages" element={<ViewResult/>}/>
        <Route path="/view-webpage/:webpageId" element={<ViewResult />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
