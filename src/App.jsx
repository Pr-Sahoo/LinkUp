// import { useState } from 'react'
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import Navbar from './components/Navbar';
import ForgotPW from './page/ForgotPW';
import Register from './page/Register';
import Login from './page/Login';
import Chat from './page/Chat';
import Home from './page/Home';
import Userlist from './page/Userlist';
import PrivateChat from './page/PrivateChat';
import Choice from './page/Choice';
import Chatting from './page/Chatting';

function App() {
  // const [count, setCount] = useState(0)

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path='/register' element={<Register />} />
        <Route path='/forgot' element={<ForgotPW />} />
        <Route path='/login' element={<Login />} />
        <Route path='/chat' element={<Chat />} />
        <Route path='/' element={<Home />} />
        <Route path='/private-chat' element={<Userlist />} />
        <Route path='/private-chat/:userId' element={<PrivateChat />} />
        <Route path='/choice' element={<Choice/>} />
        <Route path='/chatting' element={<Chatting/>}/>
      </Routes>
    </Router>
  )
}

export default App
