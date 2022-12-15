import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';

import { v4 as uuid } from 'uuid';

import Editor from './component/Editor';

function App() {
  return (
    <React.Fragment>
    <Router>
      <Routes>
        <Route path='/' element={<Navigate replace to ={`/docs/${uuid()}`} /> } />
        <Route path = '/docs/:id' element = {<Editor/>} />
      </Routes>
    </Router>
    </React.Fragment>
  );
} 

export default App;
