import React, { useState, useContext } from 'react';
import columnList from '../0-Services/columnList';
import { PlanetContext } from '../2-Context/PlanetProvier';
import '../3-CSS/order.css';

export default function Order() {
  const { context: { order }, contextChange } = useContext(PlanetContext);
  const [localOrder, setLocalOrder] = useState(order);
  const { column, sort } = localOrder;
  return (
    <div className="order-container">
      <div className="order-selector-container">
        <label htmlFor="order-selector" className="order-selector-column">
          Ordenar por
          <select
            id="order-selector"
            value={ column }
            data-testid="column-sort"
            onChange={ ({ target: { value } }) => {
              setLocalOrder({ ...localOrder, column: value });
            } }
          >
            {
              columnList.map((item) => (
                <option key={ `order-selector-${item}` } value={ item }>{ item }</option>
              ))
            }
          </select>
        </label>
        <div className="order-radio-container">
          <label htmlFor="Ascendent">
            Ascendente
            <input
              type="radio"
              name="order-by"
              id="Ascendent"
              value="ASC"
              data-testid="column-sort-input-asc"
              onChange={ ({ target: { value } }) => {
                setLocalOrder({ ...localOrder, sort: value });
              } }
              checked={ sort === 'ASC' }
            />
          </label>
          <label htmlFor="Descending">
            Descendente
            <input
              type="radio"
              name="order-by"
              id="Descending"
              value="DESC"
              data-testid="column-sort-input-desc"
              onChange={ ({ target: { value } }) => {
                setLocalOrder({ ...localOrder, sort: value });
              } }
              checked={ sort === 'DESC' }
            />
          </label>
        </div>
        <button
          type="button"
          data-testid="column-sort-button"
          className="order-button"
          onClick={ () => {
            contextChange({
              key: 'order',
              info: localOrder,
            });
          } }
        >
          Ordenar
        </button>
      </div>
    </div>
  );
}
