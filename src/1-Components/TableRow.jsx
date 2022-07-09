import React from 'react';
import propTypes from 'prop-types';

export default function TableRow({ planetData }) {
  return (
    <tr className="info-row">
      {
        planetData.map((data, i) => {
          if (typeof data[1] === 'string') {
            if (data[0] !== 'name') {
              return <td key={ `${data[1]}-${i}` }>{ data[1] }</td>;
            }
            return (
              <td
                key={ `${data[1]}-${i}` }
                data-testid="planet-name"
              >
                { data[1] }
              </td>
            );
          }
          return (
            <td key={ `info-array-index-${i}` }>
              {
                data[1].map((item, index) => <p key={ `${item}-${index}` }>{ item }</p>)
              }
            </td>
          );
        })
      }
    </tr>
  );
}

TableRow.propTypes = {
  planetData: propTypes.arrayOf(propTypes.oneOfType([
    propTypes.string,
    propTypes.array,
  ])).isRequired,
};
