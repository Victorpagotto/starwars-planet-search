import React from 'react';
import { getByTestId, render, screen, waitFor } from '@testing-library/react';
import App from '../App';
import starAPIMock from './starAPIMock';
import userEvent from '@testing-library/user-event';

describe('Testa a aplicação toda.', () => {
  const starAPIKeys = Object
    .keys(starAPIMock.results[0]).filter((item) => item !== 'residents');

  const MOCKAPI = starAPIMock.results.sort((a, b) => {
    const MINUS = -1;
    if (a.name > b.name) return 1;
    if (a.name < b.name) return MINUS;
    return 0;
  });

  const starAPINoResidents = MOCKAPI.map((planet) => (
    Object.entries(planet).map((planet) => {
      if (planet[0] !== 'residents') {
        return planet;
      }
      return undefined
    }).filter((planetInfo) => planetInfo)
    .reduce((acc, planet) => {
      acc[planet[0]] = planet[1];
      return acc;
    }, {})
  ));

  it('Testa chamada da API e a tabela.', async () => {
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
    starAPINoResidents.forEach((planet) => {
      Object.keys(planet).forEach((key) => {
        if (typeof planet[key] === 'string') {
          expect(screen.getAllByText(planet[key]).length > 0).toBeTruthy();
        }
      })
  })
  });

  it('Testa o filtro por nome.', async () => {
    const endpoint = 'https://swapi-trybe.herokuapp.com/api/planets/';
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue(starAPIMock)
    });
    render(<App />);
    await waitFor(() => expect(global.fetch).toHaveBeenCalledWith(endpoint));

    const nameFilter = screen.getByTestId('name-filter');
    userEvent.type(nameFilter, 'oo');
    const planetList = starAPINoResidents.filter((planet) => (
      planet.name.includes('oo')
    ));
    planetList.forEach((planet) => (
      expect(screen.getByText(planet.name)).toBeInTheDocument()
    ));
    expect(screen.getAllByTestId('planet-name').length).toBe(planetList.length);
    userEvent.clear(nameFilter);
    expect(screen.getAllByTestId('planet-name').length > planetList.length).toBeTruthy();
  });

  it('Testa o filtro numérico.', async () => {
    const endpoint = 'https://swapi-trybe.herokuapp.com/api/planets/';
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue(starAPIMock)
    });
    render(<App />);
    await waitFor(() => expect(global.fetch).toHaveBeenCalledWith(endpoint));

    const columnFilter = screen.getByTestId('column-filter');
    const comparatorFilter = screen.getByTestId('comparison-filter');
    const valueFilter = screen.getByTestId('value-filter');
    const btnFilter = screen.getByTestId('button-filter');

    expect(columnFilter.value).toBe('population');
    expect(comparatorFilter.value).toBe('maior que');
    expect(valueFilter.value).toBe('0');

    userEvent.selectOptions(columnFilter, 'surface_water');
    userEvent.selectOptions(comparatorFilter, 'maior que');
    userEvent.type(valueFilter, '40');
    userEvent.click(btnFilter);
    const firstList = screen.getAllByTestId('planet-name')
      .map((planet) => planet.innerHTML);
    const firstFilter = MOCKAPI
      .filter((planet) => parseInt(planet.surface_water) > 40);
    const formatedFirstFilter = firstFilter.map((planet) => planet.name);
    formatedFirstFilter.forEach((item) => {
      expect(firstList.includes(item)).toBeTruthy()
    })

    userEvent.clear(valueFilter);
    userEvent.selectOptions(columnFilter, 'orbital_period');
    userEvent.selectOptions(comparatorFilter, 'menor que');
    userEvent.type(valueFilter, '500');
    userEvent.click(btnFilter);
    const secondList = screen.getAllByTestId('planet-name')
      .map((planet) => planet.innerHTML);
    const secondFilter = firstFilter
      .filter((planet) => parseInt(planet.orbital_period) < 500);
    const formatedSecondFilter = secondFilter.map((planet) => planet.name);
    formatedSecondFilter.forEach((item) => {
      expect(secondList.includes(item)).toBeTruthy()
    });

    userEvent.clear(valueFilter);
    userEvent.selectOptions(columnFilter, 'population');
    userEvent.selectOptions(comparatorFilter, 'igual a');
    userEvent.type(valueFilter, '1000000000');
    userEvent.click(btnFilter);
    const thirdList = screen.getAllByTestId('planet-name')
    .map((planet) => planet.innerHTML);
    const thirdFilter = secondFilter
      .filter((planet) => parseInt(planet.population) === 1000000000);
    const formatedthirdFilter = thirdFilter.map((planet) => planet.name);
    formatedthirdFilter.forEach((item) => {
      expect(secondList.includes(item)).toBeTruthy()
    });
    expect(thirdList).toEqual(thirdFilter.map((planet) => planet.name));

    userEvent.selectOptions(columnFilter, 'rotation_period');
    userEvent.click(btnFilter);
    userEvent.selectOptions(columnFilter, 'diameter');
    userEvent.click(btnFilter);
    expect(screen.getAllByTestId('filter-delete-btn').length).toBe(5);
    expect(screen.getByTestId('column-filter').children.length).toBe(0);
    userEvent.click(screen.getAllByTestId('filter-delete-btn')[0]);
    expect(screen.getByTestId('column-filter').children.length).toBe(1);
    userEvent.click(screen.getByTestId('button-remove-filters'));
    expect(screen.getByTestId('column-filter').children.length).toBe(5);
  });

  const testSorter = (chosenList, selectedColumn, selectedOrder) => {
    const listCopy = [...chosenList.filter((planet) => planet[selectedColumn] !== 'unknown')];
    const noUnknowns = [...listCopy
      .sort((a, b) => {
        if (selectedOrder === 1) {
          return a[selectedColumn] - b[selectedColumn];
        }
        return b[selectedColumn] - a[selectedColumn];
      })
      .map((planet) => planet.name)];
    const unknowns = [...chosenList.filter((planet) => planet[selectedColumn] === 'unknown').map((planet) => planet.name)];

    return {
      noUnknowns,
      unknowns,
    };
  };

  const comparisonReader = (elements, selectedColumn, selectedOrder) => {
    const controlElements = testSorter(MOCKAPI, selectedColumn, selectedOrder);
    const elementNames = elements
      .filter((element) => element.firstElementChild.innerHTML !== 'name')
      .map((element) => element.firstElementChild.innerHTML);
      elementNames.forEach((elementName, i) => {
        if(i < controlElements.noUnknowns.length) {
          expect(elementName).toBe(controlElements.noUnknowns[i]);
        } else {
          expect(controlElements.unknowns.includes(elementName)).toBeTruthy();
        }
    })
  };

  it('Testa a feature de ordenar os planetas.', async () => {
    const endpoint = 'https://swapi-trybe.herokuapp.com/api/planets/';
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue(starAPIMock)
    });
    render(<App />);
    await waitFor(() => expect(global.fetch).toHaveBeenCalledWith(endpoint));

    const controlSelector = Array.from(screen.getByRole('table').firstElementChild.children)
      .map((element) => element.firstElementChild.innerHTML)
      .filter((elementName) => elementName !== 'name');
    expect(controlSelector).toEqual(MOCKAPI.map((planet) => planet.name));

    const columnSort = screen.getByTestId('column-sort');
    const ASCBtn = screen.getByTestId('column-sort-input-asc');
    const DESCBtn = screen.getByTestId('column-sort-input-desc');
    const sortBtn = screen.getByTestId('column-sort-button');

    userEvent.selectOptions(columnSort, 'population');
    userEvent.click(ASCBtn);
    userEvent.click(sortBtn);
    const firstList = Array.from(screen.getByRole('table').firstElementChild.children);
    comparisonReader(firstList, 'population', 1);

    userEvent.selectOptions(columnSort, 'orbital_period');
    userEvent.click(DESCBtn);
    userEvent.click(sortBtn);
    const secondList = Array.from(screen.getByRole('table').firstElementChild.children);
    comparisonReader(secondList, 'orbital_period', -1);

    userEvent.selectOptions(columnSort, 'diameter');
    userEvent.click(ASCBtn);
    userEvent.click(sortBtn);
    const thirdList = Array.from(screen.getByRole('table').firstElementChild.children);
    comparisonReader(thirdList, 'diameter', 1);
  });
});