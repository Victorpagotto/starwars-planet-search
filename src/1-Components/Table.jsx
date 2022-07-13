import React, { useContext } from 'react';
import { PlanetContext } from '../2-Context/PlanetProvier';
import TableRow from './TableRow';
import '../3-CSS/table.css';

function Table() {
  const { context } = useContext(PlanetContext);
  const { data } = context;
  const { filterByName, filterByNumericValues, order: { column, sort } } = context;
  const orderRouter = (a, b) => {
    const parsedA = parseInt(a, 10);
    const parsedB = parseInt(b, 10);
    if (sort === 'ASC') return parsedA - parsedB;
    return parsedB - parsedA;
  };

  const bubbleDownUnknowns = (arr) => {
    const arrCopy = [...arr];
    for (let i = 0; i < arr.length; i += 1) {
      for (let c = 0; c < arr.length - i - 1; c += 1) {
        if (arrCopy[c][column] === 'unknown') {
          const aux = arrCopy[c + 1];
          arrCopy[c + 1] = arrCopy[c];
          arrCopy[c] = aux;
        }
      }
    }
    return arrCopy;
  };

  const sortPlanets = (planetList) => {
    let sortedList = [...planetList];
    if (sort) {
      sortedList = bubbleDownUnknowns(sortedList);
      sortedList = sortedList.sort((a, b) => orderRouter(a[column], b[column]));
    }
    return sortedList;
  };

  // const formatKey = (key) => {
  //   const keyArray = key.split('_');
  //   const keyName = keyArray.map((word) => {
  //     const wordLetters = word.split('');
  //     wordLetters[0] = wordLetters[0].toUpperCase();
  //     return wordLetters.join('');
  //   });
  //   return keyName.join(' ');
  // };

  const wordFilter = (dataInfo) => {
    const filterList = Object.entries(filterByName);
    let planetList = [...dataInfo];
    filterList.forEach((filter) => {
      const [name, value] = filter;
      planetList = planetList.filter((planet) => {
        if (planet[name]) {
          return planet[name].includes(value);
        }
        return false;
      });
    });
    return planetList;
  };

  const numericFilter = (dataInfo) => {
    const filterList = filterByNumericValues.map((filter) => Object.values(filter));
    let planetList = [...dataInfo];
    filterList.forEach((filter) => {
      const [name, comparison, value] = filter;
      planetList = planetList.filter((planet) => {
        const planetInfo = parseInt(planet[name], 10);
        const numValue = parseInt(value, 10);
        switch (comparison) {
        case 'maior que':
          return (planetInfo > numValue);
        case 'menor que':
          return (planetInfo < numValue);
        default:
          return (planetInfo === numValue);
        }
      });
    });
    return planetList;
  };

  const renderFilter = () => {
    let filteredWorlds = wordFilter(data);
    filteredWorlds = numericFilter(filteredWorlds);
    return sortPlanets(filteredWorlds);
  };

  return (
    <div className="table-page-container">
      <div className="table-outter-container">
        <table className="table">
          <div className="table-container">
            <tr className="table-head-row">
              {
                Object.keys(data[0])
                  .map((item, i) => <th key={ `${item}-${i}` }>{ item }</th>)
              }
            </tr>
            {
              renderFilter()
                .map((planet, i) => (
                  <TableRow
                    key={ `${planet.name}-${i}` }
                    planetData={ Object.entries(planet) }
                  />
                ))
            }
          </div>
        </table>
      </div>
    </div>
  );
}

export default Table;
