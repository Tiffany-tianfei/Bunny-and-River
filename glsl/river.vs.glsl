#version 300 es


uniform vec3 bunnyPosition;
out vec3 riverPlace;
void main() {

  	  riverPlace = vec3(modelMatrix * vec4( position, 1.0 ));
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

}
