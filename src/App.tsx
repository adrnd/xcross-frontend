import React from 'react';
import logo from './logo.svg';
import './App.css';
import { TweetList } from './components/TweetList'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <TweetList/>
      </header>
    </div>
  );
}

export default App;
