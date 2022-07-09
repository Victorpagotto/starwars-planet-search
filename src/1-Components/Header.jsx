import React, { useEffect, useContext } from 'react';
import starAPI from '../0-Services/starAPI';
import { PlanetContext } from '../3-Context/PlanetProvier';

function Header() {
  const { context, contextChange, filterChange } = useContext(PlanetContext);

  const columnList = ['population', 'orbital_period',
    'diameter', 'rotation_period', 'surface_water'];

  const {
    filterByName: { name },
    numericFilter,
    columnSelector,
    comparisonSelector,
    filterByNumericValues } = context;

  const selectedFilters = filterByNumericValues.map((filter) => Object.values(filter)[0]);
  const filteredColumnList = columnList.filter((item) => !selectedFilters
    .some((filter) => filter === item));
  useEffect(() => {
    const sendPlanets = async () => {
      const planets = {
        key: 'data',
        info: await starAPI(),
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
          <select
            id="columnSelector"
            value={ columnSelector }
            onChange={ sendInfo }
            data-testid="column-filter"
          >
            {
              filteredColumnList.map((item, i) => (
                <option key={ `${item}-${i}` } value={ item }>{ item }</option>
              ))
            }
          </select>
        </label>
        <label htmlFor="comparisonSelector">
          <select
            id="comparisonSelector"
            value={ comparisonSelector }
            onChange={ sendInfo }
            data-testid="comparison-filter"
          >
            <option value="maior que">maior que</option>
            <option value="menor que">menor que</option>
            <option value="igual a">igual a</option>
          </select>
        </label>
        <label htmlFor="numericFilter" className="numeric-filter-label">
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
          onClick={ () => {
            const columnSelected = columnSelector;
            const filterChanges = [...filterByNumericValues, {
              column: columnSelected,
              comparison: comparisonSelector,
              value: numericFilter,
            }];
            const selectorChanges = filteredColumnList.length > 1
              ? filteredColumnList.filter((item) => item !== columnSelected)[0]
              : '';
            filterChange(filterChanges, selectorChanges);
          } }
        >
          Filtrar
        </button>
      </div>
    </div>
  );
}

export default Header;
