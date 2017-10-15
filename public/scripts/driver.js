$(() => {

  window.fishtank = new Fishtank('fishtank');             // making it global to make debugging 1% easier.  shhhh.
  var starter = new Starter({tank: window.fishtank});     // look, it's Dependency Injection!  Pretend you care!

})


