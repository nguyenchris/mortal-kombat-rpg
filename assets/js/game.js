// https://78.media.tumblr.com/e0c55fc60b703206f5b50d61f08c66d1/tumblr_mgj1s8HP4A1rvbjw7o1_500.gif



$(document).ready(function () {
  // show splash page once document is ready
  $('.splash').show();


  // initalize game object
  // mortalKombat = {
  //   characters: {
  //     sub_zero
  //   }
  // }



  //////////// This code will move images 
  // $("#splash-img").click(function () {
  //     var th = $(this);
  //     if ($(th).css('left') == '5px') {
  //         console.log("ret");
  //         $(th).animate({
  //             "left": "300px"
  //         }, 3000);
  //     } else {
  //         console.log("sdffsdsff");
  //         $(th).animate({
  //             "left": "200px"
  //         }, 3000);
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

  // click event listener for play button
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


  function removeSplash(el) {
    $(el).remove();
    // show game page
    $('.game-page').show();
    

    // $('body').animateCss('zoomIn');
  };
});