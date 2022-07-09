import React, { createContext, useState } from 'react';
import propTypes from 'prop-types';

export const PlanetContext = createContext();

export default function PlanetProvider({ children }) {
  const filterControl = (filterList) => {
    const columnList = ['population', 'orbital_period',
      'diameter', 'rotation_period', 'surface_water'];
    const selectedFilters = filterList
      .map((filter) => Object.values(filter)[0]);
    return columnList.filter((item) => !selectedFilters
      .some((filter) => filter === item));
  };

  const initialContext = {
    data: [{}],
    filterByName: {
      name: '',
    },
    numericFilter: 0,
    columnSelector: 'population',
    comparisonSelector: 'maior que',
    filterByNumericValues: [],
    showFilter: filterControl([]),
  };

  const [context, setContext] = useState(initialContext);

  const contextChange = ({ key, info }) => {
    setContext({ ...context, [key]: info });
  };

  const filterChange = (filterByNumericValues) => {
    const showFilter = filterControl(filterByNumericValues);
    const columnSelector = showFilter[0]
      ? showFilter[0]
      : '';
    setContext({ ...context,
      filterByNumericValues,
      columnSelector,
      showFilter });
  };

  return (
    <PlanetContext.Provider value={ { context, contextChange, filterChange } }>
      { children }
    </PlanetContext.Provider>
  );
}

PlanetProvider.propTypes = {
  children: propTypes.oneOfType([
    propTypes.arrayOf(propTypes.node),
    propTypes.node,
  ]).isRequired,
};
