// Iniciando Projeto.
import React from 'react';
import Header from './1-Components/Header';
import FilterList from './1-Components/FilterList';
import Table from './1-Components/Table';
import PlanetProvider from './3-Context/PlanetProvier';

import './App.css';

function App() {
  return (
    <div>
      <PlanetProvider>
        <Header />
        <FilterList />
        <Table />
      </PlanetProvider>
    </div>
  );
}

export default App;
