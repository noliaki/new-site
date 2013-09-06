;(function(win, $){
  "use strict";

   /* for IE6 */
  try { 
    document.execCommand("BackgroundImageCache", false, true); 
  } catch(e) {};

  var wlb = $.wlb = (function(){
    var
      UA = navigator.userAgent,
    
      isMobile = function(){
        var useragents = [
          "iPhone",         //  Apple iPhone
          "iPod",           //  Apple iPod touch
          "Android",        //  1.5+ Android
          "dream",          //  Pre 1.5 Android
          "CUPCAKE",        //  1.5+ Android
          "blackberry9500", //  Storm
          "blackberry9530", //  Storm
          "blackberry9520", //  Storm v2
          "blackberry9550", //  Storm v2
          "blackberry9800", //  Torch
          "webOS",          //  Palm Pre Experimental
          "incognito",      //  Other iPhone browser
          "webmate"         //  Other iPhone browser
        ],
        i = -1,
        len = arguments.length;
        
      for( ; ++ i < len; ){
        useragents.push(arguments[i]);
      }

      var
        pattern = new RegExp(useragents.join("|"), "i"),
        matchStr = UA.match(pattern);

      return matchStr? matchStr[0] : false;
    },

    isIE = function(){
      var pattern;
      if(arguments.length) {
        for(var i = -1, len = arguments.length; ++ i < len;){
          pattern = new RegExp("MSIE\s" + arguments[i], "i");
          if(pattern.test(UA)) return true;
        }
        return false;
      }
      pattern = new RegExp("MSIE\s[0-9]+\.[0-9]+", "i");
      var matchVersion = UA.match(pattern);
      return matchVersion? matchVersion[0] : false;
    },

    rollOver = function(option){
      var
        param = $.extend({
          "fixClass"  : "current",
          "onName"    : "_on",
          "offName"   : "_off",
          "overClass" : null
        }, option),
        $img = $( (!param["overClass"]? "." + param["overClass"] + ", " : "") + "img[src*=" + param["offName"] + "], input[src*=" + param["offName"] + "]" ),
        i = -1,
        len = $img.length;

      for( ; ++i < len; ){

        var
          $focus = $img.eq(i),
          defaultSrc = $focus.attr("src"),
          imgType = defaultSrc.match(/(\.gif|\.jpg|\.png)$/);

        if(imgType){
          imgType = imgType[0];
          var rollOverSrc;
          if(param["offName"] == ""){
            rollOverSrc = defaultSrc.replace(imgType, param["onName"] + imgType);
          } else {
            rollOverSrc = defaultSrc.replace(param["offName"] + imgType, param["onName"] + imgType);
          }
          var rollOverImg = new Image();
          rollOverImg.src = rollOverSrc;
          $focus.data("src", {
            "defaultSrc" : defaultSrc,
            "rollOverSrc" : rollOverSrc
          })
          .on({
            "mouseenter": function(){
              var $this = $(this);
              $this.attr("src", $this.data("src").rollOverSrc);
            },
            "mouseleave": function(){
              var $this = $(this);
              $this.not( "." + param.fixClass ).attr("src", $this.data("src").defaultSrc);
            }
          });
        }
      }
      $focus = null;
      return $img;
    },
    
    scroll = function(option){
      var
        param = $.extend({
          "scrollClass" : "pageTop",
          "duration"    : "slow",
          "easing"      : "swing"
        }, option),
        $scroller = $( (/safari/i.test(UA))? "body" : "html" ),
        $pageTop = $("p." + param["scrollClass"] + " a, a." + param["scrollClass"] + ', a[href^="#"]'),
        i = -1,
        len = $pageTop.length;

      for( ; ++ i < len; ){
        $pageTop.eq(i)
        .click(function(){
          var
            href = $(this).attr("href"),
            $target = $((href == "#" || href == "" || !href)? "html" : href);

          if(!$target.offset()) return;
          var position = $target.offset().top;
          $scroller.animate({
            "scrollTop" : position
          }, {
            "duration" : param["duration"],
            "easing" : param["easing"]
          });
          return false;
        });
      }
      return $pageTop;
    },
    
    blank = function(option){
      var
        param = $.extend({
          "blankClass"    : "external",
          "selfClass"     :"_self",
          "anotherDomain" : false
        }, option),
        $blankLink = $( (param.anotherDomain? "a[href^='http://'], a[href^='https://'], a." : "a.") + param["blankClass"] ).not( "." + param["selfClass"] ),
        i = -1,
        len = $blankLink.length;

      for( ; ++ i < len; ){
        $blankLink.eq(i)
        .click(function(){
          window.open(this.href, "_blank");
          return false;
        });
      }
      return $blankLink;
    };
    
    return {
      "isMobile"      : isMobile,
      "isIE"          : isIE,
      "rollOver"      : rollOver,
      "blank"         : blank,
      "scroll"        : scroll
    }   
  })();
    
  $(function(){
    wlb.rollOver();
    wlb.scroll();
    wlb.blank();
  });
})(window, jQuery);