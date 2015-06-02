var Scene = require("./scene");

var main = function (gl) {
    var scene = new Scene(gl);

    window.requestAnimationFrame(function () {
        draw(scene);
    });
};

var draw = function (scene) {
    scene.animate();
    scene.draw();

    window.requestAnimationFrame(function () {
        draw(scene);
    });
};

module.exports = main;