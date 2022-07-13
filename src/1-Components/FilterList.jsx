import React, { useContext } from 'react';
import { PlanetContext } from '../2-Context/PlanetProvier';
import '../3-CSS/filterList.css';

export default function FilterList() {
  const { context: { filterByNumericValues }, filterChange } = useContext(PlanetContext);

  const filterMap = filterByNumericValues.map((filter) => {
    const [column, comparison, value] = Object.values(filter);
    return (
      <div key={ `filter-list-${column}` } data-testid="filter" className="filter-item">
        <span>{ `${column} ${comparison}: ${value}` }</span>
        <button
          type="button"
          data-testid="filter-delete-btn"
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
    <div className="filter-list-container">
      <div className="filter-list">
        {
          filterMap
        }
      </div>
      <div>
        <button
          type="button"
          onClick={ () => filterChange([]) }
          className="filter-delete-button"
          data-testid="button-remove-filters"
          disabled={ filterByNumericValues.length < 1 }
        >
          Remover todas filtragens
        </button>
      </div>
    </div>
  );
}
