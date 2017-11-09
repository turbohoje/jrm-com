#!/usr/local/bin/perl

print "Content-type: text/html\n\n";
require "cgi-lib.pl";
&ReadParse;

print qq^

<html>
<head>
<script language="JavaScript1.2">
var done = true;
function rl(overRide){
	if(!done || overRide){
		window.location.reload();
	}
}


function doIt(){

		//document.body.onresize = rl;
		
		if (window.innerWidth){
			//alert("1 " + window.innerWidth);
			//alert(window.innerWidth+" by "+window.innerHeight)
			window.document.jrm.SetVariable( "bwidth", window.innerWidth);
			window.document.jrm.SetVariable( "bheight", window.innerHeight);
		}
		//else if browser supports document.all (IE 4+)
		else if (document.all){
			//alert("2");
			//alert(document.body.clientWidth+" by "+document.body.clientHeight)
			document.jrm.SetVariable( "_root.bwidth", document.body.clientWidth);
			document.jrm.SetVariable( "_root.bheight", document.body.clientHeight);
		}
}
</script>
<style type="text/css">
	body {overflow:hidden;}
</style>
</head>
<body onLoad="doIt();" margin="0" leftmargin="0" topmargin="0" onResize="rl(true);">

<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000"
codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=7,0,0,0" width="1920" height="1920" id="jrm" align="middle">
<param name="allowScriptAccess" value="sameDomain" />
<param name="movie" value="jrm.swf?inwidth=$in{'width'}&inheight=$in{'height'}" />
<param name="quality" value="high" />
<param name="bgcolor" value="#fffff0" />
<embed src="jrm.swf?inwidth=$in{'width'}&inheight=$in{'height'}" swLiveConnect="true"
 quality="high" bgcolor="#ffffff" width="1920" height="1920" name="jrm" align="middle" allowScriptAccess="sameDomain" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer"></embed>
</object>

</body>
</html>

^;