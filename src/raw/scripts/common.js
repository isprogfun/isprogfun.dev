// For Safari 6.0
window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame;

var eventPreventer = function (e) {
    e.stopPropagation();
    e.preventDefault();
};
