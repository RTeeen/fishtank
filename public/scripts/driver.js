$(() => {

  window.fishtank = new Fishtank('fishtank');             // making it global to make debugging 1% easier.  shhhh.
  window.fishtank.registerSpecies(Fish, GoFish);
  var starter = new Volcano({tank: window.fishtank});     // look, it's Dependency Injection!  Pretend you care!

})



