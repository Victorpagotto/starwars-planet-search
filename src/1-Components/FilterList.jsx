import React, { useContext } from 'react';
import { PlanetContext } from '../3-Context/PlanetProvier';

export default function FilterList() {
  const { context: { filterByNumericValues }, filterChange } = useContext(PlanetContext);

  const filterMap = filterByNumericValues.map((filter) => {
    const [column, comparison, value] = Object.values(filter);
    return (
      <div key={ `filter-list-${column}` } data-testid="filter">
        <span>{ `${column} ${comparison}: ${value}` }</span>
        <button
          type="button"
          onClick={ () => {
            filterChange(
              filterByNumericValues.filter((item) => item.column !== column),
            );
          } }
        >
          X
        </button>
      </div>
    );
  });

  return (
    <div>
      <div>
        {
          filterMap
        }
      </div>
      <div>
        <button
          type="button"
          onClick={ () => filterChange([]) }
          data-testid="button-remove-filters"
          disabled={ filterByNumericValues.length < 1 }
        >
          Remover todas filtragens
        </button>
      </div>
    </div>
  );
}
