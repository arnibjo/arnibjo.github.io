var canvas;
var gl;
var vertices;
var platform;
var monster;
var jumping;
var bufferIDVertices;
var bufferIDPlatform;
var bufferIDMonster;
var bufferIDCoin;
var colorA = vec4(0.7, 1.0, 0.1, 1.0);
var colorB = vec4(0.0, 0.0, 1.0, 1.0);
var colorC = vec4(1.0, 1.0, 0.0, 1.0);
var colorD = vec4(1.0, 0.0, 0.0, 1.0);
var coin;
var jumpHeight = 16;
var leftJump = false;
var rightJump = false;
var jumpingVelocity = 0.060;
var fallingVelocity = 0;
var score = 0;
var jumpRight = false;
var jumpLeft = false;
var gameOver = false;
var monsterDir = 0.005;
window.onload = function init() {

    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.4, 0.7, 1.0, 1.0 );

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    vertices = [
        vec2(  0.0,  0.0 ),
        vec2(  0.0,  0.1 ),
        vec2(  0.06,  0.1 ),
        vec2(  0.0,  0.0 ),
        vec2(  0.06, 0.1),
        vec2(  0.06, 0.0),
    ];

    monster = [
        vec2(  -1.0,  0.0 ),
        vec2(  -1.0,  0.11 ),
        vec2(  -0.9,  0.11 ),
        vec2(  -1.0,  0.0 ),
        vec2(  -0.9, 0.11),
        vec2(  -0.9, 0.0),
    ];

    platform = [
      vec2(  -1,  -1 ),
      vec2(  -1,  0.0 ),
      vec2(  1,  0.0 ),
      vec2(  -1,  -1 ),
      vec2(  1,  0.0 ),
      vec2(  1,  -1 ),

      vec2(  -0.2,  0.0 ),
      vec2(  -0.2,  0.1 ),
      vec2(  -0.54,  0.1 ),
      vec2(  -0.2,  0.0 ),
      vec2(  -0.54, 0.1),
      vec2(  -0.54, 0.0)
    ];

    // Event listener for keyboard
    window.addEventListener("keydown", function(e){
        var xmove;
        switch( e.keyCode ) {
            case 37:	// vinstri
                xmove = -0.04;
                if(!jumping){
                  left();
                  jumpRight = false;
                  jumpLeft = true;
                  sleep(1000).then(() => { jumpLeft = false; });
                }
                break;
            case 38: // up - hoppa
                xmove = 0.0;
                if(jumpRight){
                  rightJump = true;
                }
                else if(jumpLeft){
                  leftJump = true;
                }

                if(!jumping){
                  jump(jumpHeight);
                }
                break;
            case 39:	// hægri
                xmove = 0.04;
                if(!jumping){
                  right();
                  jumpLeft = false;
                  jumpRight = true;
                  sleep(1000).then(() => { jumpRight = false; });
                }
                break;
            default:
                xmove = 0.0;
        }
    } );
    newCoin();

    bufferIDPlatform = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferIDPlatform );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(platform), gl.DYNAMIC_DRAW );

    bufferIDMonster = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferIDMonster );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(monster), gl.DYNAMIC_DRAW );

    bufferIDVertices = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferIDVertices );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.DYNAMIC_DRAW );


    // Get location of shader variable vPosition
    locPosition = gl.getAttribLocation( program, "vPosition" );
    gl.enableVertexAttribArray( locPosition );

    locColor = gl.getUniformLocation( program, "rcolor" );

    render();
}

// Moves Mario to the left.
function left(){
  if(Math.floor(100*vertices[0][0]) == Math.floor(100*platform[7][0]) && Math.floor(100*vertices[0][1]) < Math.floor(100*platform[7][1])) {

  }
  else if(vertices[0][0] < -1){

  }
  else if(Math.floor(100*vertices[2][0]) <= Math.floor(100*(platform[8][0])+0.05) && Math.floor(100*vertices[0][1]) > 0.99){
  }
  else{
    for(i=0; i<6; i++) {
        vertices[i][0] -= 0.01;
    }
    getsCoin();
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(vertices));
  }
}

// Moves Mario to the right.
function right(){
  if(Math.floor(100*vertices[2][0]) == Math.floor(100*platform[8][0]) && Math.floor(100*vertices[2][1]) < Math.floor(100*platform[8][1])) {

  }
  else if(vertices[2][0] > 1){

  }
  else if(Math.floor(100*vertices[0][0]) >= Math.floor(100*(platform[7][0])-0.05) && Math.floor(100*vertices[0][1]) > 0.99){

  }
  else{
    for(i=0; i<6; i++) {
        vertices[i][0] += 0.01;
    }
    getsCoin();
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(vertices));
  }
}

// Function that makes Mario able to jump.
// j is the desired jump height.
function jump(j){
  jumping = true;
  if(j <= 0){
    jumpingVelocity = 0.06;
    sleep(10).then(() => { fall(vertices[0][1]); });
  } else{
  var up = 8;
  for(i=0; i<6; i++) {
    if (jumpingVelocity > 0) {
      vertices[i][1] += jumpingVelocity;
    }
  }
    if(rightJump  && !(vertices[0][0] > 1)){
      for(i=0; i<6; i++) {
        vertices[i][0] += 0.01;
        getsCoin();
      }
    }

    if(leftJump && !(vertices[2][0] < -1)){
      for(i=0; i<6; i++) {
        vertices[i][0] -= 0.01;
        getsCoin();
      }
    }

  getsCoin();
  gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(vertices));
  up -= 1;
  jumpingVelocity -= 0.005
  sleep(30).then(() => {jump(j - 1)});
  }
}

// Falling graphics of Mario afte he jumps.
// j is the placement of Marios feet.
function fall(j){
  if(j <= 0){
    resetHeight(0);
    jumping = false;
    leftJump = false;
    rightJump = false;
    fallingVelocity = 0;
  }
  else{

    for(i=0; i<6; i++) {
        vertices[i][1] -= fallingVelocity;
        getsCoin();
    }

    if(rightJump  && !(vertices[3][0] > 1)){
      for(i=0; i<6; i++) {
        vertices[i][0] += 0.01;
        getsCoin();
      }
    }

    if(leftJump && !(vertices[4][0] < -1)){
      for(i=0; i<6; i++) {
        vertices[i][0] -= 0.01;
        getsCoin();
      }
    }

    if(vertices[0][1] <= 0){
      resetHeight(0);
      jumping = false;
      leftJump = false;
      rightJump = false;
      fallingVelocity = 0;
    }
    if(Math.floor(100*vertices[0][0]) < Math.floor(100*platform[7][0]) && Math.floor(100*vertices[2][0]) > Math.floor(100*platform[8][0])){
      if(Math.floor(100*vertices[0][1]) <= 0.1){
        resetHeight(platform[7][1]);
        jumping = false;
        leftJump = false;
        rightJump = false;
        fallingVelocity = 0;
      } else {
        fallingVelocity += 0.0020;
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(vertices));
        sleep(50).then(() => {fall(j - 0.02)});
      }
    } else {
      fallingVelocity += 0.0020;
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(vertices));
      sleep(30).then(() => {fall(j - 0.02)});
    }
  }
}

// Resets the height of Mario.
// h is the desired height.
function resetHeight(h){
  vertices[0][1] = h;
  vertices[1][1] = h + 0.1;
  vertices[2][1] = h + 0.1;
  vertices[3][1] = h;
  vertices[4][1] = h + 0.1;
  vertices[5][1] = h;
  gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(vertices));
}

// Sleep/wait function
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Adds a new coin.
function newCoin(){
  var pos = (Math.floor(Math.random()*10))/10;
  var plusMinus = Math.random();
  if(plusMinus < 0.5){
    pos = pos * -1;
  }
  coin = [
    vec2(  pos,  0.4),
    vec2(  pos + 0.03,  0.4),
    vec2(  pos,  0.35),
    vec2(  pos + 0.03,  0.4),
    vec2(  pos,  0.35),
    vec2(  pos + 0.03,  0.35)
  ];
  bufferIDCoin = gl.createBuffer();
  gl.bindBuffer( gl.ARRAY_BUFFER, bufferIDCoin );
  gl.bufferData( gl.ARRAY_BUFFER, flatten(coin), gl.DYNAMIC_DRAW );
  //gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(coin));

  bufferIDVertices = gl.createBuffer();
  gl.bindBuffer( gl.ARRAY_BUFFER, bufferIDVertices );
  gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.DYNAMIC_DRAW );
}

// Detects if Mario gets the coin.
function getsCoin(){
  if(vertices[2][1] > coin[2][1]){
    if(vertices[1][0] >= coin[0][0]){
      if(vertices[1][0] <= coin[1][0]){
        scoreUp();
      }
    }
    if(vertices[2][0] >= coin[0][0]){
      if(vertices[2][0] <= coin[1][0]){
        scoreUp();
      }
    }
    if(vertices[0][0] <= coin[0][0]){
      if(vertices[2][0] >= coin[1][0]){
        scoreUp();
      }
    }
  }
}

// Increases the score and spawns another coin
function scoreUp(){
  newCoin();
  score += 1;
  var str = "Score: "
  str += score;
  document.getElementById('score').textContent = str;
}

// Moves the monster.
function moveMonster(){
  for(i=0; i<6; i++) {
    monster[i][0] += monsterDir;
  }
  if(monster[0][0] >= 1){
    monsterDir = -0.005;
  }
  if(monster[2][0] <= -1){
    monsterDir = 0.005;
  }
  gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(monster));
  if(monster[1][0] < vertices[2][0] && monster[2][0] > vertices[0][0] && vertices[0][1] < monster[2][1]){
    sleep(50).then(() => {gameOver = true;});
    var str = "Score: "
    str += score;
    str += " - GAME OVER -";
    document.getElementById('score').textContent = str;
  }
}

function render() {
    if(!gameOver){
      gl.clear( gl.COLOR_BUFFER_BIT );

      // Draw Coin
      gl.bindBuffer( gl.ARRAY_BUFFER, bufferIDCoin );
      gl.vertexAttribPointer( locPosition, 2, gl.FLOAT, false, 0, 0 );
      gl.uniform4fv( locColor, flatten(colorC) );
      gl.drawArrays( gl.TRIANGLES, 0, 6);

      // Draw the ground platform
      gl.bindBuffer( gl.ARRAY_BUFFER, bufferIDPlatform );
      gl.vertexAttribPointer( locPosition, 2, gl.FLOAT, false, 0, 0 );
      gl.uniform4fv( locColor, flatten(colorA) );
      gl.drawArrays( gl.TRIANGLES, 0, 12);

      // Draw the monster
      gl.bindBuffer( gl.ARRAY_BUFFER, bufferIDMonster );
      gl.vertexAttribPointer( locPosition, 2, gl.FLOAT, false, 0, 0 );
      gl.uniform4fv( locColor, flatten(colorD) );
      gl.drawArrays( gl.TRIANGLES, 0, 6);
      moveMonster();

      // Draw Mario
      gl.bindBuffer( gl.ARRAY_BUFFER, bufferIDVertices );
      gl.vertexAttribPointer( locPosition, 2, gl.FLOAT, false, 0, 0 );
      gl.uniform4fv( locColor, flatten(colorB) );
      gl.drawArrays( gl.TRIANGLES, 0, 6);
      window.requestAnimFrame(render);
    }
}
