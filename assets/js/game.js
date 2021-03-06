$(document).ready(function () {
  // show splash page once document is ready
  $('.splash').show();

  // begin loading background music to prevent delay in playing;
  var backgroundSong = new Audio('assets/audio/themesong.mp3');
  backgroundSong.volume = 0.4;
  backgroundSong.preload = 'auto';
  backgroundSong.loop = true;

  // initialize game object
  mortalKombat = {
    characters: {
      subZero: {
        name: 'Sub-Zero',
        health: 120,
        origHealth: 120,
        attack: 8,
        charImg: 'assets/images/subzeroProf.png',
        charGif: 'assets/images/subzero.gif',
        counterAttack: 15,
        audio: ['assets/audio/subzero.wav', 'assets/audio/subzeroWins.wav']
      },
      scorpion: {
        name: 'Scorpion',
        health: 100,
        origHealth: 100,
        attack: 15,
        charImg: 'assets/images/scorpionProf.png',
        charGif: 'assets/images/scorpion.gif',
        counterAttack: 5,
        audio: ['assets/audio/scorpion.wav', 'assets/audio/scorpionWins.wav']
      },
      johnnyCage: {
        name: 'Johnny Cage',
        health: 150,
        origHealth: 150,
        attack: 8,
        charImg: 'assets/images/johnnycageProf.png',
        charGif: 'assets/images/johnnycage.gif',
        counterAttack: 20,
        audio: [
          'assets/audio/johnnycage.wav',
          'assets/audio/johnnycageWins.wav'
        ]
      },
      raiden: {
        name: 'Raiden',
        health: 180,
        origHealth: 180,
        attack: 7,
        charImg: 'assets/images/raidenProf.png',
        charGif: 'assets/images/raiden.gif',
        counterAttack: 25,
        audio: ['assets/audio/raiden.wav', 'assets/audio/raidenWins.wav']
      }
    },

    userChar: '',
    userCharObj: {},
    opponentsArr: [],
    opponentChar: '',
    opponentCharObj: {},
    turnCounter: 1,
    userHealthBarWidth: 100,
    oppHealthBarWidth: 100,
    userAfterWidth: null,
    oppAfterWidth: null,

    // insert all characters into opponents Array
    initializeOpponentsArr: function () {
      for (var key in this.characters) {
        this.opponentsArr.push(key);
      }
      this.initializeCharacters();
    },

    // display character area for selection
    initializeCharacters: function () {
      backgroundSong.play();

      this.oppHealthBarWidth = 100;

      var directions = $("<div class='directions'>Select Your Fighter</div>")
      $('.playerMenu').append(directions);

      if (this.userChar.length > 0 && this.opponentsArr.length > 1) {
        $('.directions').text('Not Bad, But Can You Beat The Next Opponent?')
      } else if (this.opponentsArr.length === 1) {
        $('.directions').text('DO YOU HAVE WHAT IT TAKES TO BEAT ' + this.opponentsArr[0] + '?')
      }

      if (this.userChar.length === 0) {
        var directionsMusic = $("<div class='music-directions'>Turn <span>Up</span> Your <span>Volume</span> For <span>Best</span> Experience</div>")
        $('.music-directions').append(directionsMusic);
      }

      for (i = 0; i < this.opponentsArr.length; i++) {
        var charDiv = $("<div class='playerChar' data-name='" + this.opponentsArr[i] + "'>");
        var charName = $("<div class='character-name'>").text(this.characters[this.opponentsArr[i]].name);
        var charImage = $("<img alt='image'>").attr('src', this.characters[this.opponentsArr[i]].charImg);
        var charHealth = $("<div class='character-health'>").text('HP: ' + this.characters[this.opponentsArr[i]].health);

        charDiv.append(charName).append(charImage).append(charHealth);
        charDiv.animateCss('zoomIn');
        $('.playerMenu').append(charDiv);
      }
      this.selectChar();
    },

    gameStart: function () {
      // Check if usercharacter or opponent has been chosen
      if (this.userChar.length === 0 || this.opponentChar.length === 0) {
        // if not, select character
        this.selectChar();
      } else {
        $('.playerMenu').empty();
        backgroundSong.pause();
        this.renderCharacterVersus();
      }
    },

    // determines which characters are selected for user and opponent. Whichever is selected will be assigned to the properties userChar and opponentChar
    selectChar: function () {
      // hover animation effect over character options
      $('.playerChar').mouseenter(function () {
        $(this).animateCss('pulse');
        $(this).css('animation-duration', '.8s');
        $(this).mouseleave(function () {
          $('.playerChar').removeClass('animated pulse');
        });
      });

      $('.playerChar').on('click', function () {
        var th = $(this);

        // if there is not a character selected for the user..
        if (mortalKombat.userChar.length === 0) {
          // assign chosen character to user
          mortalKombat.updateCharacters('user', th.attr('data-name'));

          $(th).animateCss('zoomOutLeft', function () {
            mortalKombat.removeElement(th);
            $('.directions').text('Select your Opponent');
          });
        } else {
          // if user has already chosen, the selection for opponent is assigned to opponentChar
          mortalKombat.updateCharacters('opponent', th.attr('data-name'));

          $(th).animateCss('zoomOutRight', function () {
            mortalKombat.removeElement(th);
            mortalKombat.gameStart();
          });
        }
      });
    },

    // update the selected characters for user and opponent and assign to properties
    // also play sound for selected character
    updateCharacters: function (player, name) {
      var index = this.opponentsArr.indexOf(name)

      if (player === 'user') {
        this.userChar = name;
        this.opponentsArr.splice(index, 1);
        this.userCharObj = this.characters[name];
      }

      if (player === 'opponent') {
        this.opponentChar = name;
        this.opponentsArr.splice(index, 1);
        this.opponentCharObj = this.characters[name];
      }
    },

    // function to remove any element and its child elements depending on what element is passed in as an argument
    removeElement: function (el) {
      el.remove();
    },

    // play random grunt noise
    playAudioGrunt: function () {
      var randomNum = Math.floor(Math.random() * 6);
      var audio = new Audio("assets/audio/fx" + randomNum + ".wav");
      audio.play();
    },

    playAudioHit: function () {
      var randomNum = Math.floor(Math.random() * 7);
      var audio = new Audio("assets/audio/hit" + randomNum + ".wav");
      audio.play();
    },

    // play audio of the character's name
    playAudioName: function (name) {
      var audio = new Audio(name);
      audio.play();
    },

    // player "fight" audio
    playAudioFight: function () {
      var audio = new Audio('assets/audio/fight.wav');
      audio.play();
    },

    playAudioWin: function (player) {
      var audio = new Audio("assets/audio/" + player + "Wins.wav");
      audio.play();
    },

    //  create character versus screen depending on character selections for both user and opponent
    renderCharacterVersus: function () {
      var vs = $("<img alt='image' class='versus'>").attr(
        'src',
        'assets/images/vs.png'
      );
      vs.animateCss('zoomInDown');
      $('.vs').append(vs);

      var newImgUser = $("<img alt='image' class='versus'>").attr(
        'src',
        this.userCharObj.charImg
      );

      newImgUser.animateCss('slideInLeft', function () {
        var newImgOpp = $("<img alt='image' class='versus'>").attr(
          'src',
          mortalKombat.opponentCharObj.charImg
        );

        newImgOpp.animateCss('slideInRight', function () {
          var fight = $("<img alt='image' class='versus'>").attr(
            'src',
            'assets/images/fight.png'
          );

          fight.animateCss('zoomIn', function () {
            // after animation ends for the "fight" logo, render stats bar
            mortalKombat.renderStats();
          });

          // display fight logo and play fight audio
          $('.fight').append(fight);
          mortalKombat.playAudioFight();
        });

        $('.vsP2').append(newImgOpp);
        mortalKombat.playAudioName(mortalKombat.opponentCharObj.audio[0]);
      });

      $('.vsP1').append(newImgUser);
      this.playAudioName(this.userCharObj.audio[0]);
    },

    // render the selected user and opponent characters onto screen
    // also render attack button
    renderCharacterFighters: function () {
      // display user selecter fighter
      var userFighter = $("<img alt='image' id='p1'>").attr(
        'src',
        this.userCharObj.charGif
      );

      userFighter.animateCss('fadeIn');
      $('.userArea').append(userFighter);

      // display opponent fighter
      var opponentFighter = $("<img alt='image' id='p2'>").attr(
        'src',
        this.opponentCharObj.charGif
      );

      opponentFighter.animateCss('fadeIn');
      $('.opponentArea').append(opponentFighter);

      this.renderFightBtn();
    },

    // creates fight button and animates characters
    renderFightBtn: function () {
      // create attack button
      var button = $('<button id="attack">');
      button.text('Attack');
      $('.userArea').append(button);

      this.startGamePlay();
    },

    // render the stats info above fight area to display health bar, logo, name, HP total
    renderStats: function () {
      $('.versus').remove();

      //render mortal kombat logo in stats bar
      var logo = $("<img class='stats' alt='Mortal Kombat Logo'>").attr(
        'src',
        'assets/images/mortalkombatLogo.png'
      );

      logo.animateCss('slideInDown');
      $('#logo').append(logo);

      //render user health bar
      var userCharName = $("<div class='stats' id='userCharName'>").text(
        this.userCharObj.name
      );
      var userName = $("<div class='stats' id='userName'>").text('You');
      var userHealthBar = $("<div class='healthBar userHealthBar stats'>");
      // $('#userHealth').css('width', this.userAfterWidth + '%');
      var userHealthStat = $("<div class='stats' id='userHealth'>").text(
        this.userCharObj.health
      );

      // append inner health stat bar to entire health bar
      userHealthBar.append(userHealthStat);
      userHealthBar.animateCss('fadeInLeft');

      // append all user stat elements
      $('.userStats')
        .append(userCharName)
        .append(userName)
        .append(userHealthBar);
      $('#userHealth').css('width', this.userHealthBarWidth + '%');

      // render opponent health bar
      var opponentCharName = $(
        "<div class='stats' id='opponentCharName'>"
      ).text(this.opponentCharObj.name);
      var opponentName = $("<div class='stats' id='opponentName'>").text(
        'Opponent'
      );
      var opponentHealthBar = $(
        "<div class='healthBar opponentHealthBar stats'>"
      );
      var opponentHealthStat = $(
        "<div class='stats' id='opponentHealth'>"
      ).text(this.opponentCharObj.health);

      // append inner health stat bar to entire health bar
      opponentHealthBar.append(opponentHealthStat);
      opponentHealthBar.animateCss('fadeInRight', function () {
        mortalKombat.renderCharacterFighters();
      });

      // append all opponent stat elements
      $('.opponentStats')
        .append(opponentCharName)
        .append(opponentName)
        .append(opponentHealthBar);
    },

    // logic to game after user clicks the attack button
    startGamePlay: function () {

      // click event listener for fight button
      $('#attack').on('click', function () {
        // disable attack button to prevent multiple clicks during animations
        $(this).prop('disabled', true);

        var userAttack = mortalKombat.userCharObj.attack * mortalKombat.turnCounter;

        // calculate percent damage from total health in order to subtract from health bar's percent width
        var userDamage = Math.round(mortalKombat.opponentCharObj.counterAttack / mortalKombat.userCharObj.origHealth * 100)
        var oppDamage = Math.round(userAttack / mortalKombat.opponentCharObj.origHealth * 100)

        // set width of health bar in order to pass through to updateStats method and keep the health bar at this width depending on amount of damage inflicted
        mortalKombat.userAfterWidth = mortalKombat.userHealthBarWidth - userDamage
        mortalKombat.oppAfterWidth = mortalKombat.oppHealthBarWidth - oppDamage

        // since user attacks first, check if user's attack will be higher than opponent's health
        if (userAttack >= mortalKombat.opponentCharObj.health) {

          mortalKombat.opponentCharObj.health = 0;
          // if it is, animate only user fighter and restart game
          mortalKombat.animateUserFighter(true);
        } else {
          // if not, subtract health from user and opponent based on attack
          mortalKombat.opponentCharObj.health -= userAttack;

          mortalKombat.userCharObj.health -= mortalKombat.opponentCharObj.counterAttack;

          mortalKombat.animateUserFighter(false);
        }

        mortalKombat.turnCounter++;
      });
    },

    // animate user's fighter and opponent's health bar with a parameter that checks for if the user has won or not
    animateUserFighter: function (check) {
      var th = $('#p1');
      $(th).animate({
        left: '40%'
      }, 730, function () {
        // play audio after character hits the other character
        mortalKombat.playAudioHit();

        // update stats for opponent
        mortalKombat.updateStats('#opponentHealth', mortalKombat.oppHealthBarWidth, mortalKombat.opponentCharObj.health, mortalKombat.oppAfterWidth);
        mortalKombat.displayDamage('.opponentArea', 'p2', mortalKombat.userCharObj.attack * (mortalKombat.turnCounter - 1));
      });

      // move user character back to original position
      $(th).animate({
        left: '0px'
      }, 730, function () {
        // if argument "check" is true
        if (check) {
          mortalKombat.nextRound(mortalKombat.userCharObj.name, mortalKombat.userChar, '#p2');

          // if not, animate opponent fighter
        } else {
          mortalKombat.animateOppFighter();
        }
      });
    },


    // render opponent fighter animation and also users health bar
    animateOppFighter: function () {
      var th2 = $('#p2');
      // after user character returns, move opponent character to hit user character

      $(th2).animate({
        right: '40%'
      }, 730, function () {

        mortalKombat.playAudioGrunt();

        mortalKombat.updateStats('#userHealth', mortalKombat.userHealthBarWidth, mortalKombat.userCharObj.health, mortalKombat.userAfterWidth);

        mortalKombat.displayDamage('.userArea', 'p1', mortalKombat.opponentCharObj.counterAttack);
      });

      // move opponent character back to original position
      $(th2).animate({
        right: '0px'
      }, 730, function () {

        mortalKombat.checkGame();

        // re-enable attack button
        $('#attack').prop('disabled', false);
      });
    },

    // displays amount of health taken away after damage inflicted
    displayDamage: function (selector, player, damage) {
      var pointsOff = $("<div class='damage' id='damage-" + player + "'><span>-" + damage + "</span> HP</div>")

      pointsOff.animateCss('bounceIn', function () {
        $('#damage-' + player).remove();
      })
      $(selector).append(pointsOff);
    },


    // checks the game to determine health of characters and how to proceed
    checkGame: function () {
      // if user's next attack will be greater or equal to opponent's hp and user's hp is greater than 0
      if (this.userCharObj.attack * this.turnCounter >= this.opponentCharObj.health && this.userCharObj.health > 0) {
        this.playFinishHim();

        // if user lost all HP
      } else if (this.userCharObj.health <= 0) {
        this.nextRound(this.opponentCharObj.name, this.opponentChar, '#p1');
      }
    },


    // determines who won the round and displays page to proceed further
    nextRound: function (winner, name, loser) {
      var winnerDisplay = $("<div class='flash' id='winner'><span>" + winner + "</span><p>Wins</p></div>")
      var fatality = $("<img class='zoomIn' id='fatality' alt='Finish Him'>").attr('src', 'assets/images/fatality.png');

      winnerDisplay.animateCss('flash');

      var lowerCaseName = name.toLowerCase();

      fatality.animateCss('zoomIn', function () {
        $('#fatality').hide();
        $('.roundEnd').append(winnerDisplay);
        mortalKombat.playAudioWin(lowerCaseName);
      });

      $(loser).animateCss('fadeOut', function () {
        if (loser === '#p1') {
          $('.userArea').empty();
        } else {
          $('.opponentArea').empty();
        }
      })




      setTimeout(function () {
        $('.roundEnd').append(fatality);

        var audio = new Audio('assets/audio/fatality.wav');
        audio.play();
      }, 300)


      setTimeout(function () {
        $('.userArea, .opponentArea, .roundEnd, #logo, .userStats, .opponentStats').empty();

        if (name === mortalKombat.userChar && mortalKombat.opponentsArr.length === 0) {
          mortalKombat.restartGame(true);
        } else if (name === mortalKombat.userChar && mortalKombat.opponentsArr.length !== 0) {
          mortalKombat.initializeCharacters()
        } else {
          mortalKombat.restartGame(false);
        }
      }, 5700)

    },

    // displays the finish him image on screen and plays finish him audio
    playFinishHim: function () {
      var finishHim = $("<img alt='Finish Him'>").attr(
        'src',
        'assets/images/finishhim.gif'
      );
      finishHim.animateCss('zoomIn', function () {
        setTimeout(function () {
          finishHim.hide();
        }, 400)
      })
      $('.finish-him').append(finishHim);
      var audio = new Audio('assets/audio/finishhim.wav');
      audio.play();
    },

    // will update page to show HP and render health bar to reflect HP
    updateStats: function (selector, barWidth, hP, afterDamageWidth) {
      var elem = $(selector);
      var id = setInterval(frame, 29);
      // function to move health bar depending on damage inflicted
      function frame() {
        // if width of inner health bar reaches the the amount of current HP in percentage
        if (barWidth === afterDamageWidth) {
          // stop interval of decreasing width of inner health bar
          clearInterval(id);
          elem.css('width', afterDamageWidth + '%');

          if (selector == '#userHealth') {
            mortalKombat.userHealthBarWidth = afterDamageWidth;
          }
          if (selector == '#opponentHealth') {
            mortalKombat.oppHealthBarWidth = afterDamageWidth;
          }
        } else {
          barWidth--;
          elem.css('width', barWidth + '%');
          if (hP < 0) {
            hP = 0;
          }
          elem.text(hP);
        }
      }
    },

    // restart game, variables, and display different text depending on result
    restartGame: function (result) {
      this.userChar = '';
      this.userCharObj = {};
      this.opponentsArr = [];
      this.opponentChar = '';
      this.opponentCharObj = {};
      this.turnCounter = 1;
      this.userHealthBarWidth = 100;
      this.oppHealthBarWidth = 100;
      this.userAfterWidth = null;
      this.oppAfterWidth = null;
      this.characters.subZero.health = 120;
      this.characters.scorpion.health = 100;
      this.characters.johnnyCage.health = 150;
      this.characters.raiden.health = 180;

      var over1 = $("<p id='over1'></p>")
      var over2 = $("<p id='over2'></p>")

      over1.animateCss('slideInDown')
      over2.animateCss('fadeIn', function () {})


      if (result) {
        over1.text('VICTORY');
        over2.text('YOU DID WELL')
      } else {
        over1.text('YOU LOSE')
        over2.text('BETTER LUCK NEXT TIME')
        var audio = new Audio('assets/audio/isBest.wav');
        audio.play();
      }

      $('.game-over').append(over1)
      $('.game-over').append(over2);

      setTimeout(function () {
        $('.game-over').empty();
        $('.game-page').hide();
        $('.splash').show();
        $('.splash-btn').css({
          'height': '45px',
          'width': '85px'
        })
        $('.splash-btn').text('Play Again')
      }, 5100)

    }
  };

  // End of game object
  // ====================================================

  // extend jQuery and set animateCss function in order to easily add animateCss classes after events
  // also will add functionality to where jquery will do something after an animation ends when setting a callback function
  $.fn.extend({
    animateCss: function (animationName, callback) {
      var animationEnd = (function (el) {
        var animations = {
          animation: 'animationend',
          OAnimation: 'oAnimationEnd',
          MozAnimation: 'mozAnimationEnd',
          WebkitAnimation: 'webkitAnimationEnd'
        };

        for (var t in animations) {
          if (el.style[t] !== undefined) {
            return animations[t];
          }
        }
      })(document.createElement('div'));

      this.addClass('animated ' + animationName).one(animationEnd, function () {
        $(this).removeClass('animated ' + animationName);

        if (typeof callback === 'function') callback();
      });

      return this;
    }
  });

  // click event listener for play button to display animations and remove splash page
  $('.splash-btn').on('click', function () {
    // display animations
    $(this).css({
      'animation-delay': '0s',
      'animation-duration': '1s'
    });

    $('.splash-img').css({
      'animation-duration': '1s',
      'animation-delay': '0s'
    });

    $(this).animateCss('zoomOut');

    $('.splash-img').animateCss('fadeOutUp', function () {
      // hide entire splash page
      hideSplash('.splash');
    });
  });

  // removes splash page and displays game page
  function hideSplash(el) {
    $(el).hide();
    // show game page
    $('.game-page').show();

    backgroundSong.play();

    mortalKombat.initializeOpponentsArr();
  }
});