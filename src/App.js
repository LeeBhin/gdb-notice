import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import WritePage from './pages/Write';
import Detail from './pages/Detail';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/post" element={<WritePage />} />
        <Route path="/detail/:postId" element={<Detail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
