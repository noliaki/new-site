/*!
 * wlb.js 0.1.0
 * http://weblabox.com/
 *
 * Copyright (c) 2012 Noriaki Yamada
 *
 * jQuery 1.2.3+
 *
 */

 /* 圧縮されたjsなどを先に読んでいる場合、セミコロンが無いためのエラーを防ぐために最初にセミコロンをつける　*/
;(function($){/*　jQueryを引数に$で受け取り、これ以降は $ でjQueryを使用できるようにする。（コンフリクトを避けるため）　*/

  /* 外部jsとの連携も図るため、jQueryのプロパティ「wlb」としても使えるようにする　*/
  var wlb = $.wlb = (function(){
    
    var
    /*　ユーザーエージェントを UA に格納　*/
    UA = navigator.userAgent,

    /*　モバイルかどうかの判定をする関数（使い方は下の方に書いています）　*/
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
      ];
      for(var i = -1, len = arguments.length; ++ i < len;){
        useragents.push(arguments[i]);
      }
      var pattern = new RegExp(useragents.join("|"), "i");
      var matchStr = UA.match(pattern);
      return matchStr? matchStr[0] : false;
    },// isMobile    

    /*　IEの判定関数（使い方は下の方に書いています）　*/
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
    },// isIE
    

    /*　ロールオーバーで画像を切り替える関数（使い方は下の方に書いています。）　*/
    rollOver = function(option){
      var param = $.extend({
        "fixClass"  : "current",
        "onName"    : "_on",
        "offName"   : "_off",
        "overClass" : null
      }, option);

      /*　まず、どのimgタグにイベントを付与するかを決定　*/
      var $img = $( (!param["overClass"]? "." + param["overClass"] + ", " : "") + "img[src*=" + param["offName"] + "], input[src*=" + param["offName"] + "]" );
      
      /*　eachメソッドは重いので、いつものfor文で回す　*/
      for(var i = -1, len = $img.length; ++i < len;){
        /*　現在の該当するjQueryオブジェクトの選択　*/
        var $focus = $img.eq(i);

        /*　もともとのsrc属性を変数に格納して保存しておく　*/
        var defaultSrc = $focus.attr("src");

        /*　画像の拡張子を調べる　*/
        var imgType = defaultSrc.match(/(\.gif|\.jpg|\.png)$/);
        if(imgType){
          imgType = imgType[0];

          /*　ロールオーバーしたときのsrc属性の値を格納する変数を用意　*/
          var rollOverSrc;
          if(param["offName"] == ""){
            rollOverSrc = defaultSrc.replace(imgType, param["onName"] + imgType);
          } else {
            rollOverSrc = defaultSrc.replace(param["offName"] + imgType, param["onName"] + imgType);
          }

          /*　ロールオーバー画像のプリロード */
          var rollOverImg = new Image();
          rollOverImg.src = rollOverSrc;

          /*　それぞれのimgに"data"として"src"を保存　*/
          $focus.data("src", {
            "defaultSrc" : defaultSrc,
            "rollOverSrc" : rollOverSrc
          })/* hover関数でロールオーバー、ロールアウトのイベント付与 */
          .hover(function(){
            var $this = $(this);
            $this.attr("src", $this.data("src").rollOverSrc);
          }, function(){
            var $this = $(this);
            $this.not( "." + param.fixClass ).attr("src", $this.data("src").defaultSrc);
          });
        }// if
      }// for
      delete $focus;
      return $img;
    },// rollOver
    
    scroll = function(option){
      var param = $.extend({
        "scrollClass" : "pageTop",
        "duration"    : "slow",
        "easing"      : "swing"
      }, option);
      var $scroller = $( (/safari/i.test(UA))? "body" : "html" );
      var $pageTop = $("p." + param["scrollClass"] + " a, a." + param["scrollClass"] + ', a[href^="#"]');
      for(var i = -1, len = $pageTop.length; ++ i < len;){
        $pageTop.eq(i)
        .click(function(){
          var href = $(this).attr("href"),
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
    },//scroll
    
    blank = function(option){
      var param = $.extend({
        "blankClass"    : "external",
        "selfClass"     :"_self",
        "anotherDomain" : false
      }, option);
      var $blankLink = $( (param.anotherDomain? "a[href^='http://'], a[href^='https://'], a." : "a.") + param["blankClass"] ).not( "." + param["selfClass"] );
      for(var i = -1, len = $blankLink.length; ++ i < len;){
        $blankLink.eq(i)
        .click(function(){
          window.open(this.href, "_blank");
          return false;
        });
      }
      return $blankLink;
    },// blank

    removeIELine = function(){
      return $("a")
      .focus(function(){
        if(this.blur) this.blur();
      });
    };// removeIELine
    
    return {
      "isMobile"      : isMobile,
      "isIE"          : isIE,
      "rollOver"      : rollOver,
      "blank"         : blank,
      "scroll"        : scroll,
      "removeIELine"  : removeIELine
    }   
  })();
    
  /* document | ready
  ----------------------------------------------------*/
  $(function(){
    wlb.rollOver();
    /*
      ■//////　rollOver｜使い方　/////////////////////////////////■

      デフォルトでは拡張子の前に"_off"が命名されている画像(imgタグ、inputタグ)に対してロールオーバー・ロールアウト効果が発生します。
      ロールオーバーした際の画像の名前は"_off"を"_on"に置き換わった画像になります。
      逆にロールアウトした際には"_on"が"_off"に置き換わります。
      
      もし、ロールオーバーの画像の名前を"_on"では無く、違う名前にしたい場合はoption指定で変更することが可能です。
      例１）：ロールオーバーした際に"_on"ではなく、"_active"に置き変わって欲しい場合
      $.wlb.rollOver();
      ↓
      $.wlb.rollOver({"onName":"_active"});
      と変更。
      
      "_off"が命名されている画像ではなく、違う命名規則がある場合もoption指定できます。
      例２）："_default"が命名されている画像にロールオーバー・ロールアウト効果を発生させたい。
      $.wlb.rollOver();
      ↓
      $.wlb.rollOver({"offName":"_default"});
      "onName"を指定しなければ、"_default"が"_on"に置き換わります。
      
      また、任意のクラス名が付いているimgタグ、inputタグにロールオーバー・ロールアウト効果を発生させたいときも
      option指定できますが、その際には【置き換わられる(?)文字列】を指定してください。
      つまり、"offName"を指定してください。
      例３）："ro"クラスが付いているimgタグ、inputタグにロールオーバー・ロールアウト効果を発生させたいとき。
          そしてその"src"属性の拡張子の前に"_over"をつけた画像をロールオーバーにしたい時
      $.wlb.rollOver();
      ↓
      $.wlb.rollOver({"overClass":"ro", "offName":"", "onName":"_over"});
      ※"onName"の指定がない場合は"offName"で指定した文字列が"_on"に置き換わります。
      
      さらに、ロールアウトしても"current"クラスが付いている画像はロールアウトしても"_on"が"_off"に置き換わりません。
      そのクラス名を変更したい場合もoption指定で変更することが可能です。
      例４）："active"クラスが付いているときはロールアウトしても"_off"に置き換わらないようにしたい場合
      $.wlb.rollOver();
      ↓
      $.wlb.rollOver({"fixClass":"active"});
      と変更

      尚、ロールオーバーした時の画像のsrc、もしくは元々の画像のsrcはそれぞれの画像に　"data"　で関連付けた
      "src"という名前のオブジェクトに保存されています。

      例5）
      $("　ロールオーバー・ロールアウト効果の付与された画像のセレクター　").data("src").defaultSrc; // 元々の画像のsrcが取得できます
      $("　ロールオーバー・ロールアウト効果の付与された画像のセレクター　").data("src").rollOverSrc; // ロールオーバーした際の画像のsrcが取得できます

      返り値はロールオーバー・ロールアウト効果の付与されたjQueryオブジェクト
    ----------------------------------------------------*/
    
    wlb.scroll();
    /*
      ■//////　scroll｜使い方　/////////////////////////////////■
      
      親のpタグに"pageTop"クラスが付いているaタグ、もしくは "pageTop"クラスが付いているaタグ、もしくは href属性が"#"で始まるaタグにイベント付与されます。
      イベント付与するクラス名を変えたい場合はoption指定で変更可能です。
      例１）："page_top"クラスが付いているaタグにイベント付与したい。
      $.wlb.scroll();
      ↓
      $.wlb.scroll({"scrollClass":"page_top"});
      
      
      例２）：イージングを"easeOutQuad"にしたい
      $.wlb.scroll({"easing":"easeOutQuad"});
      
      例１、例２どちらも指定したい時
      $.wlb.scroll({"scrollClass":"page_top","easing":"easeOutQuad"});
      
      
      アニメーション時間の設定もoption指定できます。
      例３）：アニメーション時間を２秒にしたい
      $.wlb.scroll();
      ↓
      $.wlb.scroll({"duration":2000});

      返り値はイベント付与されたjQueryオブジェクト
    ----------------------------------------------------*/
    
    wlb.blank();
    /*
      ■//////　blank｜使い方　/////////////////////////////////■
      
      "external"クラスが付いてるaタグにイベント付与されます。（別ウィンドウでリンク先が開く）
      ただ、aタグに"_self"クラスがついてる場合は別ウィンドウで開きません。
      そのクラス名を変更したい場合はoption指定できます。
      例１）："sameWindow"クラスが付いているaタグは同ウィンドウでリンク先を開きたい。
      $.wlb.blank();
      ↓
      $.wlb.blank({"selfClass":"sameWindow"});
      
      href属性が"http://"、"https"で始まるaタグにも別ウィンドウで開かせたい場合は
      "anotherDomain"オプションを【true】にしてください。
      $.wlb.blank({"anotherDomain":true});

      返り値はイベント付与されたjQueryオブジェクト
    ----------------------------------------------------*/
    
    if(wlb.isIE()) wlb.removeIELine();

    /*
      ■//////　removeIELine｜使い方　/////////////////////////////////■

      IEでクリックした際に出てくる点線を見えなくする関数です。
      特にもう一度使う必要はないと思います。
    ----------------------------------------------------*/
    
    /*
      ■//////　isIE｜使い方　/////////////////////////////////■

      $.wlb.isIE();
      でユーザーエージェントの判定を行います。
      IEの場合の返り値は【MSIE "IEのバージョン"】で返ってきます。


      特定のバージョンかどうかを知りたい場合は引数に数字をを入れてください。
      
      例１）：IE6かどうかを知りたい。
      $.wlb.isIE(6);
      返り値は【true】もしくは【false】
    ----------------------------------------------------*/
    
    
    /*
      ■//////　isMobile｜使い方　/////////////////////////////////■

      $.wlb.isMobile();
      でユーザーエージェントの判定を行います。
      
      デフォルトではユーザーエージェントに以下の文言がある場合に【true】で返ってきます。
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
      
      「ipad」など特定のユーザーエージェントを追加したい場合は引数に
      特定の文字列を入れてください。
      
      例１）：iPadも含めてモバイルかどうかを知りたい。
      $.wlb.isMobile("ipad");

      返り値は【true】もしくは【false】
    ----------------------------------------------------*/
    
  });// document | ready
})(jQuery);