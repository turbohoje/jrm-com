#!/usr/local/bin/perl

$file = "/var/www/jrm/bookmarks/bookmark.xml";

if ($ENV{REQUEST_METHOD} eq "PUT") {
open(FILE, ">$file") || die "can't open";
binmode STDIN;
binmode FILE;
read(STDIN, $in, $ENV{CONTENT_LENGTH});
print FILE $in || die "can't write";
close FILE || die "can't close";

print "Status: 201\n";
print "Content-Type: text/plain\n\n";
} elsif ($ENV{REQUEST_METHOD} eq "GET") {
print "Status: 200\n";
print "Content-Type: text/plain\n\n";

open (FILE, "<$file");
while ($out = <FILE>) {
print $out;
}
close FILE;
} 
