var runtime = require("./runtime");

var main = function () {
    init(document.getElementById("main"));
};

var init = function (canvas) {
    window.onresize = function (event) {
        fill(canvas);
    };

    fill(canvas);
    runtime(viewport(canvas));
};

var fill = function (canvas) {
    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;
};

var viewport = function (canvas) {
    try {
        var gl = canvas.getContext("experimental-webgl", {"antialias": true}); // .getContext("experimental-webgl");
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;
        return gl;
    } catch (exception) {
        alert("Could not initialize WebGL.");
    }
};

main();