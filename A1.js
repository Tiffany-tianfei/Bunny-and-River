/*
 * UBC CPSC 314, Vjan2019
 * Assignment 1 Template
 */

// CHECK WEBGL VERSION
if ( WEBGL.isWebGL2Available() === false ) {
  document.body.appendChild( WEBGL.getWebGL2ErrorMessage() );
}

// SETUP RENDERER & SCENE
var container = document.createElement( 'div' );
document.body.appendChild( container );

var canvas = document.createElement("canvas");
var context = canvas.getContext( 'webgl2' );
var renderer = new THREE.WebGLRenderer( { canvas: canvas, context: context } );
renderer.setClearColor(0XAFEEEE); // green background colour
container.appendChild( renderer.domElement );
var scene = new THREE.Scene();

// SETUP CAMERA
var camera = new THREE.PerspectiveCamera(30,1,0.1,1000); // view angle, aspect ratio, near, far
camera.position.set(45,20,40);
camera.lookAt(scene.position);
scene.add(camera);

// SETUP ORBIT CONTROLS OF THE CAMERA
var controls = new THREE.OrbitControls(camera);
controls.damping = 0.2;
controls.autoRotate = false;

// ADAPT TO WINDOW RESIZE
function resize() {
  renderer.setSize(window.innerWidth,window.innerHeight);
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
}

// EVENT LISTENER RESIZE
window.addEventListener('resize',resize);
resize();

//SCROLLBAR FUNCTION DISABLE
window.onscroll = function () {
     window.scrollTo(0,0);
   }

// WORLD COORDINATE FRAME: other objects are defined with respect to it
var worldFrame = new THREE.AxesHelper(5) ;
scene.add(worldFrame);

// FLOOR WITH PATTERN
var floorTexture = new THREE.TextureLoader().load('images/floor.jpg');
floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
floorTexture.repeat.set(2, 2);

var floorMaterial = new THREE.MeshBasicMaterial({ map: floorTexture, side: THREE.DoubleSide });
var floorGeometry = new THREE.PlaneBufferGeometry(30, 30);
var floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.position.y = -0.1;
floor.rotation.x = Math.PI / 2;
scene.add(floor);
floor.parent = worldFrame;

/////////////////////////////////
//   YOUR WORK STARTS BELOW    //
/////////////////////////////////

// UNIFORMS
var bunnyPosition = {type: 'v3', value: new THREE.Vector3(0.0,0.0,0.0)};
var runTime = {type:'f', value: 0.0};
var bunnyBack = {type: 'f', value: 0.0};
var bunnySize = {type: 'f', value: 1.0};
var riverPosition = {type: 'f', value: 0.0};
// MATERIALS: specifying uniforms and shaders
var bunnyMaterial = new THREE.ShaderMaterial({
  uniforms: { bunnyPosition: bunnyPosition, runTime: runTime, bunnyBack:bunnyBack, bunnySize:bunnySize,
  }
});
var eggMaterial = new THREE.ShaderMaterial({
  uniforms: {bunnyPosition:bunnyPosition, // input bunny's location
  }
});
var riverMaterial = new THREE.ShaderMaterial({
  uniforms: {bunnyPosition:bunnyPosition, riverPosition:riverPosition,
  }
});
var drawMaterial = new THREE.ShaderMaterial({
  uniforms: {bunnyPosition:bunnyPosition, // input bunny's location
  }
});


// LOAD SHADERS
var shaderFiles = [
  'glsl/bunny.vs.glsl',
  'glsl/bunny.fs.glsl',
  'glsl/egg.vs.glsl',
  'glsl/egg.fs.glsl',
  'glsl/river.vs.glsl',
  'glsl/river.fs.glsl',
  'glsl/draw.vs.glsl',
  'glsl/draw.fs.glsl'

];

new THREE.SourceLoader().load(shaderFiles, function(shaders) {
  bunnyMaterial.vertexShader = shaders['glsl/bunny.vs.glsl'];
  bunnyMaterial.fragmentShader = shaders['glsl/bunny.fs.glsl'];

  eggMaterial.vertexShader = shaders['glsl/egg.vs.glsl'];
  eggMaterial.fragmentShader = shaders['glsl/egg.fs.glsl'];
  
  riverMaterial.vertexShader = shaders['glsl/river.vs.glsl'];
  riverMaterial.fragmentShader = shaders['glsl/river.fs.glsl'];

  drawMaterial.vertexShader = shaders['glsl/draw.vs.glsl'];
  drawMaterial.fragmentShader = shaders['glsl/draw.fs.glsl'];
                              
})

var ctx = renderer.context;
ctx.getShaderInfoLog = function () { return '' };   // stops shader warnings, seen in some browsers

// LOAD BUNNY
function loadOBJ(file, material, scale, xOff, yOff, zOff, xRot, yRot, zRot) {
  var manager = new THREE.LoadingManager();
          manager.onProgress = function (item, loaded, total) {
    console.log( item, loaded, total );
  };

  var onProgress = function (xhr) {
    if ( xhr.lengthComputable ) {
      var percentComplete = xhr.loaded / xhr.total * 100;
      console.log( Math.round(percentComplete, 2) + '% downloaded' );
    }
  };

  var onError = function (xhr) {
  };

  var loader = new THREE.OBJLoader( manager );
  loader.load(file, function(object) {
    object.traverse(function(child) {
      if (child instanceof THREE.Mesh) {
        child.material = material;
      }
    });

    object.position.set(xOff,yOff,zOff);
    object.rotation.x= xRot;
    object.rotation.y = yRot;
    object.rotation.z = zRot;
    object.scale.set(scale,scale,scale);
    object.parent = worldFrame;
    scene.add(object);

  }, onProgress, onError);
}

var bunny = loadOBJ('obj/bunny.obj', bunnyMaterial, 20, 0,-0.7,0, 0,0,0);

// CREATE EGG
var eggGeometry = new THREE.SphereGeometry(1, 32, 32);
var egg = new THREE.Mesh(eggGeometry, eggMaterial);
egg.position.set(5.0, 0.3, 5.0);
egg.scale.set(0.3, 0.4, 0.3);
egg.parent = worldFrame;
scene.add(egg);

// CREATE RIVER
var riverGeometry = new THREE.CubeGeometry;
var river = new THREE.Mesh(riverGeometry, riverMaterial);
river.position.set(0.0, 0.0, 9.9);
river.scale.set(30, 0.0, 2.0);
river.parent = worldFrame;
scene.add(river);


  function drawing(){
        var drawGeometry = new THREE.SphereGeometry(1, 32, 32);
        var draw = new THREE.Mesh(drawGeometry, drawMaterial);
        draw.position.set(bunnyPosition.value.x, 0.0, bunnyPosition.value.z);
        draw.scale.set(0.3, 0.0, 0.3);
        draw.parent = worldFrame;
        scene.add(draw);

  }

// LISTEN TO KEYBOARD
var keyboard = new THREEx.KeyboardState();
function checkKeyboard() {
  if (keyboard.pressed("W")){
    if (bunnyPosition.value.z >= 12.9 || bunnyPosition.value.y > 0 || bunnyPosition.value.z <= 9.6 )
    bunnyPosition.value.z -= 0.1;
}
  else if (keyboard.pressed("S")){
    if (bunnyPosition.value.z <= 7.6 || bunnyPosition.value.y > 0 || bunnyPosition.value.z >= 10.9 )
      bunnyPosition.value.z += 0.1;
  }

  if (keyboard.pressed("A"))
    bunnyPosition.value.x -= 0.1;
  else if (keyboard.pressed("D"))
    bunnyPosition.value.x += 0.1;
   
   //var eggMap = new Map();
    if (keyboard.pressed("X")){
        var eggGeometry = new THREE.SphereGeometry(1, 32, 32);
        var egg = new THREE.Mesh(eggGeometry, eggMaterial);
        egg.position.set(bunnyPosition.value.x, bunnyPosition.value.y + 0.3, bunnyPosition.value.z);
        egg.scale.set(0.3, 0.4, 0.3);
        egg.parent = worldFrame;
        scene.add(egg);
    }
        /*var eggLoc = {};
        eggLoc.add(bunnyPosition.value.x);
        eggLoc.add(bunnyPosition.value.z);
        eggMap.set(eggLoc, egg);*/
    
    
    if (keyboard.pressed ("Z")){
      bunnyBack.value = 1.0;
      runTime.value = runTime.value + 0.1;
      //Createive Part, not for 1b
      bunnyPosition.value.y = runTime.value;
      function func() {
      	bunnyBack.value = 0.0;
      	bunnyPosition.value.y = 0.0;
      	/*var i;
      	for (i=9; i>0; i--){
      		bunnyPosition.value.y -= 0.1;
      	};
      }
      setTimeout(func, 1000);
      function goBack(){
      	if (bunnyPosition.value.y > 0.0){
      		bunnyPosition.value.y -= 0.08;
      	}*/
      	//var timer0 = setInterval(goBack(), 100);
      }
      setTimeout(func, 2000);
     // P2 code end
    }


  

    
    if (keyboard.pressed ("P")){
      var i = 1;
      var timer = setInterval(function() {
        riverPosition.value = riverPosition.value + 0.018;
      }, 110)
 
    }
    if (keyboard.pressed("N")){
    	bunnySize.value += 0.03;
    	if (bunnySize.value > 0.07){
  			if (bunnySize.value > 1.4)
  			bunnyPosition.value.y = 0.8;
    	}

      /* temp=new THREE.Object3D();
      temp.add(bunny);
      temp.rotation.y=Math.PI/4;
      // bunnyBack.value = 1.0;
      // bunny.rotation.y += 0.1; */
  }else if (keyboard.pressed("M")){
  	if (bunnySize.value > 0.01){
  		bunnySize.value -= 0.03;
  		if (bunnySize.value < 0.09)
  			bunnyPosition.value.y = -0.5;
  	}
  	

  }

  if (keyboard.pressed("O")){
  	bunnySize.value=1.0;
    	bunnyPosition.value.x= bunnyPosition.value.z=bunnyPosition.value.y = 0.0;
    }


    var timerj;
    if (keyboard.pressed("1")){
    	var r1 = {type: 'f', value: 0.0};
    	var r2 = {type: 'f', value: 0.0};
  	 //r2.value = bunnyPosition.value.z^2 + bunnyPosition.value.x^2;
  	 var jiao = 0.0; // Math.asin(bunnyPosition.value.x/r2.value);
  	 timerj = setInterval(function() {
  	 	jiao += 0.1;
        r1.value = 5.0*Math.sin(jiao);
        r2.value = 5.0*Math.cos(jiao);
        bunnyPosition.value.x = r1.value;
        bunnyPosition.value.z = r2.value;
        drawing();
        // if (jiao > 2*Math.PI){clearInterval(timerj);}
    },15);
  	
 }  
     if (keyboard.pressed("2")){
clearInterval(timerj);
  	
 }

  bunnyMaterial.needsUpdate = true; // Tells three.js that some uniforms might have changed
  eggMaterial.needsUpdate = true;
    riverMaterial.needsUpdate = true;
    drawMaterial.needsUpdate = true;
}

// SETUP UPDATE CALL-BACK
function update() {
  checkKeyboard();
  requestAnimationFrame(update);
  renderer.render(scene, camera);
}

update();

