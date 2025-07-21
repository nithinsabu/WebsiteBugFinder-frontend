import Login from './Pages/Login'
import Navbar from './components/Navbar'
import Upload from './Pages/Upload'
import { Route, BrowserRouter, Routes } from 'react-router'
import ViewResult from './Pages/ViewResult'
function App(){

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
