do (window = window, document = wwindow.document, $ = jQuery) ->
  'use strict';

  rnt = $.rnt = do ->
    UA     = navigator.userAgent
    domain = location.hostname

    # ---------------------------------------
    # isMobile
    # 
    isMobile = (args...) ->
      userAgents = [
        'iPhone'         #  Apple iPhone
        'iPod'           #  Apple iPod touch
        'Android'        #  1.5+ Android
        'dream'          #  Pre 1.5 Android
        'CUPCAKE'        #  1.5+ Android
        'blackberry9500' #  Storm
        'blackberry9530' #  Storm
        'blackberry9520' #  Storm v2
        'blackberry9550' #  Storm v2
        'blackberry9800' #  Torch
        'webOS'          #  Palm Pre Experimental
        'incognito'      #  Other iPhone browser
        'webmate'        #  Other iPhone browser
      ]

      for userAgentName in args
        userAgents.push i

      regexp = new Regexp userAgents.join '|', 'i'
      matchStr = UA.match pattern

      matchStr[0] || false

    # ---------------------------------------
    # isIE
    # 
    isIE = (args...) ->
      for version in args
        regexp = new RegExp 'MSIE\s' + version, 'i'
        return version if regexp.test UA

      regexp = /MSIE\s[0-9]+\.[0-9]+/
      UA.match regexp

    # ---------------------------------------
    # scroll
    # 
    scroll = (option) ->
      param = $.extend
        'scrollClass' : 'pageTop'
        'duration'    : 'slow'
        'easing'      : 'swing'
        , option

      $scroller = $( if /safari/i.test(UA) then 'body' else 'html' )
      $pageTop = $( 'p.' + param.scrollClass + ' a, a.' + param.scrollClass + ', a[href^="#"' )

      $pageTop.on 'click tap', (event) ->
        event.preventDefault()
        href = $(this).attr 'href'
        $target = $( if (href == '#' || href == '' || !href) then 'html' else href )

        return if !$target.offset()

        $scroller.stop().animate
          'scrollTop' : $target.offset().pageTop,
            'duration'  : param.duration
            'easing'    : param.easing

        return

    # ---------------------------------------
    # opneMenu
    # 
    opneMenu = ->
      $subMenu = $('#js-sub-menu')
      $wrapper = $('#js-contents')

      $('#js-menu-trigger').on 'click tap', (event) ->
        evenr.preventDefault()
        $this = $(this).toggleClass 'js-active'

        if $this.hasClass 'is-active'
          $subMenu.addClass 'is-active'
          $wrapper.addClass 'js-disable'
        else
          $subMenu.removeCLass 'js-active'
          $wrapper.removeCLass 'js-disable'
        return

    return {} =
      "openMenu"  : openMenu
      "isMobile"  : isMobile
      "isIE"      : isIE
      "scroll"    : scroll

  $ ->
    $.rnt.scroll()
    $.rnt.openMenu()
    $.imagePreview '.js-img-input', 'js-img-preview'

    test ||= {}

    return