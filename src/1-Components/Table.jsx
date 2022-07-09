import React, { useContext } from 'react';
import { PlanetContext } from '../3-Context/PlanetProvier';
import TableRow from './tableComponents/tableRow';

function Table() {
  const { context } = useContext(PlanetContext);
  const { data } = context;
  const { filterByName, filterByNumericValues } = context;

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
        return true;
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
        switch (comparison) {
        case 'maior que':
          return (parseInt(planet[name], 10) > parseInt(value, 10));
        case 'menor que':
          return (parseInt(planet[name], 10) < parseInt(value, 10));
        case 'igual a':
          return (parseInt(planet[name], 10) === parseInt(value, 10));
        default:
          return true;
        }
      });
    });
    return planetList;
  };

  const renderFilter = () => {
    let filteredWorlds = wordFilter(data);
    filteredWorlds = numericFilter(filteredWorlds);
    return filteredWorlds;
  };

  return (
    <div className="table-container">
      <table>
        <tbody>
          <tr>
            {
              Object.keys(data[0])
                .map((item, i) => <th key={ `${item}-${i}` }>{ item }</th>)
            }
          </tr>
          {
            renderFilter().map((planet, i) => (
              <TableRow
                key={ `${planet.name}-${i}` }
                planetData={ Object.values(planet) }
              />
            ))
          }
        </tbody>
      </table>
    </div>
  );
}

export default Table;
