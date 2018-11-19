/***************VARIABLES*************/

var charNames = ["Rey", "Luke", "Darth Vader", "Emperor Palpatine"];
var charId = ["rey", "luke", "vader", "palpatine"];
var health = ["120", "130", "150", "160"];
var attack = [8, 9, 8, 7];
var counterAttack = [15, 10, 20, 25];
var attackMult = 1;
var wins = 0;
var characters = [];
var hero, villain, player;
var heroExists = false;
var heroHP = 0;
villainHP = 0;
var gameOver = false;
var audio = new Audio("assets/sounds/sabreClash.wav");
var openingAudio = new Audio("assets/sounds/star-wars-theme-song.mp3");
var battleAudio = new Audio("assets/sounds/DuelOfTheFates.mp3");
var twirlAudio = new Audio("assets/sounds/sthtwrl1.wav");
var decrementer = 25;
var intervalId;
var villainCount = 0;

/******Player Object Declaration*****/
function Player(name, id, hp, atk, cAtk) {
  this.name = name;
  this.id = id;
  this.health = hp;
  this.attackPts = atk;
  this.cAtk = cAtk;
  this.attackPwr = 0;

  this.getAttack = function() {
    return this.attackPts;
  };
  this.getName = function() {
    return this.name;
  };
  this.getHealth = function() {
    return this.health;
  };
  this.getCounterAttack = function() {
    return this.cAtk;
  };
  this.getId = function() {
    return this.id;
  };
}

/******Create array of player objects********/
for (var i = 0; i < charNames.length; i++) {
  characters[i] = new Player(
    charNames[i],
    charId[i],
    health[i],
    attack[i],
    counterAttack[i]
  );
}

$(document).ready(function() {
  $(".freeAgent").on("click", function() {
    if (heroExists) {
      //Hero has been set, clicks now select villains
      if ($(this).attr("class") == "assigned") {
        return;
      }
      if (villainHP > 0) {
        return;
      }
      //Configure villain
      /****Set the clicked villain to the Battleground */
      $(".villain").attr("src", $(this).attr("src"));
      var v = $(this).get(0).id;
      villain = characters[charId.indexOf(v)];

      /****Populate the spans with villain's name and HP */
      $("#spanVillain").html(villain.getName() + ":  ");
      $("#spanVillainHP").html(villain.getHealth());
      villainHP = parseInt(villain.getHealth(), 10);
      $(".villain").removeClass("defeated");
      /*****GAME ON!****/
      gameOver = false;

      /*****Clicking on first villain plays the battle music****/
      if (villainCount == 0) {
        battleAudio.volume = 0.5;
        battleAudio.currentTime = 63;
        battleAudio.play();
      }
      /****increment each time a villain is selected */
      villainCount++;
    } else {
      //Hero not set, assign hero
      //build hero
      /******Sends hero to the Battleground******/
      $(".hero").attr("src", $(this).attr("src"));

      $(this).addClass("assigned");
      $(this).removeClass("freeAgent");
      /****Send unselected characters to enemy list */
      $("#bullPen").append($(".freeAgent"));
      var x = $(this).get(0).id;

      /*****Change text from Select a Character to Hero */
      $("#charSelect").empty();
      $("#charSelect").html("Hero");

      //assign hero object
      hero = characters[charId.indexOf(x)];

      /*****Set hero name and HP*****/
      $("#spanHero").html(hero.getName() + ":  ");

      $("#spanHeroHP").html(hero.getHealth());
      heroHP = parseInt(hero.getHealth(), 10);
      /****Set flag used to set villains******/
      heroExists = true;
    }
  });

  /////////      BUTTONS         /////////////
  $("#restartBtn").click(function() {
    reset();
  });

  $("#startBtn").click(function() {
    $(".container").removeClass("hide");
    openingAudio.play();
    intervalId = setInterval(fadeOut, 500);
    $(this).addClass("hide");
  });

  $("#atkBtn").click(function() {
    if (gameOver) {
      //don't execute attack logic, game is over.
      return;
    }
    if ($("#spanVillainHP").html().length == 0) {
      $("#villainAttacks").html("Select an opponent to attack");
      return;
    }
    /******Sabre clash*****/
    audio.play();

    var aPts = hero.getAttack() * attackMult++;
    villainHP -= aPts;
    $("#spanVillainHP").html("");
    $("#spanVillainHP").html(villainHP.toString());
    if (villainHP <= 0) {
      //Villain dispatched
      setTimeout(function() {
        twirlAudio.play();
      }, 1000);

      wins++;
      if (wins < 3) {
        //Update Span, game still on
        $("#villainAttacks").html(
          hero.getName() +
            " has defeated " +
            villain.getName() +
            ".  Select another opponent."
        );

        $(".freeAgent[id='" + villain.getId() + "']").addClass("hide");
        $(".villain").addClass("defeated");
      } else {
        //Third villain defeated, game over
        $(".freeAgent[id='" + villain.getId() + "']").addClass("hide");
        $(".villain").addClass("defeated");
        $("#villainAttacks").html(
          hero.getName() +
            " has defeated " +
            villain.getName() +
            ".  " +
            hero.getName() +
            " is victorious!"
        );
        //Stop background music, pause, play victory message.
        $("#restartBtn").attr("disabled", false);
        battleAudio.pause();
        setTimeout(function() {
          audio.src = "assets/sounds/force.mp3";
          audio.play();
        }, 2000);
      }
      gameOver = true;
    } else {
      //Villain still alive, counter attack.
      $("#villainAttacks").html(
        hero.getName() +
          " attacks " +
          villain.getName() +
          " with " +
          aPts.toString() +
          " damage."
      );
      var counterAtk = villain.getCounterAttack();
      heroHP -= counterAtk;

      $("#spanHeroHP").html(heroHP.toString());

      if (heroHP <= 0) {
        $("#heroAttacks").html(
          villain.getName() + " has defeated " + hero.getName() + "."
        );
        $(".hero").addClass("defeated");
        $("#restartBtn").removeClass("disabled");
        $("#restartBtn").attr("disabled", false);
        gameOver = true;
        battleAudio.pause();
        setTimeout(function() {
          audio.src = "assets/sounds/PowerOfTheDarkSide.mp3";
          audio.play();
        });
      } else {
        $("#heroAttacks").html(
          villain.getName() +
            " counterattacks with " +
            counterAtk.toString() +
            " damage."
        );
      }
    }
  });
});

function reset() {
  //reset variables
  heroExists = false;
  attackMult = 1;
  wins = 0;
  hero, villain, player;
  heroExists = false;
  heroHP = 0;
  villainHP = 0;
  gameOver = false;
  audio.src = "assets/sounds/sabreClash.wav";
  intervalId;
  villainCount = 0;
  //reset classes/html
  $(".freeAgent").removeClass("hide assigned");
  $("#charSelect").html("Select a Character");
  $(".assigned").addClass("freeAgent");
  $("#holding").append($(".freeAgent"));

  $("#holding").append($("#rey")); //I'm sure there's a better
  $("#holding").append($("#luke")); //way to do this, but it's
  $("#holding").append($("#vader")); //too late in the week to research.
  $("#holding").append($("#palpatine"));

  $(".villain").attr("src", "assets/images/villainPH.png");
  $(".hero").attr("src", "assets/images/heroPH.png");
  $("#spanHero").html("");
  $("#spanHeroHP").html("");
  $("#spanVillain").html("");
  $("#spanVillainHP").html("");
  $("#heroAttacks").html("");
  $("#villainAttacks").html("");
  $(".defeated").removeClass("defeated");
  $("#restartBtn").attr("disabled", true);
}

function fadeOut() {
  var myVol;

  openingAudio.volume = 1;
  decrementer--;
  /**fade out volume once decrmenter gets to 5****/
  if (decrementer <= 5) {
    myVol = decrementer * 0.1;
    openingAudio.volume = myVol;
  }
  /****if volume is 0, stop playing the audio */
  if (myVol == 0) {
    stop();
    openingAudio.pause();
  }
}

function stop() {
  clearInterval(intervalId);
}
