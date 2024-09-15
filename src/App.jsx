import styles from './App.module.css'

import { About } from './components/About/About'
import { Navbar } from './components/NavBar/NavBar'
import { Projectlist } from './components/Projectlist/Projectlist'
import { Contact } from './components/Contact/Contact'

function App() {
  return (
    <div className={styles.App}>
      <Navbar />
      <main>
        <About />
        <Projectlist />
      </main>
      <Contact />
    </div>
  )
}

export default App
