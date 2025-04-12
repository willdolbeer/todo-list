import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Lists from './components/Lists.jsx';
import ListDetail from './components/ListDetail.jsx';
import React from 'react';

export const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route path='/'>
        <Route index element={<Lists />} />
        <Route path=':listId' element={<ListDetail />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
