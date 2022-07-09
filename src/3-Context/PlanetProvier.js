import React, { createContext, useState } from 'react';
import propTypes from 'prop-types';

export const PlanetContext = createContext();

function PlanetProvider({ children }) {
  const initialContext = {
    data: [{}],
    filterByName: {
      name: '',
    },
    numericFilter: 0,
    columnSelector: 'population',
    comparisonSelector: 'maior que',
    filterByNumericValues: [],
  };

  const [context, setContext] = useState(initialContext);

  const contextChange = ({ key, info }) => {
    setContext({ ...context, [key]: info });
  };

  const filterChange = (newFilterByNumericValues, newColumnSelector) => {
    setContext({ ...context,
      filterByNumericValues: newFilterByNumericValues,
      columnSelector: newColumnSelector });
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

export default PlanetProvider;
