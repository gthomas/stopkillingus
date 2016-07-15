/*!
 *
 *  Web Starter Kit
 *  Copyright 2015 Google Inc. All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *    https://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License
 *
 */
/* eslint-env browser */
(function() {
  'use strict';

  // Check to make sure service workers are supported in the current browser,
  // and that the current page is accessed from a secure origin. Using a
  // service worker from an insecure origin will trigger JS console errors. See
  // http://www.chromium.org/Home/chromium-security/prefer-secure-origins-for-powerful-new-features
  var isLocalhost = Boolean(window.location.hostname === 'localhost' ||
      // [::1] is the IPv6 localhost address.
      window.location.hostname === '[::1]' ||
      // 127.0.0.1/8 is considered localhost for IPv4.
      window.location.hostname.match(
        /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
      )
    );

  if ('serviceWorker' in navigator &&
      (window.location.protocol === 'https:' || isLocalhost)) {
    navigator.serviceWorker.register('service-worker.js')
    .then(function(registration) {
      // updatefound is fired if service-worker.js changes.
      registration.onupdatefound = function() {
        // updatefound is also fired the very first time the SW is installed,
        // and there's no need to prompt for a reload at that point.
        // So check here to see if the page is already controlled,
        // i.e. whether there's an existing service worker.
        if (navigator.serviceWorker.controller) {
          // The updatefound event implies that registration.installing is set:
          // https://slightlyoff.github.io/ServiceWorker/spec/service_worker/index.html#service-worker-container-updatefound-event
          var installingWorker = registration.installing;

          installingWorker.onstatechange = function() {
            switch (installingWorker.state) {
              case 'installed':
                // At this point, the old content will have been purged and the
                // fresh content will have been added to the cache.
                // It's the perfect time to display a "New content is
                // available; please refresh." message in the page's interface.
                break;

              case 'redundant':
                throw new Error('The installing ' +
                                'service worker became redundant.');

              default:
                // Ignore
            }
          };
        }
      };
    }).catch(function(e) {
      console.error('Error during service worker registration:', e);
    });
  }

  // Your custom JavaScript goes here
  var content,
      copsAudio,
      hasPlayed,
      isMobile,
      names,
      shotAudio,
      victim_active;

  names = [
    "philando_castile",
    "alton_sterling",
    "freddie_gray",
    "eric_garner",
    "sandra_bland",
    "brandon_jones",
    "tamir_rice",
    "john_crawford",
    "jonathan_ferrell",
    "sean_bell",
    "amadou_diallo",
    "prince_jones",
    "oscar_grant",
    "eric_harris",
    "walter_scott",
    "laquan_mcdonald",
    "terrence_d._walker",
    "mike_brown",
    "trayvon_martin",
    "akai_gurley",
    "dante_parker",
    "jerame_reid",
    "kimani_gray",
    "phillip_white",
    "yvette_smith",
    "tyisha_miller",
    "rumain_brisbon",
  ];

  content = $("#content");
  copsAudio = new Audio('media/hands_up.mp3');
  hasPlayed = false;
  shotAudio = new Audio('media/shot.mp3');
  victim_active = false;

  for (var i=0; i < names.length; i++) {
    var div_html,
        image_html,
        name,
        name_html;

    name = names[i];
    name_html = '<span id=' + name + ' class="mdl-victim-link" data-image-visible="false">' +
          name.replace(/_/g, ' ') + '</span>';

    image_html = '<div class="victim-image" style="background-image: url(images/victims/' + name + '.jpg)"></div>';

    div_html = '<div class="mdl-grid">' +
          '<div class="mdl-cell mdl-cell--1-col"></div>' +
          '<div class="mdl-cell mdl-cell--8-col">hands up, hands up, then the cops shot ' + name_html + '</div>' +
          '</div>' +
          '<div id="'+name+'_image" class="mdl-grid mdl-image-hidden victim-image-wrap">' +
          '<div class="mdl-cell mdl-cell--4-col"></div>' + image_html + '</div>';

    content.append(div_html)
  }

  isMobile = {
    Android: function() {
      return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function() {
      return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function() {
      return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function() {
      return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function() {
      return navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i);
    },
    any: function() {
      return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
  };

  $('.mdl-victim-link').on('click', function(e) {
    var animateFinish,
        animateScroll,
        delayHandler,
        image,
        newScrollY,
        playCount,
        priorScrollY,
        $target,
        victim_active;

    playCount = 0;
    if (victim_active) {
      return
    }

    image = $("#" + e.currentTarget.id + '_image')
    victim_active = true;

    $target = $(this);
    $(this).addClass('highlight-link');

    priorScrollY = window.scrollY;

    if (($target.offset().top + 350) > window.innerHeight) {
      newScrollY = image.offset().top + 450;
    } else {
      newScrollY = window.offsetTop;
    }

    animateFinish = function() {
      if (image.is(':hidden')) {
        shotAudio.play();
        image.removeClass('mdl-image-hidden')
        setTimeout(delayHandler, 3000);
      }
    }

    animateScroll = function(newScrollTop, animateCallback) {
      $('html, body').animate({
        scrollTop: newScrollTop
      }, 100, 'swing', animateCallback)
    }

    delayHandler = function() {
      if (!isMobile.any()) {
        animateScroll(priorScrollY, function() {});
      }

      image.addClass('mdl-image-hidden')
      $target.removeClass('highlight-link')
      victim_active = false;
    }

    if (!isMobile.any()) {
      animateScroll(newScrollY, animateFinish)
    } else {
      animateFinish();
    }

  })
})();
