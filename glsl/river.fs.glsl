#version 300 es

precision highp float;
precision highp int;
uniform float riverPosition;
out vec4 out_FragColor; 

void main() {

 float flow = sin(riverPosition);
 
  out_FragColor = vec4(0.0, 0.9, 1.0, abs(flow)+0.15); // REPLACE ME

}
