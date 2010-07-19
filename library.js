/*
  Syntax:
  <ul>
    @each(blah, property, index)
    <li>
      @index: @index
    </li>
    @end
    
    @{testing=true;''}
    This project is in the @testing?"Development":"Release" stage.
    
    @if(stuff)
      @if(meh)
        blahblahblah
      @else
        blahblahblah
      @/
      
    @else
      oh noes this wont be right
    @/
    
  </ul>

  Documentation:
    Code is prefixed with an @. \@ can be used to add an @ without triggering the code
    The code starts immediately after the @ symbol and continues until a character
    other than A-Z0-9a-z(,)+-._$!?"', is found. Terminators include whitespace
    
    To include whitespace, you may use @{code} notation. It is equivalent in every way
    except that termination of the code block is when the closing } is encountered
    in stead of any non whitelisted character
    
    Iterator functions:
      @each(object[, property, index])
        The object can be an object or an array or array-like entity
        The property is the variable that the value can be accessed within the scope
        
        Example:
          @each(tree, name, number)
            Tree #@number+1: @name
          @end
    
    Reserved words:
      @end
        end a block, such as an @each loop
      @/
        same as @end
*/


function template(vars, str){
  str = str.replace(/([^\\]|^)@(\w+\(.*?\))/,'$1@{$2}');
  str = str.replace(/([^\\]|^)@(.+?)\;?([\s])/g,'$1@{$2}$3'); //"//
  str = str.replace(/'/g, "\\'") //"// fix bespin's syntax highlighting
        .replace(/\n/,'\\n') //escape newlines
        .replace(/\\@/g, '@'); //when using \@ to skip the parser, get rid of the leftovers
  console.log(str);
  
  return ("function _get_keys(e){var _k=[];if(e.length)for(var l=e.length;l--;)_k.push(l);else for(var i in e)_k.push(i);return _k};"+
        "var _doc=[],_vars={};with(_vars){_doc.push('"+str.replace(/([^\\]|^)@\{(.*?)\}/g, 
          function(all, prefix, body){
    if(body == 'end' || body.charAt(0) == '/') body = '}';
    else if(/^each\(/.test(body)){
      body = body.replace(/^each\((.*?)(,(\w+))?(,(\w+))?\)\s*$/,
        'var _obj=$1,_keys=_get_keys(_obj),_i=_keys.length,_key,_val;'+
        'for(;_i--;){_key=_vars["$5"]=_keys[_i];_val=_vars["$3"]=_obj[_key];');
    }else if(/^if\(/.test(body) || /\?$/.test(body)){
      body = body.replace(/^if\((.*)(,(\w+))?\)\s*$/,'if(_vars._ifval=_vars["$2"||"_ifval"]=$1){')
      body = body.replace(/(.*)\?$/,'if(_vars._ifval=$1){')
    }else if(/^else/.test(body)){
      body = '}else{'
    }else{
      body = "_doc.push("+ body + ");"
    }
    return prefix + "');" + body + ";_doc.push('";
  })+"');};").replace(/_doc\.push\(\'\'\);/g, ""); //'
}
/*
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
*/
