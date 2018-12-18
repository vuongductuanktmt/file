define("ace/mode/mushcode_highlight_rules",["require","exports","module","ace/lib/oop","ace/mode/text_highlight_rules"],function(e,t,n){"use strict";var r=e("../lib/oop"),i=e("./text_highlight_rules").TextHighlightRules,s=function(){var e="@if|@ifelse|@switch|@halt|@dolist|@create|@scent|@sound|@touch|@ataste|@osound|@ahear|@aahear|@amhear|@otouch|@otaste|@drop|@odrop|@adrop|@dropfail|@odropfail|@smell|@oemit|@emit|@pemit|@parent|@clone|@taste|whisper|page|say|pose|semipose|teach|touch|taste|smell|listen|look|move|go|home|follow|unfollow|desert|dismiss|@tel",t="=#0",n="default|edefault|eval|get_eval|get|grep|grepi|hasattr|hasattrp|hasattrval|hasattrpval|lattr|nattr|poss|udefault|ufun|u|v|uldefault|xget|zfun|band|bnand|bnot|bor|bxor|shl|shr|and|cand|cor|eq|gt|gte|lt|lte|nand|neq|nor|not|or|t|xor|con|entrances|exit|followers|home|lcon|lexits|loc|locate|lparent|lsearch|next|num|owner|parent|pmatch|rloc|rnum|room|where|zone|worn|held|carried|acos|asin|atan|ceil|cos|e|exp|fdiv|fmod|floor|log|ln|pi|power|round|sin|sqrt|tan|aposs|andflags|conn|commandssent|controls|doing|elock|findable|flags|fullname|hasflag|haspower|hastype|hidden|idle|isbaker|lock|lstats|money|who|name|nearby|obj|objflags|photo|poll|powers|pendingtext|receivedtext|restarts|restarttime|subj|shortestpath|tmoney|type|visible|cat|element|elements|extract|filter|filterbool|first|foreach|fold|grab|graball|index|insert|itemize|items|iter|last|ldelete|map|match|matchall|member|mix|munge|pick|remove|replace|rest|revwords|setdiff|setinter|setunion|shuffle|sort|sortby|splice|step|wordpos|words|add|lmath|max|mean|median|min|mul|percent|sign|stddev|sub|val|bound|abs|inc|dec|dist2d|dist3d|div|floordiv|mod|modulo|remainder|vadd|vdim|vdot|vmag|vmax|vmin|vmul|vsub|vunit|regedit|regeditall|regeditalli|regediti|regmatch|regmatchi|regrab|regraball|regraballi|regrabi|regrep|regrepi|after|alphamin|alphamax|art|before|brackets|capstr|case|caseall|center|containsfansi|comp|decompose|decrypt|delete|edit|encrypt|escape|if|ifelse|lcstr|left|lit|ljust|merge|mid|ostrlen|pos|repeat|reverse|right|rjust|scramble|secure|space|spellnum|squish|strcat|strmatch|strinsert|stripansi|stripfansi|strlen|switch|switchall|table|tr|trim|ucstr|unsafe|wrap|ctitle|cwho|channels|clock|cflags|ilev|itext|inum|convsecs|convutcsecs|convtime|ctime|etimefmt|isdaylight|mtime|secs|msecs|starttime|time|timefmt|timestring|utctime|atrlock|clone|create|cook|dig|emit|lemit|link|oemit|open|pemit|remit|set|tel|wipe|zemit|fbcreate|fbdestroy|fbwrite|fbclear|fbcopy|fbcopyto|fbclip|fbdump|fbflush|fbhset|fblist|fbstats|qentries|qentry|play|ansi|break|c|asc|die|isdbref|isint|isnum|isletters|linecoords|localize|lnum|nameshort|null|objeval|r|rand|s|setq|setr|soundex|soundslike|valid|vchart|vchart2|vlabel|@@|bakerdays|bodybuild|box|capall|catalog|children|ctrailer|darttime|debt|detailbar|exploredroom|fansitoansi|fansitoxansi|fullbar|halfbar|isdarted|isnewbie|isword|lambda|lobjects|lplayers|lthings|lvexits|lvobjects|lvplayers|lvthings|newswrap|numsuffix|playerson|playersthisweek|randomad|randword|realrandword|replacechr|second|splitamount|strlenall|text|third|tofansi|totalac|unique|getaddressroom|listpropertycomm|listpropertyres|lotowner|lotrating|lotratingcount|lotvalue|boughtproduct|companyabb|companyicon|companylist|companyname|companyowners|companyvalue|employees|invested|productlist|productname|productowners|productrating|productratingcount|productsoldat|producttype|ratedproduct|soldproduct|topproducts|totalspentonproduct|totalstock|transfermoney|uniquebuyercount|uniqueproductsbought|validcompany|deletepicture|fbsave|getpicturesecurity|haspicture|listpictures|picturesize|replacecolor|rgbtocolor|savepicture|setpicturesecurity|showpicture|piechart|piechartlabel|createmaze|drawmaze|drawwireframe",r=this.createKeywordMapper({"invalid.deprecated":"","support.function":n,"constant.language":t,keyword:e},"identifier"),i="(?:r|u|ur|R|U|UR|Ur|uR)?",s="(?:(?:[1-9]\\d*)|(?:0))",o="(?:0[oO]?[0-7]+)",u="(?:0[xX][\\dA-Fa-f]+)",a="(?:0[bB][01]+)",f="(?:"+s+"|"+o+"|"+u+"|"+a+")",l="(?:[eE][+-]?\\d+)",c="(?:\\.\\d+)",h="(?:\\d+)",p="(?:(?:"+h+"?"+c+")|(?:"+h+"\\.))",d="(?:(?:"+p+"|"+h+")"+l+")",v="(?:"+d+"|"+p+")";this.$rules={start:[{token:"variable",regex:"%[0-9]{1}"},{token:"variable",regex:"%q[0-9A-Za-z]{1}"},{token:"variable",regex:"%[a-zA-Z]{1}"},{token:"variable.language",regex:"%[a-z0-9-_]+"},{token:"constant.numeric",regex:"(?:"+v+"|\\d+)[jJ]\\b"},{token:"constant.numeric",regex:v},{token:"constant.numeric",regex:f+"[lL]\\b"},{token:"constant.numeric",regex:f+"\\b"},{token:r,regex:"[a-zA-Z_$][a-zA-Z0-9_$]*\\b"},{token:"keyword.operator",regex:"\\+|\\-|\\*|\\*\\*|\\/|\\/\\/|#|%|<<|>>|\\||\\^|~|<|>|<=|=>|==|!=|<>|="},{token:"paren.lparen",regex:"[\\[\\(\\{]"},{token:"paren.rparen",regex:"[\\]\\)\\}]"},{token:"text",regex:"\\s+"}]}};r.inherits(s,i),t.MushCodeRules=s}),define("ace/mode/folding/pythonic",["require","exports","module","ace/lib/oop","ace/mode/folding/fold_mode"],function(e,t,n){"use strict";var r=e("../../lib/oop"),i=e("./fold_mode").FoldMode,s=t.FoldMode=function(e){this.foldingStartMarker=new RegExp("([\\[{])(?:\\s*)$|("+e+")(?:\\s*)(?:#.*)?$")};r.inherits(s,i),function(){this.getFoldWidgetRange=function(e,t,n){var r=e.getLine(n),i=r.match(this.foldingStartMarker);if(i)return i[1]?this.openingBracketBlock(e,i[1],n,i.index):i[2]?this.indentationBlock(e,n,i.index+i[2].length):this.indentationBlock(e,n)}}.call(s.prototype)}),define("ace/mode/mushcode",["require","exports","module","ace/lib/oop","ace/mode/text","ace/mode/mushcode_highlight_rules","ace/mode/folding/pythonic","ace/range"],function(e,t,n){"use strict";var r=e("../lib/oop"),i=e("./text").Mode,s=e("./mushcode_highlight_rules").MushCodeRules,o=e("./folding/pythonic").FoldMode,u=e("../range").Range,a=function(){this.HighlightRules=s,this.foldingRules=new o("\\:")};r.inherits(a,i),function(){this.lineCommentStart="#",this.getNextLineIndent=function(e,t,n){var r=this.$getIndent(t),i=this.getTokenizer().getLineTokens(t,e),s=i.tokens;if(s.length&&s[s.length-1].type=="comment")return r;if(e=="start"){var o=t.match(/^.*[\{\(\[\:]\s*$/);o&&(r+=n)}return r};var e={pass:1,"return":1,raise:1,"break":1,"continue":1};this.checkOutdent=function(t,n,r){if(r!=="\r\n"&&r!=="\r"&&r!=="\n")return!1;var i=this.getTokenizer().getLineTokens(n.trim(),t).tokens;if(!i)return!1;do var s=i.pop();while(s&&(s.type=="comment"||s.type=="text"&&s.value.match(/^\s+$/)));return s?s.type=="keyword"&&e[s.value]:!1},this.autoOutdent=function(e,t,n){n+=1;var r=this.$getIndent(t.getLine(n)),i=t.getTabString();r.slice(-i.length)==i&&t.remove(new u(n,r.length-i.length,n,r.length))},this.$id="ace/mode/mushcode"}.call(a.prototype),t.Mode=a})