const URL = 'https://swapi-trybe.herokuapp.com/api/planets/';

const starAPI = async () => {
  const { results } = await fetch(URL).then((response) => response.json());
  return results
    .map((item) => (
      Object.entries(item).reduce((acc, data) => {
        const [name, value] = data;
        if (name !== 'residents') {
          acc[name] = value;
        }
        return acc;
      }, {})
    )).sort((a, b) => a.name.localeCompare(b.name));
};

export default starAPI;
