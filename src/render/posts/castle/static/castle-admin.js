(function() {
    'use strict';

    var $form = $('.j-form');

    var castleViewModel = {
        rooms: ko.observableArray(),
        currentRoom: ko.observable(0),
        setCurrentRoom: function(room, event) {
            var $item = $(event.currentTarget);

            $('.castle-admin-sidebar__item').removeClass('castle-admin-sidebar__item_current');
            $item.addClass('castle-admin-sidebar__item_current');
            $form.find('input, textarea').val('');
            Object.keys(room).forEach(function(index) {
                $form.find('[name=' + index + ']').val(room[index]);
            });
            castleViewModel.currentRoom(room._id);
        },
        setEmptyRoom: function() {
            $form.find('input, textarea').val('');
            castleViewModel.currentRoom(0);
        },
        updateRoom: function() {
            var self = this;

            $.ajax({
                url: '//isprogfun.ru:4730/rooms/update',
                data: $form.serialize(),
                method: 'POST',
                success: function(data) {
                    if (data.status === 'success') {
                        castleViewModel.rooms().forEach(function(item, index) {
                            if (item._id === castleViewModel.currentRoom()) {
                                console.log(index);
                                castleViewModel.rooms.replace(castleViewModel.rooms()[index], data.data.room);
                                castleViewModel.setEmptyRoom();
                            }
                        });
                    } else {
                        console.log(data.message);
                    }
                },
                error: function(error) {
                    console.log(error);
                }
            });
        },
        addRoom: function() {
            $.ajax({
                url: '//isprogfun.ru:4730/rooms/add',
                data: $form.serialize(),
                method: 'POST',
                success: function(data) {
                    if (data.status === 'success') {
                        castleViewModel.rooms.push(data.data.room);
                        castleViewModel.setEmptyRoom();
                    } else {
                        console.log(data.message);
                    }
                },
                error: function(error) {
                    console.log(error);
                }
            });
        },
        deleteRoom: function(room) {
            $.ajax({
                url: '//isprogfun.ru:4730/rooms/delete',
                data: {id: room._id},
                method: 'POST',
                success: function(data) {
                    if (data.status === 'success') {
                        castleViewModel.rooms.remove(room);
                        castleViewModel.setEmptyRoom();
                    } else {
                        console.log(data.message);
                    }
                },
                error: function(error) {
                    console.log(error);
                }
            });
        }
    };

    // Get all rooms on start
    $.ajax({
        url: '//isprogfun.ru:4730/rooms/get',
        method: 'GET',
        success: function(data) {
            if (data.status === 'success') {
                data.data.rooms.sort(function(a, b) {
                    return a.simpleID - b.simpleID;
                });
                castleViewModel.rooms(data.data.rooms);
                ko.applyBindings(castleViewModel);
            } else {
                console.log(data.message);
            }
        },
        error: function(error) {
            console.error(error);
        }
    });
})();
