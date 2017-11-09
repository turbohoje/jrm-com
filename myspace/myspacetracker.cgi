#!/usr/local/bin/perl

open(FILE, ">>myspacetracker.log");
print FILE $ENV{'REMOTE_ADDR'}."\t".$ENV{'USER_AGENT'}."\t".$ENV{'QUERY_STRING'}."\n";
close(FILE);

print "Content-type:text/html\n\n";
print qq(<html><body onLoad="javascript:this.close();"></body></html>);
