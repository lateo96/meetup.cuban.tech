/**
 *  @author: Isaac Vega Rodriguez          <isaacvega1996@gmail.com>
 */
'use strict';

///                               *** ANGULAR STUFF ***

var myApp = angular.module('cubantech', ['ngAnimate']);

myApp
  .controller('cubantechController', [
    '$scope',
    '$http',
    '$window',
    function($scope, $http, $window) {

      var ROUTE = 'translations/';

      $scope.COLORS = [
        "#ef5350",
        "#4db6ac",
        "#ff7043",
        "#ffee58",
        "#4fc3f7",
        "#4caf50",
        "#9575cd"
      ];

      $scope.STARS_DESCRIPTORS = [
        'fa fa-star-o',
        'fa fa-star-half-o',
        'fa fa-star'
      ];

      $scope.eventGroups = [];

      $scope.location = $window.location;

      /// Lenguaje de preferencia
      $scope.preferedLanguage = 'en';

      /// Lenguaje seleccionado actualmente (inicialmente el preferido)
      $scope.lang             = $scope.preferedLanguage;

      /// Año actual
      $scope.thisYear         = (new Date()).getFullYear();

      /// Lista con los lenguajes cargados
      $scope.loadedLanguages  = {};

      /// Escritura correcta de cada lenguaje
      $scope.langMap = {
        en : "English",
        gb : "English",
        es : "Español",
        pt : "Português",
        fr : "Français"
      };

      /// Lista de lenguajes disponibles
      $scope.langList = [ "en", "es" ];

      $scope.visual =  {
        marketing : {
          height : "350px",
          display : "grid"
        }
      };

      $scope.$watch('lang', function() {

        //console.log($scope.lang);

        if ( $scope.loadedLanguages.hasOwnProperty($scope.lang) === true ) {

          $scope.updateLanguage($scope.lang);

        } else {

          if ( $scope.langList.indexOf($scope.lang) > -1 ) {
            $http
              .get(ROUTE + $scope.lang + '.json')
              .success(function(data) {

                //console.log(data);

                $scope.loadedLanguages[ $scope.lang ] = data;

                $scope.updateLanguage($scope.lang);

              })
              .error(function() {
                $scope.lang = $scope.preferedLanguage;
              });
          } else {
            $scope.lang = $scope.preferedLanguage;
            $scope.updateLanguage($scope.lang);
          }

        }

      });//*/

      $scope.$watch('eventGroups', function() {

        if ( $scope.eventGroups.length > 0 ) {
          $scope.selectedGroup = $scope.eventGroups[0];
          $scope.selectedEvent = 0;
        }

      });

      $scope.useLanguage = function useLanguage(lng) {

        $scope.lang = lng;

      };

      $scope.nodeTemplate = function nodeTemplate(data) {

        /**

          @params: data

          data:
            - name          -->      Nombre de la persona
            - title         -->      Cargo
            - avatar        -->      Avatar
            - email         -->      Correo electronico
            - twitter       -->      Cuenta de twitter
            - linkedin      -->      Cuenta de linkedin

        //*/

        data.avatar = data.avatar || "img/anonimUser.png";
        data.email = data.email || '';
        data.twitter = data.twitter || '';
        data.linkedin = data.linkedin || '';
        data.description = data.description || 'no description available';

        return `
          <div class="orgComponent col-xs-1">
            <div class="row">
              <div class="col-xs-12 featurette-container">
                <img src="${data.avatar}" value="${data.avatar}" class="orgAvatar" data-toggle="modal" data-target="#myModal">
              </div>
              <div class="col-xs-12 orgName" value="${data.name}">
                <span>${data.name}</span>
              </div>
              <div class="col-xs-12 orgCharge" value="${data.title}">
                <span>${data.title}</span>
              </div>
              <div class="col-xs-12 orgContacts">
                <ul class="col-xs-12">
                  <li class="orgIcon fa fa-envelope col-xs-4">
                    <span class="orgIconDescriptor" value="${data.email}"></span>
                  </li>
                  <li class="orgIcon fa fa-twitter col-xs-4">
                    <span class="orgIconDescriptor" value="${data.twitter}"></span>
                  </li>
                  <li class="orgIcon fa fa-linkedin col-xs-4">
                    <span class="orgIconDescriptor" value="${data.linkedin}"></span>
                  </li>
                </ul>
              </div>
              <div class="hidden orgDescription">
                ${data.description}
              </div>
            </div>
          </div>`;
      };

      $scope.contactTemplate = function contactTemplate(data) {

        return `
          <li class="orgIcon fa fa-${data.type}">
            <span class="modal-usercontact">${data.value}</span>
          </li>
        `;

      };

      $scope.updateLanguage = function updateLanguage(lng) {

        var dict = $scope.loadedLanguages[lng];

        for (var i in dict) {

          $scope[ i.toString() ] = dict[i];

        }

        var org = $('#organigram');

        if (org.length > 0) {

          org.html('');

          var xxx = org.orgchart({
            data         : $scope.organigram,
            nodeTemplate : $scope.nodeTemplate
          });

          $('.orgAvatar').click(function(e) {

            var __root = e.target.parentElement.parentElement;

            var avatar   = $(__root).find('.orgAvatar').attr('value');
            var name     = $(__root).find('.orgName').attr('value');
            var charge   = $(__root).find('.orgCharge').attr('value');
            var desc     = $(__root).find('.orgDescription').html().trim();
            var email    = $(__root)
                              .find('.orgIcon.fa-envelope')
                              .find('.orgIconDescriptor')
                              .attr('value');

            var twitter  = $(__root)
                              .find('.orgIcon.fa-twitter')
                              .find('.orgIconDescriptor')
                              .attr('value');

            var linkedin = $(__root)
                              .find('.orgIcon.fa-linkedin')
                              .find('.orgIconDescriptor')
                              .attr('value');

            $scope.$apply(function() {

              $scope.userSelected = {
                name        : name,
                charge      : charge,
                avatar      : avatar,
                description : desc,
                contacts    : {
                  envelope : email,
                  twitter  : twitter || "",
                  linkedin : linkedin || ""
                }
              };

            });

          });

        }

      };

      $scope.createDataset = function createDataset(event) {

        var data1 = event.data;
        var data2 = data1.data;
        var datasets = data2.datasets;

        var maxCant = 0;

        for (var i = 0; i < datasets.length; i += 1) {

          maxCant = Math.max(maxCant, datasets[i].data.length);

          if ( ['pie'].indexOf(data1.type) > -1 ) {
            datasets[i].backgroundColor = $scope.COLORS;
          } else {
            datasets[i].borderColor = $scope.COLORS[0];
            datasets[i].backgroundColor = $scope.COLORS[0] + '33';
          }

        }

        if ( data2.hasOwnProperty('labels') === false ) {
          data2.labels = ' '.repeat(maxCant - 1).split(' ');
        }

        var cnv = $window.document.querySelectorAll('canvas');

        if ( cnv != null ) {
          for (var i = 0; i < cnv.length; i += 1) {

            //console.log(cnv[i].id, event.title);

            if ( cnv[i].id === event.title ) {
              event.chart = new Chart(cnv[i].getContext('2d'), event.data);
              break;
            }

          }

        }

      };

      $scope.getLevel = function getLevel(val, ini, fin, divs) {

        return ~~( ((val - ini) * divs / (fin - ini) ) );

      };

      $scope.processEvent = function processEvent(event) {

        //console.log(event);

        var part = Number(event.mean);
        var total = Number(event.total);
        var divs = 5;
        var factor = total / divs;

        var len = $scope.STARS_DESCRIPTORS.length;

        var lv = $scope.getLevel(part, 0, total, divs);

        event.rating = ' '.repeat(divs).split(' ');
        event.rating.pop();

        for (var i = 0; i < lv; i += 1) {
          event.rating[i] = $scope.STARS_DESCRIPTORS[ len - 1 ];
        }

        //console.log(lv);

        var lv1 = $scope.getLevel(part, lv * factor, (lv + 1) * factor, len);

        //console.log(lv1);

        event.rating[ lv ] = $scope.STARS_DESCRIPTORS[ lv1 ];

        for (var i = lv + 1; i < divs; i += 1) {
          event.rating[i] = $scope.STARS_DESCRIPTORS[ 0 ];
        }

        event.commentList = event.commentList || [];

        var cant = event.commentList.length;

        event.comments = cant + ' ' + $scope.general[( cant != 1 ) ? 'comments' : 'comment' ] + ' ';

        event.rated = [];

        for (var i = 0; i < divs; i += 1) {
          event.rated.push($scope.STARS_DESCRIPTORS[0]);
        }

        var len1 = event.commentList.length;

        event.counter = [
          len1,
          $scope.general[ len1 == 1 ? 'person' : 'people' ],
          $scope.general[ len1 == 1 ? 'hasS' : 'hasP' ],
          $scope.general.commentedThisMeetup
        ].join(' ');

      };

      $scope.rateEvent = function rateEvent(event, id) {

        var len = $scope.STARS_DESCRIPTORS.length;

        event.userRating = id;

        for (var i = 0; i < event.rated.length; i += 1) {
          if ( i < id ) {
            event.rated[i] = $scope.STARS_DESCRIPTORS[ len - 1 ];
          } else {
            event.rated[i] = $scope.STARS_DESCRIPTORS[ 0 ];
          }
        }

      };

      $scope.processNavItem = function processNavItem(item) {

        if ( !( item.regexp instanceof RegExp) ) {
          item.regexp = new RegExp('^/' + item.regexp + '(\\.(htm|html|asp|php|jsp))?(#)?$', 'i');
        }

      };

    }
  ]);//*/

myApp.directive('carousel', function() {

  return {

    template : [
      '<div id="{{model.id}}" class="carousel-mini">',
        '<div class="carousel-image-container">',
          '<img class="carousel-image">',
        '</div>',
        '<a class="left carousel-control" data-slide="prev">',
          '<span class="icon-prev icon-chevron-left" aria-hidden="true"></span>',
          '<span class="sr-only">Previous</span>',
        '</a>',
        '<a class="right carousel-control" data-slide="next">',
          '<span class="icon-next icon-chevron-right" aria-hidden="true"></span>',
          '<span class="sr-only">Next</span>',
        '</a>',
      '</div>',
      '<div class="carousel-description">',
        'description goes here',
      '</div>'
    ].join(' '),
    replace : false,
    restrict : "E",
    scope : {
      model : "="
    },
    link : function(scope, element, attrs, ctrl, transcludeFn) {

      //console.log(arguments);

      var slides = scope.model.slides;

      var elem = element[0];
      var image = elem.querySelector('.carousel-image');
      var description = elem.querySelector('.carousel-description');
      var controls = elem.querySelectorAll('.carousel-control');

      if ( image === null || description === null) {
        return;
      }

      var len = slides.length;
      var id = 0;

      var itv;

      var INTERVAL = 6000, TIMEOUT = 500;

      image.src = slides[id].imageUrl;
      description.innerHTML = slides[id].content;

      var createInterval = function createInterval() {

        image.classList.add('not-visible');
        description.classList.add('not-visible');

        setTimeout(function() {
          image.src = slides[id].imageUrl;
          description.innerHTML = slides[id].content;
          image.classList.remove('not-visible');
          description.classList.remove('not-visible');
        }, TIMEOUT);

        clearInterval(itv);

        itv = setInterval(function() {

          image.classList.add('not-visible');
          description.classList.add('not-visible');

          setTimeout(function() {
            id = (id + 1) % len;
            image.src = slides[id].imageUrl;
            description.innerHTML = slides[id].content;
            image.classList.remove('not-visible');
            description.classList.remove('not-visible');
          }, TIMEOUT);

        }, INTERVAL);

      };

      createInterval();

      if ( controls != null ) {

        for (var i = 0; i < controls.length; i += 1) {

          controls[i].addEventListener('click', function(e) {

            var res = this.getAttribute('data-slide');

            if ( res === null ) {

              return;

            }

            clearInterval(itv);

            if ( res === 'prev' ) {
              id = ( id - 1 + len ) % len;
              createInterval();
            } else if ( res === 'next' ) {
              id = (id + 1) % len;
              createInterval();
            }

            //createInterval();

          }, false);

        }

      }

    }
  };

});

myApp.directive('gallery', function() {

  return {

    template : [
      '<div class="gallery">',
        '<div class="gallery-header" ng-transclude>',
        '</div>',
        '<hr class="hr-little black">',
        '<div class="row gallery-list">',
          '<div class="gallery-btn-container pull-left">',
            '<span class="icon-prev icon-chevron-left" aria-hidden="true"></span>',
          '</div>',
          '<div ng-repeat="sp in secondList" class="visible-sm visible-md visible-lg gallery-item">',
            '<img class="gallery-image" src="{{sp}}" alt="">',
          '</div>',
          '<div class="gallery-btn-container pull-right">',
            '<span class="icon-next icon-chevron-right" aria-hidden="true"></span>',
          '</div>',
        '</div>',
      '</div>'
    ].join(' '),
    replace : true,
    transclude : true,
    restrict : "E",
    scope : {
      list : "="
    },
    link : function(scope, element, attrs, ctrl, transcludeFn) {

      // console.log(element);

      var elem = element[0];
      var carets = elem.querySelectorAll('.gallery-btn-container');

      var listCopy = [];
      scope.secondList = [];

      var ini = 0, fin = 3, total;

      carets[0].addEventListener('click', function() {

        ini = (ini - 1 + total) % total;
        fin = (fin - 1 + total) % total;

        scope.$apply(function() {
          scope.secondList.pop();
          scope.secondList.unshift(listCopy[ini]);
        });

      }, false);

      carets[1].addEventListener('click', function() {

        ini = (ini + 1) % total;
        fin = (fin + 1) % total;

        scope.$apply(function() {
          scope.secondList.shift();
          scope.secondList.push(listCopy[fin]);
        });

      }, false);

      scope.$watch('list', function() {

        if ( Array.isArray(scope.list) === true) {

          listCopy = [].concat(scope.list);

          scope.secondList = listCopy.slice(0, 4);

          ini = 0;
          fin = 3;
          total = listCopy.length;

          if (listCopy.length <= 4) {
            for (var i = 0; i < carets.length; i += 1 ) {
              carets[i].style.opacity = 0;
            }
          }//*/

        }

      });

    }
  };

});

myApp.directive('event', function() {

  return {

    template : [
      `
    <div class="event">
      <div class="panel panel-default event-card">
        <div class="panel-body">
          <div class="row event-header">
            <h2 class="col-xs-7 event-title" ng-bind="event.title"></h2>
            <div class="rating col-xs-5 pull-right">
              <span class="icon {{event.rating[0]}}"></span>
              <span class="icon {{event.rating[1]}}"></span>
              <span class="icon {{event.rating[2]}}"></span>
              <span class="icon {{event.rating[3]}}"></span>
              <span class="icon {{event.rating[4]}}"></span>
            </div>
          </div>
          <div class="separator"></div>
          <div class="row">
            <div class="col-xs-12 event-agenda">
              <div ng-repeat="(index, descriptor) in event.descriptors" class="event-descriptor">
                <div ng-show="index != 0" class="event-descriptor"> | </div>
                <div class="event-descriptor">
                  <span class="icon fa fa-{{descriptor.type}}"></span>
                  <span class="event-descriptor-content" ng-bind="descriptor.content"></span>
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="event-content col-xs-12" ng-bind="event.content"></div>
          </div>
        </div>
        <div class="separator"></div>
        <div class="row">
          <div class="col-xs-12">
            <h3 class="text-center"> Event program: </h3>
            <ul class="col-xs-12">
              <li class="event-program col-xs-6" ng-repeat="program in event.program">
                <div class="col-xs-12">
                  <span class="col-xs-12 fa fa-bullhorn" ng-bind="program.title"></span>
                  <span class="col-xs-12 fa fa-clock-o" ng-bind="program.time"></span>
                  <span class="col-xs-12 fa fa-user-o" ng-bind="program.name"></span>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div class="separator"></div>
        <div class="row rateUs">
          <div class="text-right col-xs-9" ng-bind="$parent.general.rateEvent"></div>
          <div class="rating col-xs-3">
            <span class="icon pointer {{event.rated[0]}}" ng-click="$parent.rateEvent(event, 1)"></span>
            <span class="icon pointer {{event.rated[1]}}" ng-click="$parent.rateEvent(event, 2)"></span>
            <span class="icon pointer {{event.rated[2]}}" ng-click="$parent.rateEvent(event, 3)"></span>
            <span class="icon pointer {{event.rated[3]}}" ng-click="$parent.rateEvent(event, 4)"></span>
            <span class="icon pointer {{event.rated[4]}}" ng-click="$parent.rateEvent(event, 5)"></span>
          </div>
        </div>
      </div>
      <div class="event comment-long" ng-include="'comment.htm'"></div>
      <div class="separator"></div>
      <div class="panel panel-default">
        <div class="panel-body">
          <h3 class="text-left">Leave your comment:</h3>
          <form action="" class="col-xs-12" role="form">
            <div class="form-group">
              <input type="text" class="col-xs-12 form-control" placeholder="Name..." required autofocus>
            </div>
            <div class="form-group">
              <input type="email" class="col-xs-12 form-control" placeholder="Email..." required>
            </div>
            <div class="form-group">
              <input type="text" class="col-xs-12 form-control" placeholder="Web...">
            </div>
            <div class="form-group">
              <textarea class="form-control" id="" cols="30" rows="10" required></textarea>
            </div>
            <div class="event-detail">
              <input type="submit" class="btn pull-left" value="{{$parent.general.publishComment}}"/>
            </div>
          </form>
        </div>
      </div>
    </div>
      `
    ].join(' '),
    replace : true,
    restrict : "E",
    scope : {
      group : "@",
      model : "@"
    },
    link : function(scope, element, attrs, ctrl, transcludeFn) {

      //console.log(scope.$parent);

      scope.$parent.$watch('eventGroups', function() {

        if ( Array.isArray(scope.$parent.eventGroups) ) {

          scope.group = ~~scope.group;
          scope.model = ~~scope.model;

          //console.log(scope.$parent.eventGroups);

          if ( scope.group < scope.$parent.eventGroups.length ) {
            if ( scope.model < scope.$parent.eventGroups[ scope.group ].eventList.length ) {

              scope.event = scope.$parent.eventGroups[ scope.group ].eventList[ scope.model ];

              scope.$parent.processEvent(scope.event);

            }
          }

        }

      });

    }
  };

});

///                    *** NON-ANGULAR STUFF ***

(function() {
  Chart.defaults.global.legend.labels.boxWidth = 12;
})();