async function starAPI() {
  const apiResponse = await fetch('https://swapi-trybe.herokuapp.com/api/planets/')
    .then((res) => res.json())
    .then((res) => res.results);
  const filteredAPIResponse = apiResponse.map((response) => (
    Object.entries(response).reduce((acc, data) => {
      const [name, value] = data;
      if (name !== 'residents') {
        acc[name] = value;
      }
      return acc;
    }, {})
  ));
  return filteredAPIResponse;
}

export default starAPI;
