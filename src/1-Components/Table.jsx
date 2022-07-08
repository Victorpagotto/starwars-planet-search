import React, { useContext, useEffect } from 'react';
import starAPI from '../0-Services/starAPI';
import { PlanetContext } from '../3-Context/planetProvier';

function Table() {
  const { context, contextChange } = useContext(PlanetContext);
  const { planetList } = context;

  useEffect(() => {
    const sendPlanets = async () => {
      const planets = {
        key: 'Planet-Change',
        info: await starAPI(),
      };
      contextChange(planets);
    };
    sendPlanets();
  }, []);

  return (
    <div>
      <ul>
        {
          planetList.map((planet) => <li key={ planet.name }>{ planet.name }</li>)
        }
      </ul>
    </div>
  );
}

export default Table;
