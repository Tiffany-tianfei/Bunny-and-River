#version 300 es

// The uniform variable is set up in the javascript code and the same for all vertices
uniform vec3 bunnyPosition;
uniform float runTime;
uniform float bunnyBack;
uniform float bunnySize;

// HINT: YOU WILL NEED AN ADDITIONAL UNIFORM VARIABLE TO MAKE THE BUNNY HOP

// Create shared variable for the vertex and fragment shaders
out vec3 interpolatedNormal;

void main() {
    // Set shared variable to vertex normal
    interpolatedNormal = normal;
    // vec4 bunnys = vec4 (bunnyPosition, 0.0);
    vec4 current = modelMatrix * vec4 (position, bunnySize);
    current.x = current.x + bunnyPosition.x;
    current.z = current.z + bunnyPosition.z;
    if (bunnyBack == 1.0){
        current.y = current.y + abs(sin(runTime));
    }else
        current.y = current.y + (bunnyPosition.y);
    

        

    // HINT: USE bunnyPosition HERE
    // if bunnyPosition.z ==

    // Multiply each vertex by the model matrix to get the world position of each vertex, then the view matrix to get the position in the camera coordinate system, and finally the projection matrix to get final vertex position
    gl_Position = projectionMatrix * viewMatrix * current;
}
