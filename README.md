Javascript Templating Engine
============================

Well, there are a bazillion other JS templating engines out there,
and it's pretty easy to say why: It's really easy to make. You just
take a regex string replace and stick an eval in there and hours of
boredom makes something you think is unique despite being one or two
bits of (non)functionality away from any other library.

This is, of course, totally un-unique or innovative in any imaginable
way. I won't bore you with concepts like "lightest and smallest ever"
because it's really not.

    //this might be close
    .replace(/\{(.*)\}/g,function(a,b){return eval(b)})
  
However, I feel compelled to do something utterly non-innovative or
useful because everyone loves the NIH (Not Invented Here) syndrome.


Code is prefixed by the @ symbol, similar to Microsoft's WebMatrix
Razor stuff. It's not modeled after Razor, but I just felt like using
the @ symbol too. Or that microsoft planted an inception.

Blocks are like this:
    @{+new Date}
    
Anything can go inside blocks pretty much, and they can be multiline.
    @{
      var now = (new Date).getTime();
      var random = Math.random() * Math.pow(10,Math.floor(Math.log(now)/Math.log(10)));
      var magic = random - now;
      for(var i = 0; i < magic; i+= 42){
        magic -= Math.PI;
      }
      magic
    }
    
Take note about how amazingly awesome it is that despite being regexp powered,
it can still handle the nested for-loops instead of puking it as a syntax-errored
explosive somethingness.

The last non-whitespace line gets inserted into the html. You can optionally
use 'return magic' but that doesn't really do anything more except look more
verbose. If you really just want to have code there for some reason, you can 
end it with ''
    @{
      //do stuff
      ''
    }
    
Of course this is all boring. You can also do a shorthand notation.
    @name
    
This inserts the value of the variable "name". There are a few rules about the
shorthand notation.
    @name //interpreted as @{name}
    @name game //interpreted as @{name} game
    \@name blame //not interpreted at all, outputs as "@name blame"
    @games_are_fun //interpreted as @{games_are_fun}
    @name="bob" //interpreted as @{name="bob"}
    @explosive?'run':'poke' //interpreted as @{explosive?'run':'poke'}
    
Basically, it scans starting from an @ sign (unless the character immediately
before is a \ which causes it to remove the \ and not parse the @). It includes
everything until it encounters a whitespace character.

However, like any rule, there are exceptions.

    @format_time(date + 2 - 5/64) //interpreted as @{format_time(date + 2 - 5/64)}
    @blah(234 + 2) + 45 //interpreted as @{blah(234 + 2)} + 42
    @blah(234 + 2)+45 //interpreted as @{blah(234 + 2)}+42
    @blah(234+2)+45 //interpreted as @{blah(234+2)}+42
    
Note that the last three examples demonstrate a sort of unexpected behavior. The function
call pattern takes precedence over the include-until-whitespace behavior, because I dont
really feel bothered by it and don't feel like fixing it.
