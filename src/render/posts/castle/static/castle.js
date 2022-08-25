(function() {
    'use strict';

    var castleViewModel = {
        rooms: ko.observableArray(),
        moves: ko.observable(0),
        restart: function() {
            this.moves = '';
            window.location.href = '/posts/castle/castle.html';
        }
    };

    var $castleWrapper = $('.castle__wrapper'),
        $startButton = $('.castle__start'),
        $menu = $('.castle__menu'),
        $impress = $('.impress');

    $impress.on('impress:stepenter', function(event) {
        castleViewModel.moves(castleViewModel.moves() + 1);
    });

    $startButton.on('click', function() {
        $.ajax({
            url: '//isprogfun.dev/posts/castle/static/rooms.json',
            method: 'GET',
            success: function(data) {
                castleViewModel.rooms(data.rooms);
                ko.applyBindings(castleViewModel);
                $castleWrapper.fadeOut(500, function() {
                    impress().init();
                    $impress.fadeIn();
                    $menu.show();
                });
            },
            error: function(error) {
                console.log(error);
            }
        });
    });
})();
