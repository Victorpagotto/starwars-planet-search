import React, { createContext, useState } from 'react';
import propTypes from 'prop-types';

export const PlanetContext = createContext();

function PlanetProvider({ children }) {
  const initialContext = {
    planetList: [],
  };

  const contextControl = (context, { key, info }) => {
    switch (key) {
    case 'Planet-Change':
      return { ...context, planetList: info };
    default:
      return context;
    }
  };

  const [context, setContext] = useState(initialContext);

  const contextChange = (key) => {
    setContext(contextControl(context, key));
  };

  return (
    <PlanetContext.Provider value={ { context, contextChange } }>
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
