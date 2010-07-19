
function each(obj){
  return function(callback){
    if(obj.length){
      for(var i = 0; i < obj.length; i++){
        callback(obj[i],i);
      }
    }else{
      for(var i in obj){
        callback(obj[i], i);
      }
    }
  }
}

function _if(value){
  return function(callback){
    if(value) callback(value);
    return value;
  }
}

var _obj = $obj, _keys = _keys(_obj);
for(var _i = _keys.length; _i--;){
  var $key = _keys[_i], $val = _obj[$key];
}


function template(vars, str){
  str = str.replace(/([^\\]|^)@([\w\)\(\,\/\+\-\.\_\$\!]+)/g,'$1@{$2}');
  str = str.replace(/'/g, "\\'"); //"
  str = str.replace(/\n/,'\\n');
  str = str.replace(/\\@/, '@');
  console.log(str);
  return ("var _doc=[];_doc.push('"+str.replace(/([^\\]|^)@\{(.*?)\}/g, 
          function(all, prefix, body){
    if(body == 'end' || body.charAt(0) == '/') body = '})';
    else if(/^each\(/.test(body)){
      body = body.replace(/^each\((.*?)(,([\w,]+))?\)\s*$/, 'each($1)(function($3){');
    }else if(/^if\(/.test(body)){
      body = body.replace(/^if\((.*)(,(\w+))?\)\s*$/,'_if($1)(function($2){')
    }else if(/^else/.test(body)){
      body = '});_if(!_val)(function(){'
    }else{
      body = "_doc.push("+ body + ");"
    }
    return prefix + "');" + body + ";_doc.push('";
  })+"');").replace(/_doc\.push\(\'\'\);/g,'');
}
