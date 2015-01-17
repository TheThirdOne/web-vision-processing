var compileGL = function(gl,node){
  var shader = gl.createShader(gl.FRAGMENT_SHADER);
  if(!node.src){
    throw 'Src empty. ' + node;
  }
  gl.shaderSource(shader,'varying vec2 texCoord;' + node.src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw gl.getShaderInfoLog(shader);
  }
  return shader;
};
var defineNode = function(gl,str){
  var obj = JSON.parse(str);
  if(obj.src){
    return compileGL(gl,obj);
  }
  if(!obj.elements || !obj.elements.length){
    throw 'Elements empty for node: ' + obj.name;
  }
  var out = {};
  
  if(checkDeadCode(obj.elements).length){
    throw 'Dead code. TODO remove dynamically or add display nodes or ignore';
  }
  
  for(var i = 0; i < obj.elements.length;i++){
    for(var k = 0; k < obj.elements[i].length; k++){
      obj.elements[i].inputs[k] = obj.elements[obj.elements[i].inputs[k]]; //change from indices to actual node
    }
  }
  return obj;
};

var checkDeadCode = function(elms){
  var tmp = [];
  for(var i = 0; i < elms.length;i++){
    tmp[i]=false; //by default nodes are useless
    if(elms[i].name === 'output'){ //outputs are used
      tmp[i] = true;
    }
    if(elms[i].inputs){ //if a node is an input for another, it is useful
      for(var k = 0; k < elms[i].inputs.length; k++){
        tmp[elms[i].inputs[k]] |= elms[i].inputs[k] < i;
        if(elms[i].inputs[k] >= i){
          throw 'Cannot reference a node later in the list. (Check your indices)';
        }
      }
    }
  }
  var out = []; //find unused nodes
  for(i = 0; i < tmp.length;i++){
    if(!tmp[i]){
      out.push(i);
    }
  }
  return out;
};

var Database = function(gl){
  var fcn = {};
  var fcn_cache = {};
  var libs = {};
  var lib_cache = {};
  var repos = {};
  this.set = function(name,node){
    fcn[name] = node;
  };
  this.get = function(name){
    if(!lib[name]){
      throw name + 'is not included or does not exist';
    }
    if(lib_cache[name]){
      return lib_cache[name];
    }
    //more
  };
  this.include = function(repo){ //load library
    var url = repos[repo];
    var tmp = getJSON(url);
    for (var attrname in tmp[name]){
      fcn[attrname] = tmp[name][attrname];
    }
  };
  this.addRepo = function(name,url){
    repos[name] = url;
    libs[name] = getJSON(url);
    for (var attrname in libs[name]){
      lib_cache[attrname] = libs[name][attrname];
    }
  };
};

var getJSON = function(url){
  var oReq = new XMLHttpRequest();
  var resp = '';
  oReq.onload = function () {
    resp = this;
  };
  
  oReq.open('get', url, false);
  oReq.send();
  return JSON.parse(resp);
};