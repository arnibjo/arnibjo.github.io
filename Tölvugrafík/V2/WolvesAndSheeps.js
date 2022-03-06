var canvas;
var gl;

var numVertices  = 36;
var points = [];
var colors = [];
var colors2 = [];
var points3 = [];
var colorsArr = [];

var RED = vec4(1.0, 0.0, 0.0, 1.0);
var DARKGRAY = vec4(0.3, 0.3, 0.3, 1.0);
var WHITE = vec4(1.0, 1.0, 1.0, 1.0);

var spaceRad = 0.6;
var xAxis = 0;
var yAxis = 1;
var zAxis = 2;

var axis = 0;
var theta = [ 0, 0, 0 ];

var movement = false;     // Do we rotate?
var spinX = 0;
var spinY = 0;
var origX;
var origY;

var vBuffer;
var vBuffer2;
var vPosition;
var program;

var matrixLoc;

var moveX = 0;
var moveY = 0;
var moveZ = 0;
var moveDistX = 1.5;
var moveDistY = 1.5;
var moveDistZ = 1.5;

var sheeps = [];
var sheepBuffers = [];
var sheepXtrans = [];
var sheepYtrans = [];
var sheepZtrans = [];
var sheepMoveX = [];
var sheepMoveY = [];
var sheepMoveZ = [];

var wolfs = [];
var wolfBuffers = [];
var wolfXtrans = [];
var wolfYtrans = [];
var wolfZtrans = [];
var wolfMoveX = [];
var wolfMoveY = [];
var wolfMoveZ = [];

var moveDelay = false;
var moveDelay2 = false;

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    colorCube();
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.6, 1.0, 0.6, 1.0 );

    gl.enable(gl.DEPTH_TEST);
    var points2 = colorCube2(WHITE);

    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.DYNAMIC_DRAW );

    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );


    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    sheeps.push(points2);
    colorsArr.push(colors2);
    colors2 = [];

    vBuffer2 = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer2 );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(sheeps[0]), gl.DYNAMIC_DRAW );
    sheepBuffers.push(vBuffer2);

    sheepXtrans[0] = randomLoc();
    sheepYtrans[0] = randomLoc();
    sheepZtrans[0] = randomLoc();
    sheepMoveX[0] = 1.5;
    sheepMoveY[0] = 1.5;
    sheepMoveZ[0] = 1.5;

    var points3 = colorCube2(DARKGRAY);
    wolfs.push(points3);
    colorsArr.push(colors2);

    var wolfBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, wolfBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(wolfs[0]), gl.DYNAMIC_DRAW );
    wolfBuffers.push(wolfBuffer);

    wolfXtrans[0] = randomLoc();
    wolfYtrans[0] = randomLoc();
    wolfZtrans[0] = randomLoc();
    wolfMoveX[0] = 1.5;
    wolfMoveY[0] = 1.5;
    wolfMoveZ[0] = 1.5;

    vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    matrixLoc = gl.getUniformLocation( program, "rotation" );

    var cBuffer2 = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer2 );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors2), gl.STATIC_DRAW );

    var vColor2 = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor2, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor2 );

    //event listeners for mouse
    canvas.addEventListener("mousedown", function(e){
        movement = true;
        origX = e.offsetX;
        origY = e.offsetY;
        e.preventDefault();         // Disable drag and drop
    } );

    canvas.addEventListener("mouseup", function(e){
        movement = false;
    } );

    canvas.addEventListener("mousemove", function(e){
        if(movement) {
    	    spinY = ( spinY + (e.offsetX - origX) ) % 360;
            spinX = ( spinX + (e.offsetY - origY) ) % 360;
            origX = e.offsetX;
            origY = e.offsetY;
        }
    } );

    render();
}

function colorCube()
{
    quad( 1, 0, 3, 2 );
    quad( 2, 3, 7, 6 );
    quad( 3, 0, 4, 7 );
    quad( 6, 5, 1, 2 );
    quad( 4, 5, 6, 7 );
    quad( 5, 4, 0, 1 );
}

function quad(a, b, c, d)
{
    var vertices = [
        vec3( spaceRad, spaceRad,  spaceRad ),
        vec3( spaceRad,  -spaceRad,  spaceRad ),
        vec3(  spaceRad,  -spaceRad,  spaceRad ),
        vec3(  -spaceRad, -spaceRad,  spaceRad ),
        vec3( -spaceRad, -spaceRad, spaceRad ),
        vec3(  -spaceRad,  spaceRad, spaceRad ),
        vec3(  -spaceRad,  spaceRad, spaceRad ),
        vec3(  spaceRad, spaceRad, spaceRad ),

        vec3( spaceRad, spaceRad,  -spaceRad ),
        vec3( spaceRad,  -spaceRad,  -spaceRad ),
        vec3(  spaceRad,  -spaceRad,  -spaceRad ),
        vec3(  -spaceRad, -spaceRad,  -spaceRad ),
        vec3( -spaceRad, -spaceRad, -spaceRad ),
        vec3(  -spaceRad,  spaceRad, -spaceRad ),
        vec3(  -spaceRad,  spaceRad, -spaceRad ),
        vec3(  spaceRad, spaceRad, -spaceRad ),

        vec3( spaceRad, spaceRad,  spaceRad ),
        vec3( spaceRad,  spaceRad,  -spaceRad ),
        vec3(  spaceRad,  -spaceRad,  spaceRad ),
        vec3(  spaceRad, -spaceRad,  -spaceRad ),
        vec3( -spaceRad, -spaceRad, spaceRad ),
        vec3(  -spaceRad,  -spaceRad, -spaceRad ),
        vec3(  -spaceRad,  spaceRad, spaceRad ),
        vec3(  -spaceRad, spaceRad, -spaceRad )
    ];


    var vertexColors = [
        [ 1.0, 0.0, 0.0, 1.0 ],  // red
    ];

    var indices = [ a, b, c, a, c, d ];

    for ( var i = 0; i < vertices.length; ++i ) {
        points.push( vertices[i] );
        colors.push( vertexColors[0]);
    }
}


function colorCube2(color)
{
    var arrayReturn = [];
    var array1 = quad2( 1, 0, 3, 2, color);
    var array2 = quad2( 2, 3, 7, 6, color);
    var array3 = quad2( 3, 0, 4, 7, color);
    var array4 = quad2( 6, 5, 1, 2, color);
    var array5 = quad2( 4, 5, 6, 7, color);
    var array6 = quad2( 5, 4, 0, 1, color);
    arrayReturn = arrayReturn.concat(array1,
      array2, array3, array4, array5, array6);
    return arrayReturn;
}

function quad2(a, b, c, d,color)
{
    var points2 = [];
    var vertices = [
        vec3( -0.5, -0.5,  0.5 ),
        vec3( -0.5,  0.5,  0.5 ),
        vec3(  0.5,  0.5,  0.5 ),
        vec3(  0.5, -0.5,  0.5 ),
        vec3( -0.5, -0.5, -0.5 ),
        vec3( -0.5,  0.5, -0.5 ),
        vec3(  0.5,  0.5, -0.5 ),
        vec3(  0.5, -0.5, -0.5 )
    ];

    var indices = [ a, b, c, a, c, d ];

      for ( var i = 0; i < indices.length; ++i ) {
          points2.push(vertices[indices[i]]);
          colors2.push(color);
      }
    return points2;
}

// Moves a sheep in a random direction.
function moveSheep(i){
  var dir = randDirection();
  switch(dir) {
  case -3:
    sheepZtrans[i] -= sheepMoveZ[i];
    if(sheepZtrans[i] > 11){
      sheepZtrans[i] = -9;
    }

    if(sheepZtrans[i] < -11){
      sheepZtrans[i] = 9;
    }
    break;

  case -2:
    sheepYtrans[i] -= sheepMoveY[i];
    if(sheepYtrans[i] > 11){
      sheepYtrans[i] = -9;
    }

    if(sheepYtrans[i] < -11){
      sheepYtrans[i] = 9;
    }
    break;

  case -1:
    sheepXtrans[i] -= sheepMoveX[i];
    if(sheepXtrans[i] > 11){
      sheepXtrans[i] = -9;
    }

    if(sheepXtrans[i] < -11){
      sheepXtrans[i] = 9;
    }
    break;

  case 1:
    sheepXtrans[i] += sheepMoveX[i];
    if(sheepXtrans[i] > 11){
      sheepXtrans[i] = -9;
    }

    if(sheepXtrans[i] < -11){
      sheepXtrans[i] = 9;
    }
    break;

  case 2:
    sheepYtrans[i] += sheepMoveY[i];
    if(sheepYtrans[i] > 11){
      sheepYtrans[i] = -9;
    }

    if(sheepYtrans[i] < -11){
      sheepYtrans[i] = 9;
    }
    break;

  case 3:
    sheepZtrans[i] += sheepMoveZ[i];
    if(sheepZtrans[i] > 11){
      sheepZtrans[i] = -9;
    }

    if(sheepZtrans[i] < -11){
      sheepZtrans[i] = 9;
    }
    break;
  default:
  }
}

// Moves wolf in a random direction
function moveWolf(i){
  var dir = randDirection();
  switch(dir) {
  case -3:
    wolfZtrans[i] -= wolfMoveZ[i];
    if(wolfZtrans[i] > 11){
      wolfZtrans[i] = -9;
    }

    if(wolfZtrans[i] < -11){
      wolfZtrans[i] = 9;
    }
    break;

  case -2:
    wolfYtrans[i] -= wolfMoveY[i];
    if(wolfYtrans[i] > 11){
      wolfYtrans[i] = -9;
    }

    if(wolfYtrans[i] < -11){
      wolfYtrans[i] = 9;
    }
    break;

  case -1:
    wolfXtrans[i] -= wolfMoveX[i];
    if(wolfXtrans[i] > 11){
      wolfXtrans[i] = -9;
    }

    if(wolfXtrans[i] < -11){
      wolfXtrans[i] = 9;
    }
    break;

  case 1:
    wolfXtrans[i] += wolfMoveX[i];
    if(wolfXtrans[i] > 11){
      wolfXtrans[i] = -9;
    }

    if(wolfXtrans[i] < -11){
      wolfXtrans[i] = 9;
    }
    break;

  case 2:
    wolfYtrans[i] += wolfMoveY[i];
    if(wolfYtrans[i] > 11){
      wolfYtrans[i] = -9;
    }

    if(wolfYtrans[i] < -11){
      wolfYtrans[i] = 9;
    }
    break;

  case 3:
    wolfZtrans[i] += wolfMoveZ[i];
    if(wolfZtrans[i] > 11){
      wolfZtrans[i] = -9;

    }

    if(wolfZtrans[i] < -11){
      wolfZtrans[i] = 9;

    }
    break;
  default:
  }
}

// Makes the wolf chase teh sheep if it is in the same line.
function chaseSheep(i){
    for (var j = 0; j < sheeps.length; j++) {
      if (wolfXtrans[i] == sheepXtrans[j]) {
        if(wolfYtrans[i] == sheepYtrans[j]){
          if (wolfZtrans[i] == sheepZtrans[j]) {
            sheeps[j] = [];
            sheepBuffers[j] = [];
          } else if(wolfZtrans[i] > sheepZtrans[j]){
            wolfZtrans -= wolfMoveZ;
          } else {
            wolfZtrans += wolfMoveZ;
          }
        }
        else {
          moveWolf(i);
        }
      }
      else if (wolfXtrans[i] == sheepXtrans[j]) {
        if(wolfZtrans[i] == sheepZtrans[j]){
          if(wolfYtrans[i] > sheepYtrans[j]){
            wolfYtrans -= wolfMoveY;
          } else {
            wolfYtrans += wolfMoveY;
          }
        }
        else {
          moveWolf(i);
        }
      }
      else if (wolfZtrans[i] == sheepZtrans[j]) {
        if(wolfYtrans[i] == sheepYtrans[j]){
          if(wolfXtrans[i] > sheepXtrans[j]){
            wolfXtrans -= wolfMoveX;
          } else {
            wolfXtrans += wolfMoveX;
          }
        }
        else {
          moveWolf(i);
        }
      }
      else {
        moveWolf(i);
      }
    }
}

// Gives random number for direction
function randDirection(){
  var plusminus = Math.floor(Math.random()*2);
  if(plusminus == 0){
    return Math.ceil(Math.random()*3);
  } else {
    return -Math.ceil(Math.random()*3);
  }
}

// sleep/waiting function
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Makes the sheep run if a wolf is one block away
function sheepRun(j){
  for (var i = 0; i < wolfs.length; i++) {
    if (wolfXtrans[i] == sheepXtrans[j]) {
      if(wolfYtrans[i] == sheepYtrans[j]){
        if (wolfZtrans[i] == sheepZtrans[j]) {
          sheeps[j] = [];
          sheepBuffers[j] = [];
        } else if(wolfZtrans[i]+1.5 == sheepZtrans[j]){
          sheepZtrans -= sheepMoveZ;
        } else if(wolfZtrans[i]-1.5 == sheepZtrans[j]){
          sheepZtrans += sheepMoveZ;
        }
        else moveSheep(i);
      }
      else {
        moveSheep(i);
      }
    }
    else if (wolfXtrans[i] == sheepXtrans[j]) {
      if(wolfZtrans[i] == sheepZtrans[j]){
        if(wolfYtrans[i]+1.5 == sheepYtrans[j]){
          sheepYtrans -= sheepMoveY;
        } else if(wolfYtrans[i]-1.5 == sheepYtrans[j]){
          sheepYtrans += sheepMoveY;
        }
        else {
          moveSheep(i);
        }
      }
      else {
        moveSheep(i);
      }
    }
    else if (wolfZtrans[i] == sheepZtrans[j]) {
      if(wolfYtrans[i] == sheepYtrans[j]){
        if(wolfXtrans[i]+1.5 == sheepXtrans[j]){
          sheepXtrans -= sheepMoveX;
        } else if(wolfXtrans[i]-1.5 == sheepXtrans[j]){
          sheepXtrans += sheepMoveX;
        }
        else {
          moveSheep(i);
        }
      }
      else {
        moveSheep(i);
      }
    }
    else {
      moveSheep(i);
    }
  }
}

// gives a random placement within the world boundaries
function randomLoc(){
  var plusminus = Math.floor(Math.random()*2);
  if(plusminus == 0){
    return (Math.floor(Math.random()*7))*1.5;
  } else {
    return (-Math.floor(Math.random()*7))*1.5;
  }
}

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );


    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

  var mv = mat4();
  mv = mult( mv, rotateX(spinX) );
  mv = mult( mv, rotateY(spinY) );
  gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
  gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );


  gl.uniformMatrix4fv(matrixLoc, false, flatten(mv));
  gl.drawArrays( gl.LINES, 0, 24);

  var mvw = mat4();
    if (!moveDelay2) {
      moveDelay2 = true;

      for (var i = 0; i < wolfs.length; i++) {
        chaseSheep(i);
      }
      sleep(100).then(() => {moveDelay2 = false;});

  }

  for (var i = 0; i < wolfs.length; i++) {
    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colorsArr[1]), gl.STATIC_DRAW );


    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    gl.bindBuffer( gl.ARRAY_BUFFER, wolfBuffers[i]);
    mvt = mult( mv, scalem( 0.05, 0.05, 0.05 ) );
    mvt = mult( mvt, translate( wolfXtrans[i], wolfYtrans[i], wolfZtrans[i]) )
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.uniformMatrix4fv(matrixLoc, false, flatten(mvt));
    gl.drawArrays( gl.TRIANGLES, 0, numVertices );
  }

  var mvt = mat4();
    if (!moveDelay) {
      moveDelay = true;
      for (var i = 0; i < sheeps.length; i++) {
        sheepRun(i);
      }
      sleep(100).then(() => {moveDelay = false;});

  }

  for (var i = 0; i < sheeps.length; i++) {
    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colorsArr[0]), gl.STATIC_DRAW );


    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    gl.bindBuffer( gl.ARRAY_BUFFER, sheepBuffers[i]);
    mvt = mult( mv, scalem( 0.05, 0.05, 0.05 ) );
    mvt = mult( mvt, translate( sheepXtrans[i], sheepYtrans[i], sheepZtrans[i]) )
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.uniformMatrix4fv(matrixLoc, false, flatten(mvt));
    gl.drawArrays( gl.TRIANGLES, 0, numVertices );
  }

    requestAnimFrame( render );
}
