
#version 300 es

precision highp float;
precision highp int;

out vec4 out_FragColor;

// HINT: YOU WILL NEED TO PASS IN THE CORRECT VARYING (SHARED) VARIABLE)
uniform vec3 bunnyPosition;
in vec3 interpolatedNormal;
void main() {
    
    // HINT: YOU WILL NEED TO SET YOUR OWN DISTANCE THRESHOLD
    if (abs(distance(bunnyPosition, interpolatedNormal))< 4.0){
        out_FragColor = vec4(1.0, 0.0, 1.0, 1.0); // Pink
    }
    else{
        out_FragColor = vec4(0.0, 0.0, 0.0, 0.0); //White
    }
    
}

