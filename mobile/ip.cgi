#!/usr/bin/perl

print "Content-type: text/html\n\n";

print "$ENV{'REMOTE_ADDR'}";

print "<p>";
#print "<table>";
while(($k, $v) = each(%ENV)){
#	print "<tr><td>$k</td><td>$v</td></tr>";
}
#print "</table>";
