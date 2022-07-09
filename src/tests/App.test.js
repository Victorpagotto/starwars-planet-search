import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import App from '../App';
import starAPIMock from './starAPIMock';

const starAPIKeys = Object
  .keys(starAPIMock.results[0]).filter((item) => item !== 'residents');
const starAPIValues = starAPIMock.results.map((planet) => (
  Object.entries(planet).map((planet) => {
    if (planet[0] !== 'residents') {
      return planet[1];
    }
    return undefined
  }).filter((planetInfo) => planetInfo)
))

test('Testa chamada da API e a tabela.', async () => {
  const endpoint = 'https://swapi-trybe.herokuapp.com/api/planets/';
  global.fetch = jest.fn().mockResolvedValue({
    json: jest.fn().mockResolvedValue(starAPIMock)
  });
  render(<App />);
  await waitFor(() => expect(global.fetch).toHaveBeenCalledWith(endpoint));
  const tableRows = Object.values(screen.getAllByRole('row'));
  const tableHead = Object.values(tableRows[0].children);
  expect(tableHead.length).toBe(13);
  expect(tableHead.some((th) => th.innerHTML === 'residents')).not.toBeTruthy();
  starAPIKeys.forEach((key) => {
    expect(tableHead.some((th) => th.innerHTML === key)).toBeTruthy();
  });
  const firstRowInfo = Object.values(tableRows[1].children).map((child) => child.innerHTML);
  const firstPlanetInfo = starAPIValues.find((planet) => planet[0] === 'Alderaan');
  expect(firstRowInfo[0]).toBe(firstPlanetInfo[0]);
  
});
