import './App.css';
import { TextField, Button } from '@material-ui/core';
import { useEffect, useState } from 'react';
import { BrowserRouter, Link, Route, Switch, useParams } from 'react-router-dom';
import ky from 'ky';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/"><Login /></Route>
        <Route path="/chat/:name"><Chat /></Route>
      </Switch>
    </BrowserRouter>
  );
}

function Login() {
  const [name, setName] = useState('');
  return (
    <div className="App">
      <header className="App-header">
      <form noValidate autoComplete="off">
        <div className="login">
          <TextField id="outlined-basic" label="Enter name" variant="outlined" value={name} onChange={e=> setName(e.target.value)} />
          <Link to={`/chat/${name}`}>
            <Button variant="contained" color="primary">Login</Button>
          </Link>
        </div>
      </form>
      </header>
    </div>
  );
}

function Chat() {
  const params = useParams();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    ky.get('/messages').json().then(updatedMessages => {
      setMessages(updatedMessages);
    });

    const intervalId = setInterval(() => {
      ky.get('/messages').json().then(updatedMessages => {
        setMessages(updatedMessages);
      })
    }, 500);

    return () => clearInterval(intervalId);
  }, []);

  const sendMessage = () => {
    ky.post('/chat', {
      json: {
        author: params.name,
        message: message,
        date: new Date()
      }
    });

    setMessage('');
  };

  return (
    <div className="App">
      <header className="App-header"> 
        <div>Welcome, {params.name}!</div>
        <div className='chat'>
          <div className="messages">
            {messages.map(message => (
              <div key={message.id} className={message.author === params.name ? 'message-1' : 'message-2'}>
                {message.message}
                <div className='info'>
                  <div>{message.author}</div>,
                  <div className='date'> {new Date(message.date).getHours()}:{new Date(message.date).getMinutes() < 10 ? `0${new Date(message.date).getMinutes()}` : new Date(message.date).getMinutes()}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="message-container">
            <TextField id="outlined-basic" variant="outlined" value={message} onChange={e=> setMessage(e.target.value)} />
            <Button
              variant="contained"
              color="primary"
              onClick={() => sendMessage()}
            >
              Send
            </Button>
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
