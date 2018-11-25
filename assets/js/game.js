// https://78.media.tumblr.com/e0c55fc60b703206f5b50d61f08c66d1/tumblr_mgj1s8HP4A1rvbjw7o1_500.gif



$(document).ready(function () {
  // show splash page once document is ready
  $('.splash').show();

  var userChar2;

  // initalize game object
  mortalKombat = {
    characters: {
      subZero: {
      name: "Sub-Zero",
      health: 120,
      attack: 8,
      charImg: "assets/images/subzeroProf.png",
      charGif: "assets/images/subzero.gif",
      counterAttack: 15
      },
      scorpion: {
        name: "Scorpion",
        health: 100,
        attack: 14,
        charImg: "assets/images/scorpionProf.png",
        charGif: "assets/images/scorpion.gif",
        counterAttack: 5
      },
      johnnyCage: {
        name: "Johnny Cage",
        health: 150,
        attack: 8,
        charImg: "assets/images/johnnycageProf.png",
        charGif: "assets/images/johnnycage.gif",
        counterAttack: 20
      },
      raiden: {
        name: "Raiden",
        health: 180,
        attack: 7,
        charImg: "assets/images/raidenProf.png",
        charGif: "assets/images/raiden.gif",
        counterAttack: 25
      }
    },

    userChar: '',
    opponentsArr: [],
    charactersObj: [],
    opponent: '',
    turnCounter: 1,
    killCounter: 0,


    // display character area for selection
    initializeCharacters: function() {
      
      for (var key in this.characters) {

        var charDiv = $("<div class='playerChar' data-name='" + key + "'>");
        var charName = $("<div class='character-name'>").text(this.characters[key].name);
        var charImage = $("<img alt='image'>").attr("src", this.characters[key].charImg);
        var charHealth = $("<div class='character-health'>").text('HP: ' + this.characters[key].health);

        charDiv.append(charName).append(charImage).append(charHealth);
        charDiv.animateCss('zoomIn');
        $('.playerMenu').append(charDiv);
      }

      this.selectChar();
    },

    gameStart: function() {


      //animation effect when selecting a character
      // $('.playerChar').on('click', function() {
      //   var th = $(this)
      //   $(th).css('animation-iteration-count', 'initial');
      //   $(th).animateCss('zoomOutLeft', function() {
      //     removeInsert(th)
      //   })
      // });
    },

    // determines which characters are selected for user and opponent. Whichever is selected will be assigned to the properties userChar and opponent
    selectChar: function() {

      $('.playerChar').on('click', function() {
        var th = $(this);
        // $(th).animateCss('zoomOutLeft', function() {
        //   mortalKombat.hideElement(th);
        // })

      // if there is not a character selected for the user..
      if (mortalKombat.userChar.length === 0) {
          mortalKombat.userChar = th.attr('data-name');
          console.log(mortalKombat.userChar);
          // $(th).animateCss('zoomOutLeft', function() {
          //   mortalKombat.hideElement(th);
          // })
      } else {
        console.log('userChar has been set');
      }
    });
    },


    hideElement: function(el) {
      el.hide();
    }
  }



  //////////// This code will move images 
  // $("#p1").click(function () {
  //     var th = $(this);
  //     if ($(th).css('left') == '5px') {
  //         console.log("ret");
  //         $(th).animate({
  //             "left": "300px"
  //         }, 3000);
  //     } else {
  //         console.log("sdffsdsff");
  //         $(th).animate({
  //             "left": "80%"
  //         }, 1000);
  //         $(th).animate({
  //           "left": "0px"
  //       }, 1000);
  //     }
  // });


//   $("#p2").click(function () {
//     var th = $(this);
//     if ($(th).css('left') == '5px') {
//         console.log("ret");
//         $(th).animate({
//             "left": "300px"
//         }, 3000);
//     } else {
//         console.log("sdffsdsff");
//         $(th).animate({
//             "right": "80%"
//         }, 1000);
//         $(th).animate({
//           "right": "0px"
//       }, 1000);
//     }
// });



// extend jQuery and set animateCss function in order to easily add animateCss classes after events
// also will add functionality to where jquery will do something after an animation ends when setting a callback function
  $.fn.extend({
    animateCss: function(animationName, callback) {
      var animationEnd = (function(el) {
        var animations = {
          animation: 'animationend',
          OAnimation: 'oAnimationEnd',
          MozAnimation: 'mozAnimationEnd',
          WebkitAnimation: 'webkitAnimationEnd',
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
    },
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

    mortalKombat.initializeCharacters();

  }



  function hideInsert(el) {
    el.hide();


    // insert selected character and display in fight area for user
    // var newDiv = $('<div class="p1"><img src="assets/images/scorpion.gif" id="p1" alt=""></div>')
    // newDiv.animateCss('fadeIn');
    // $('.userArea').append(newDiv);

 
    $("#p1").click(function () {
      var th = $(this);
      if ($(th).css('left') == '5px') {
          console.log("ret");
          $(th).animate({
              "left": "300px"
          }, 3000);
      } else {
          console.log("sdffsdsff");
          $(th).animate({
              "left": "80%"
          }, 1000);
          $(th).animate({
            "left": "0px"
        }, 1000);
      }
  });
  }



    // animation effect when hovering mouse above character selection
    $('.playerChar').mouseenter(function() {
        (this).animateCss('pulse');
      $(this).mouseleave(function() {
        $('.playerChar').removeClass('animated pulse');
      })
    })

});