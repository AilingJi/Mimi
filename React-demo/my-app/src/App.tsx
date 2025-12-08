import './App.css'
import WelcomeCard from './components/WelcomeCard'
import Counter from './components/Counter'
import TextInput from './components/TextInput'
function App() {
  return (
    <div style={{ padding: 24, fontFamily: "system-ui, Arial" }}>
      <WelcomeCard name="Mimi Cat" />
      <Counter />
      <TextInput />
    </div>
  )
}

export default App
