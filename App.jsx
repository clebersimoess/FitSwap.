import './App.css'
import Pages from "./pages/index.jsx"  // Remove o @
import { Toaster } from "./components/ui/toaster"  // Remove o @

function App() {
  return (
    <>
      <Pages />
      <Toaster />
    </>
  )
}

export default App
