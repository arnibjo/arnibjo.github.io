var canvas;
var gl;
var bufferId;
// N�verandi sta�setning mi�ju ferningsins
var box = vec2( 0.0, 0.0 );

// Stefna (og hra�i) fernings
var dX;
var dY;

// Sv��i� er fr� -maxX til maxX og -maxY til maxY
var maxX = 1.0;
var maxY = 1.0;

// H�lf breidd/h�� ferningsins
var boxRad = 0.05;

// Ferningurinn
var vertices;

window.onload = function init() {

    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.8, 0.8, 0.8, 1.0 );

    // Gefa ferningnum slembistefnu � upphafi
    dX = Math.random()*0.1-0.05;
    dY = Math.random()*0.1-0.05;

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    vertices = [
            vec2(-0.05, -0.05),
            vec2( 0.05, -0.05),
            vec2(  0.05, 0.05),
            vec2( -0.05, 0.05)
        ];

    // Load the data into the GPU
    bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.DYNAMIC_DRAW );

    // Associate out shader variables with our data buffer
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    locBox = gl.getUniformLocation( program, "boxPos" );

    // Me�h�ndlun �rvalykla
    window.addEventListener("keydown", function(e){
        switch( e.keyCode ) {
            case 37: // vinstri ör
                dX -= 0.01;
                break;
            case 38:	// upp �r
                enlarge();

            case 39: // hægri ör
                dX += 0.01;
                break;
            case 40:	// ni�ur �r
                shrink();
                break;
        }
    } );

    render();
}

function shrink(){
  if (boxRad > 0.02) {
    vertices[0][0] += 0.01;
    vertices[0][1] += 0.01;
    vertices[1][0] -= 0.01;
    vertices[1][1] += 0.01;
    vertices[2][0] -= 0.01;
    vertices[2][1] -= 0.01;
    vertices[3][0] += 0.01;
    vertices[3][1] -= 0.01;
    boxRad -= 0.01;
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.DYNAMIC_DRAW );
  }
}

function enlarge(){
  if (boxRad < 0.7) {
    vertices[0][0] -= 0.01;
    vertices[0][1] -= 0.01;
    vertices[1][0] += 0.01;
    vertices[1][1] -= 0.01;
    vertices[2][0] += 0.01;
    vertices[2][1] += 0.01;
    vertices[3][0] -= 0.01;
    vertices[3][1] += 0.01;
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.DYNAMIC_DRAW );
    boxRad += 0.01;
  }
}

function render() {

    // L�t ferninginn skoppa af veggjunum
    if (Math.abs(box[0] + dX) > maxX - boxRad) dX = -dX;
    if (Math.abs(box[1] + dY) > maxY - boxRad) dY = -dY;

    // Uppf�ra sta�setningu
    box[0] += dX;
    box[1] += dY;

    gl.clear( gl.COLOR_BUFFER_BIT );
    //
    gl.uniform2fv( locBox, flatten(box) );

    gl.drawArrays( gl.TRIANGLE_FAN, 0, 4 );

    window.requestAnimFrame(render);
}
