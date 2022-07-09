async function starAPI() {
  return fetch('https://swapi-trybe.herokuapp.com/api/planets/')
    .then((res) => res.json())
    .then((res) => (
      res.results.map((response) => (
        Object.entries(response).reduce((acc, data) => {
          const [name, value] = data;
          if (name !== 'residents') {
            acc[name] = value;
          }
          return acc;
        }, {})
      ))
    ));
}

export default starAPI;
