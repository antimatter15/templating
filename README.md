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
