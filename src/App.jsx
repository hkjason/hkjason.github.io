import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'

import styles from './App.module.css'

import { Navbar } from './components/Navbar/Navbar';
import { MainPage } from './components/MainPage/MainPage.jsx'
import { GamePage } from './components/GamePage/GamePage.jsx'
import { NotFound } from './components/NotFound/NotFound.jsx'

import { ScrollToTop } from './components/Hooks/ScrollToTop.jsx'

function App() {
  return (
    <Router>
      <ScrollToTop/>
      <Navbar/>
          <Routes>
            <Route exact path = "/" element={<MainPage />} />
            <Route path = "/games/:gameId" element={<GamePage/>} />
            <Route path = "*" element={<NotFound />} />
          </Routes>
    </Router>
  )
}

export default App
