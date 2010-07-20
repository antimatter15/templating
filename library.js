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
  
  
  Innovation?
  
  
  @block{{{
    @expanded?
      @participants.join(',')
    @else
      @{participants.slice(0,2).join(',')}
    @/
  }}}
  
  <a href="#" onclick="@{{{
    vars.expanded = true;
    block();
  }}}"></a>
  

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


function execute(vars, str){
  //support dynamic code execution: Key for the block templates feature
  //allows code to be attached to a event such as onclick which fires
  //within the scope of the vars object and can trigger a block reload
  //which is described in further detail below
  str = str.replace(/@\{\{\{(.+)\}\}\}/g, function(a, code){
    //TODO: fix memory leaking issues with this system
    var id = '_template_'+Math.random().toString(36).substr(2,6);
    window[id] = function(e){
      e = e || window.event;
      //hopefully execution is bound to this closure
      with(vars){
        eval(code);
      }
    }
    return 'window.'+id+'(e)';
  });
  
  //blocks are templated sections of code which are inside elements such
  //as spans and divs. They add functions to the vars object which can be
  //called from the dynamic code execution feature to reload a block.
  //the executed code could change the state of vars and use that to
  //do something magical like toggle a state and have it rendered differently
  //and do a live update of the view
  str = str.replace(/@([\w\.])\{\{\{(.+)\}\}\}/g, function(a, blockprefs, blocktemplate){
    blockprefs = blockprefs.split('.');
    var blockname = blockprefs[0], blocktag = blockprefs[1] || 'div';
    var id = blockname+'_'+Math.random().toString(36).substr(2,4);
    var html = '<'+blocktag+' id="'+id+'">'+blocktemplate+'<'+'/'+blocktag+'>';
    var jsc = '(function(vars){with(vars){'+template(html)+';return _doc.join("");};})';
    var jsf = eval(jsc); //jsf is a function which returns the executed template
    
    vars[blockname] = function(){//re-render stuffs;
      var el = document.getElementById(id);
      if(el){
        el.innerHTML = jsf(vars);
      }else{
        //oh noes it hasn't been appended to the document
        //or it's been removed, that means we can't do anything
      }
    }
    vars[blockname].el = id;
    return jsf(vars);
  });
  
  
  var jsc = '(function(vars){with(vars){'+template(str)+';return _doc.join("");};})';
  var jsf = eval(jsc); //jsf is a function which returns the executed template
  return jsf(vars);
}


function template(str){
  str = str.replace(/([^\\]|^)@([\w\.]+\(.*?\))/,'$1@{$2}'); //for cases like blah('234', 544, argh)
  str = str.replace(/([^\\]|^)@(.+?)\;?([\s])/g,'$1@{$2}$3'); //"//for general @blah+meh[whitespace]
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
