function Scene(gl) {
    this.gl = gl;

    this.defineShapes();
    this.installShaders();

    this.gl.viewport(0, 0, this.gl.viewportWidth, this.gl.viewportHeight);
}

Scene.prototype.draw = function () {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    for (var shape in this.shapes) {
        var vertexBuffer = this.gl.createBuffer();
        var faceBuffer = this.gl.createBuffer();

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertexBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.shapes[shape].vertices), this.gl.STATIC_DRAW);

        this.gl.vertexAttribPointer(this.position, 2, this.gl.FLOAT, false, 4 * (2 + 3), 0);
        this.gl.vertexAttribPointer(this.color, 3, this.gl.FLOAT, false, 4 * (2 + 3), 2 * 4);

        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, faceBuffer);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.shapes[shape].faces), this.gl.STATIC_DRAW);

        this.gl.drawElements(this.gl.TRIANGLES, 3, this.gl.UNSIGNED_SHORT, 0);
    }

    this.gl.flush();
};

Scene.prototype.animate = function () {
    this.shapes.triangle.vertices[0] += 0.0001;
};

Scene.prototype.defineShapes = function () {
    this.shapes = {
        "triangle": {
            "vertices": [
                -1, -1, //first summit -> bottom left of the viewport
                0, 0, 1,
                1, -1, //bottom right of the viewport
                1, 1, 0,
                1, 1,  //top right of the viewport
                1, 0, 0
            ],
            "faces": [0, 1, 2]
        }
    };
};

Scene.prototype.installShaders = function () {
    /*jshint multistr: true */
    var vertextShaderSource = "\n\
attribute vec2 position; //the position of the point\n\
attribute vec3 color;  //the color of the point\n\
\n\
varying vec3 vColor;\n\
void main(void) { //pre-built function\n\
gl_Position = vec4(position, 0., 1.); //0. is the z, and 1 is w\n\
vColor=color;\n\
}";
    var fragementShaderSource = "\n\
precision mediump float;\n\
\n\
\n\
\n\
varying vec3 vColor;\n\
void main(void) {\n\
gl_FragColor = vec4(vColor, 1.);\n\
}";

    var vertexShader = this.compileShader(vertextShaderSource, this.gl.VERTEX_SHADER);
    var fragmentShader = this.compileShader(fragementShaderSource, this.gl.FRAGMENT_SHADER);

    var shaderProgram = this.gl.createProgram();
    this.gl.attachShader(shaderProgram, vertexShader);
    this.gl.attachShader(shaderProgram, fragmentShader);

    this.gl.linkProgram(shaderProgram);

    this.color = this.gl.getAttribLocation(shaderProgram, "color");
    this.position = this.gl.getAttribLocation(shaderProgram, "position");

    this.gl.enableVertexAttribArray(this.color);
    this.gl.enableVertexAttribArray(this.position);

    this.gl.useProgram(shaderProgram);
};

Scene.prototype.compileShader = function (source, type) {
    var shader = this.gl.createShader(type);

    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);

    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
        throw new Error("Failed to compile shader.");
    }

    return shader;
};

module.exports = Scene;