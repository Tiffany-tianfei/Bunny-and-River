#version 300 es

uniform vec3 bunnyPosition;
out vec3 interpolatedNormal;
void main() {


    interpolatedNormal = vec3(modelMatrix * vec4( position, 1.0 ));

    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

}
