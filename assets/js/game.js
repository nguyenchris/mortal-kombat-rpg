$(document).ready(function() {
  // show splash page once document is ready
  $('.splash').show();

  // begin loading background music to prevent delay in playing;
  var backgroundSong = new Audio('assets/audio/themesong.mp3');
  backgroundSong.volume = 0.4;
  backgroundSong.preload = 'auto';

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
        attack: 14,
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
    charactersObj: [],
    opponentChar: '',
    opponentCharObj: {},
    turnCounter: 1,
    killCounter: 0,
    userHealthBarWidth: 100,
    oppHealthBarWidth: 100,
    userAfterWidth: null,
    oppAfterWidth: null,

    // display character area for selection
    initializeCharacters: function() {
      for (var key in this.characters) {
        var charDiv = $("<div class='playerChar' data-name='" + key + "'>");
        var charName = $("<div class='character-name'>").text(
          this.characters[key].name
        );
        var charImage = $("<img alt='image'>").attr(
          'src',
          this.characters[key].charImg
        );
        var charHealth = $("<div class='character-health'>").text(
          'HP: ' + this.characters[key].health
        );

        charDiv
          .append(charName)
          .append(charImage)
          .append(charHealth);
        charDiv.animateCss('zoomIn');
        $('.playerMenu').append(charDiv);
      }

      this.selectChar();
    },

    gameStart: function() {
      // Check if usercharacter or opponent has been chosen
      if (this.userChar.length === 0 || this.opponentChar.length === 0) {
        // if not, select character
        this.selectChar();
      } else {
        $('.playerMenu').hide();
        backgroundSong.pause();
        this.renderCharacterVersus();
      }
    },

    // determines which characters are selected for user and opponent. Whichever is selected will be assigned to the properties userChar and opponentChar
    selectChar: function() {
      // hover animation effect over character options
      $('.playerChar').mouseenter(function() {
        $(this).animateCss('pulse');
        $(this).css('animation-duration', '.8s');
        $(this).mouseleave(function() {
          $('.playerChar').removeClass('animated pulse');
        });
      });

      $('.playerChar').on('click', function() {
        var th = $(this);

        // if there is not a character selected for the user..
        if (mortalKombat.userChar.length === 0) {
          // assign chosen character to user
          mortalKombat.updateCharacters('user', th.attr('data-name'));

          $(th).animateCss('zoomOutLeft', function() {
            mortalKombat.removeElement(th);
            $('.directions').text('Select your Opponent');
          });
        } else {
          // if user has already chosen, the selection for opponent is assigned to opponentChar
          mortalKombat.updateCharacters('opponent', th.attr('data-name'));

          $(th).animateCss('zoomOutRight', function() {
            mortalKombat.removeElement(th);
            mortalKombat.gameStart();
          });
        }
      });
    },

    // update the selected characters for user and opponent and assign to properties
    // also play sound for selected character
    updateCharacters: function(player, name) {
      if (player === 'user') {
        this.userChar = name;
        this.userCharObj = this.characters[name];
      }

      if (player === 'opponent') {
        this.opponentChar = name;
        this.opponentCharObj = this.characters[name];
      }
    },

    // function to remove any element and its child elements depending on what element is passed in as an argument
    removeElement: function(el) {
      el.remove();
    },

    // play audio of the character's name
    playAudioName: function(name) {
      // var nameAudio = this.characters[name].audio[0];
      var audio = new Audio(name);
      audio.play();
      // backgroundSong.play();
    },

    // player "fight" audio
    playAudioFight: function() {
      var audio = new Audio('assets/audio/fight.wav');
      audio.play();
    },

    //  create character versus screen depending on character selections for both user and opponent
    renderCharacterVersus: function() {
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
      newImgUser.animateCss('slideInLeft', function() {
        var newImgOpp = $("<img alt='image' class='versus'>").attr(
          'src',
          mortalKombat.opponentCharObj.charImg
        );
        newImgOpp.animateCss('slideInRight', function() {
          var fight = $("<img alt='image' class='versus'>").attr(
            'src',
            'assets/images/fight.png'
          );
          fight.animateCss('zoomIn', function() {
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
    renderCharacterFighters: function() {
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
    renderFightBtn: function() {
      // create attack button
      var button = $('<button id="attack">');
      button.text('Attack');
      $('.userArea').append(button);
      
      this.startGamePlay();
    },

    // render the stats info above fight area to display health bar, logo, name, HP total
    renderStats: function() {
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
      opponentHealthBar.animateCss('fadeInRight', function() {
        mortalKombat.renderCharacterFighters();
      });
      // append all opponent stat elements
      $('.opponentStats')
        .append(opponentCharName)
        .append(opponentName)
        .append(opponentHealthBar);
    },

    // logic to game after user clicks the attack button
    startGamePlay: function() {

      // click event listener for fight button
      $('#attack').on('click', function() {
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
    animateUserFighter: function(check) {
      var th = $('#p1');
      $(th).animate({ left: '40%' }, 900, function () {
        // play audio after character hits the other character
        var audio = new Audio('assets/audio/mk2-100.wav');
        audio.play();

        // update stats for opponent
        mortalKombat.updateStats('#opponentHealth', mortalKombat.oppHealthBarWidth, mortalKombat.opponentCharObj.health, mortalKombat.oppAfterWidth);
      });

      // move user character back to original position
      $(th).animate({ left: '0px' }, 900, function () {
        // if argument "check" is true
        if (check) {
          // re-enable attack button
          $('#attack').prop('disabled', false);
          console.log('You win')
        // if not, animate opponent fighter
        } else {
          mortalKombat.animateOppFighter();
        }
      });
    },

    // render opponent fighter animation and also users health bar
    animateOppFighter: function() {
      var th2 = $('#p2');
      // after user character returns, move opponent character to hit user character
      $(th2).animate({ right: '40%' }, 900, function () {
        var audio = new Audio('assets/audio/mk2-100.wav');
        audio.play();
        mortalKombat.updateStats('#userHealth', mortalKombat.userHealthBarWidth, mortalKombat.userCharObj.health, mortalKombat.userAfterWidth);
      });
      // move opponent character back to original position
      $(th2).animate({ right: '0px' }, 900, function() {

        mortalKombat.checkGame();
        // re-enable attack button
        $('#attack').prop('disabled', false);
      });
    },


    // checks the game to determine health of characters and displays animations/sound depending on state of characters' health
    checkGame: function() {
      // if user's next attack will be greater or equal to opponent's hp
      if (mortalKombat.userCharObj.attack * mortalKombat.turnCounter >= mortalKombat.opponentCharObj.health) {
        this.playFinishHim();
      }
    },

    // displays the finish him image on screen and plays finish him audio
    playFinishHim: function() {
      var finishHim = $("<img alt='Finish Him'>").attr(
        'src',
        'assets/images/finishhim.gif'
      );
      finishHim.animateCss('zoomIn', function() {
        setTimeout(function() {
          finishHim.hide();
        }, 400)
      })
      $('.finish-him').append(finishHim);
      var audio = new Audio('assets/audio/finishhim.wav');
      audio.play();
    },

    // will update page to show HP and render health bar to reflect HP
    updateStats: function(selector, barWidth, hP, afterDamageWidth) {
      var elem = $(selector);
      var id = setInterval(frame, 70);
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
          elem.text(hP);
        }
      }
    }
  };

  // End of game object
  // ====================================================

  // extend jQuery and set animateCss function in order to easily add animateCss classes after events
  // also will add functionality to where jquery will do something after an animation ends when setting a callback function
  $.fn.extend({
    animateCss: function(animationName, callback) {
      var animationEnd = (function(el) {
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

      this.addClass('animated ' + animationName).one(animationEnd, function() {
        $(this).removeClass('animated ' + animationName);

        if (typeof callback === 'function') callback();
      });

      return this;
    }
  });

  // click event listener for play button to display animations and remove splash page
  $('.splash-btn').on('click', function() {
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

    $('.splash-img').animateCss('fadeOutUp', function() {
      // remove entire splash page
      removeSplash('.splash');
    });
  });

  // removes splash page and displays game page
  function removeSplash(el) {
    $(el).remove();
    // show game page
    $('.game-page').show();

    backgroundSong.play();

    mortalKombat.initializeCharacters();
  }

  function hideInsert(el) {
    el.hide();
  }
});
