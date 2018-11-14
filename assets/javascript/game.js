var character = ["Rey", "Luke", "Darth Vader", "Emperor Palpatine"];
var health = ["120", "100", "150", "180"];
var attack = 6;
var counterAttack = ["10", "5", "15", "25"];
var attackMult = 1;
var characters = [];
var hero;

function Player(name, hp, atk, cAtk) {
  this.name = name;
  this.healh = hp;
  this.attack = atk;
  this.cAtk = cAtk;

  this.attack = function() {
    atk *= attackMult;
    attackMult++;
    return this.atk;
  };
  this.cAttack = function() {
    return this.cAtk;
  };
}
for (var i = 0; i < character.length; i++) {
  characters[i] = new Player(character[i], health[i], attack, counterAttack[i]);
}

$(document).ready(function() {
  $(".freeAgent").on("click", function() {
    var x = $(this).attr("alt");
    console.log(x);
    console.log(characters[0]);
    console.log(character.indexOf(x));
    hero = characters[character.indexOf(x)];
    alert(hero.name);
    hero.clear();
    alert(hero.name);
  });
});
