Web Vision Processing
-------------------
WebGL powered vision processing


##Example Composite JSON input:
```
{
  name: "example-composite",
  elements: [{name:"input",src:"input.png"},
             {name:"threshold",t;0.5,inputs:[0]},
             {name:"mask",inputs:[0,1]}]
}
```

##Example Webgl JSON input:
```
{
  name: "example-webgl",
  src: "void main(void){gl_FragColor = vec4(1.0,1.0,1.0,1.0);}"
}
```