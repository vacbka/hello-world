/*!
 * Javascript Cookie v1.5.1
 * https://github.com/js-cookie/js-cookie
 *
 * Copyright 2006, 2014 Klaus Hartl
 * Released under the MIT license
 */
(function (factory) {
    var jQuery;
    if (typeof define === 'function' && define.amd) {
        // AMD (Register as an anonymous module)
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // Node/CommonJS
        try {
            jQuery = require('jquery');
        } catch(e) {}
        module.exports = factory(jQuery);
    } else {
        // Browser globals
        var _OldCookies = window.Cookies;
        var api = window.Cookies = factory(window.jQuery);
        api.noConflict = function() {
            window.Cookies = _OldCookies;
            return api;
        };
    }
}(function ($) {

    var pluses = /\+/g;

    function encode(s) {
        return api.raw ? s : encodeURIComponent(s);
    }

    function decode(s) {
        return api.raw ? s : decodeURIComponent(s);
    }

    function stringifyCookieValue(value) {
        return encode(api.json ? JSON.stringify(value) : String(value));
    }

    function parseCookieValue(s) {
        if (s.indexOf('"') === 0) {
            // This is a quoted cookie as according to RFC2068, unescape...
            s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
        }

        try {
            // Replace server-side written pluses with spaces.
            // If we can't decode the cookie, ignore it, it's unusable.
            // If we can't parse the cookie, ignore it, it's unusable.
            s = decodeURIComponent(s.replace(pluses, ' '));
            return api.json ? JSON.parse(s) : s;
        } catch(e) {}
    }

    function read(s, converter) {
        var value = api.raw ? s : parseCookieValue(s);
        return isFunction(converter) ? converter(value) : value;
    }

    function extend() {
        var key, options;
        var i = 0;
        var result = {};
        for (; i < arguments.length; i++) {
            options = arguments[ i ];
            for (key in options) {
                result[key] = options[key];
            }
        }
        return result;
    }

    function isFunction(obj) {
        return Object.prototype.toString.call(obj) === '[object Function]';
    }

    var api = function (key, value, options) {

        // Write

        if (arguments.length > 1 && !isFunction(value)) {
            options = extend(api.defaults, options);

            if (typeof options.expires === 'number') {
                var days = options.expires, t = options.expires = new Date();
                t.setMilliseconds(t.getMilliseconds() + days * 864e+5);
            }

            return (document.cookie = [
                encode(key), '=', stringifyCookieValue(value),
                options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
                options.path    ? '; path=' + options.path : '',
                options.domain  ? '; domain=' + options.domain : '',
                options.secure  ? '; secure' : ''
            ].join(''));
        }

        // Read

        var result = key ? undefined : {},
            // To prevent the for loop in the first place assign an empty array
            // in case there are no cookies at all. Also prevents odd result when
            // calling "get()".
            cookies = document.cookie ? document.cookie.split('; ') : [],
            i = 0,
            l = cookies.length;

        for (; i < l; i++) {
            var parts = cookies[i].split('='),
                name = decode(parts.shift()),
                cookie = parts.join('=');

            if (key === name) {
                // If second argument (value) is a function it's a converter...
                result = read(cookie, value);
                break;
            }

            // Prevent storing a cookie that we couldn't decode.
            if (!key && (cookie = read(cookie)) !== undefined) {
                result[name] = cookie;
            }
        }

        return result;
    };

    api.get = api.set = api;
    api.defaults = {};

    api.remove = function (key, options) {
        // Must not alter options, thus extending a fresh object...
        api(key, '', extend(options, { expires: -1 }));
        return !api(key);
    };

    if ( $ ) {
        $.cookie = api;
        $.removeCookie = api.remove;
    }

    return api;
}));
///////////////////////////////////////////////////////////////////////////////
var linksArray = {
};

$(document).ready(function () {
  setLinksArray();

  for (var i = 1; i <= countProperties(linksArray); i++) {
    $("#gallery").append("<div class='gallery-section' id='image"+i+"'></div>");
    widerOrHigher(linksArray["link" + i], $("#image" + i));
    $(("#image" + i)).css("background", "url(" + linksArray[("link" + i)] + ") no-repeat");

    $("#carousel-main").append("<div><img src=\"" + linksArray[("link" + i)] + "\"></div>");
  }
  $(".gallery-section").append("<div class=\"section-shadow section-shadow-hover\"></div>");
  createCarousel($('#carousel-main'));
  $(".gallery-section").click(function () {
    $('#carousel-main').fadeIn();
    var id = $(this).attr("id");
    id = Number(id.substring(5));
    console.log(id);
    $('#carousel-main').slick("slickGoTo", id - 1, true);
    mainBlockOpacityOn();
  });
});


function widerOrHigher(link, image) {
  image.append("<div class=\"section-preloader\"><img src=\"https://fridayrss.herokuapp.com/preloader.gif\"></div>");
  var src = link;
  var img = document.createElement("img");
  img.src = link;
  img.onload = function () {
    if (img.width >= img.height) {
      image.addClass("wider");
    } else {
      image.addClass("higher");
    }

    image.find(".section-preloader").remove();
  };
}

function createCarousel(carouselBlock) {
  carouselBlock.slick({
    infinite: true,
    speed: 150,
    respondTo: "slider",
    arrows: false
  });
  carouselBlock.on('init reInit afterChange', function (event, slick, currentSlide, nextSlide) {
    var $status = $('#photo-index');
    var i = (currentSlide ? currentSlide : 0) + 1;
    $status.text(i + '/' + slick.slideCount);
  });
  //carouselBlock.fadeOut();
  carouselBlock.append("<button id=\"carousel-button-prev\">←</button>");
  carouselBlock.append("<button id=\"carousel-button-next\">→</button>");
  carouselBlock.append("<button id=\"carousel-button-close\">×</button>");
  carouselBlock.append("<div class=\"blocker1\"></div>");
  carouselBlock.append("<div class=\"blocker2\"><div style=\"text-align:center; color:#666666;\" id=\"photo-index\"></div></div>");
  $("#carousel-button-prev").on("click", function () {
    carouselBlock.slick("slickPrev");
  });
  $("#carousel-button-next").on("click", function () {
    carouselBlock.slick("slickNext");
  });

$("#carousel-main").bind('click', function (e) {
  if (!$(e.target).is('#carousel-button-prev, #carousel-button-next, #photo-index, img, .slick-dots, li, .slick-dots li button')) {
    carouselBlock.fadeOut();
    mainBlockOpacityOff();
  }

});

$(document).keyup(function(e) {
  if (e.keyCode == 27) {
    carouselBlock.fadeOut();
    mainBlockOpacityOff();
  } else if (e.keyCode == 37) { //left
    carouselBlock.slick("slickPrev");
  } else if (e.keyCode == 39) { //right
    carouselBlock.slick("slickNext");
  }
});
}

function mainBlockOpacityOn() {
  $("#main-section").fadeTo(500, 0.15);
  $(".section-shadow").removeClass("section-shadow-hover");
}

function mainBlockOpacityOff() {
  $("#main-section").fadeTo(500, 1);
  $(".section-shadow").addClass("section-shadow-hover");
}

function setLinksArray(){
  console.log($("#link-list li").size());
  for (var i = 1; i <= $("#link-list li").size(); i++) {
    linksArray["link"+i] = $("#link-list li:nth-child("+i+")").html();
  }
  console.log(linksArray);
}

function countProperties(obj) {
  var count = 0;
  for(var prop in obj) {
    if(obj.hasOwnProperty(prop))
    ++count;
  }
  return count;
}

if (Cookies.get("warning")) {
  $("#gallery").css("display", "block");
}else{
    $("#cookie-warning").css("display", "block");
}

$("#age-checker-yes").click(function(){
  $("#cookie-warning").fadeOut();
    $("#gallery").css("display", "block");
  Cookies.set("warning", true, { expires: 30 });
});

