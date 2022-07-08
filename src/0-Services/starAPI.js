function starAPI() {
  return fetch('https://swapi-trybe.herokuapp.com/api/planets/')
    .then((res) => res.json())
    .then((res) => res.results);
}

export default starAPI;
