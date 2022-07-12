import React, { useEffect, useContext } from 'react';
import starAPI from '../0-Services/starAPI';
import { PlanetContext } from '../3-Context/PlanetProvier';

function Header() {
  const { context, contextChange, filterChange } = useContext(PlanetContext);
  const comparisonList = ['maior que', 'menor que', 'igual a'];

  const {
    filterByName: { name },
    numericFilter,
    columnSelector,
    comparisonSelector,
    filterByNumericValues,
    showFilter } = context;

  useEffect(() => {
    const sendPlanets = async () => {
      const results = await starAPI();
      const planets = {
        key: 'data',
        info: [...results],
      };
      contextChange(planets);
    };
    sendPlanets();
  }, []);

  const sendInfo = ({ target: { value, id } }) => {
    contextChange({
      key: id,
      info: value,
    });
  };

  return (
    <div>
      <div>
        <input
          type="text"
          value={ name }
          data-testid="name-filter"
          onChange={ ({ target: { value } }) => {
            contextChange({
              key: 'filterByName',
              info: { name: value },
            });
          } }
        />
      </div>
      <div>
        <label htmlFor="columnSelector">
          Coluna
          <select
            id="columnSelector"
            value={ columnSelector }
            onChange={ sendInfo }
            data-testid="column-filter"
          >
            {
              showFilter.map((item, i) => (
                <option key={ `${item}-${i}` } value={ item }>{ item }</option>
              ))
            }
          </select>
        </label>
        <label htmlFor="comparisonSelector">
          Comparador
          <select
            id="comparisonSelector"
            value={ comparisonSelector }
            onChange={ sendInfo }
            data-testid="comparison-filter"
          >
            { comparisonList.map((item, i) => (
              <option key={ `${item}-${i}` } value={ item }>{ item }</option>
            )) }
          </select>
        </label>
        <label htmlFor="numericFilter" className="numeric-filter-label">
          Valor
          <input
            id="numericFilter"
            type="number"
            data-testid="value-filter"
            value={ numericFilter }
            onChange={ sendInfo }
          />
        </label>
        <button
          type="button"
          data-testid="button-filter"
          disabled={ showFilter.length < 1 }
          onClick={ () => {
            const filterChanges = [...filterByNumericValues, {
              column: columnSelector,
              comparison: comparisonSelector,
              value: numericFilter,
            }];
            filterChange(filterChanges);
          } }
        >
          Filtrar
        </button>
      </div>
    </div>
  );
}

export default Header;
