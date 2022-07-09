import React from 'react';
import propTypes from 'prop-types';

export default function TableRow({ planetData }) {
  return (
    <tr className="info-row">
      {
        planetData.map((data, i) => {
          if (typeof data === 'string') {
            return <td key={ `${data}-${i}` }>{ data }</td>;
          }
          return (
            <td key={ `info-array-index-${i}` }>
              {
                data.map((item, index) => <p key={ `${item}-${index}` }>{ item }</p>)
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
