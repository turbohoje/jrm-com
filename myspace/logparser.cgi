#!/usr/local/bin/perl
require "cgi-lib.pl";
&ReadParse;

print "Content-type: text/html\n\n";




open(FILE, "/var/www/jrm/myspace/logread|") || print $!;
%stuff;
%ips;
while(<FILE>){
	m/^([\d.]+)[\s-]+\[([^\]]+)\] "GET ([^"]+)HTTP\/[\d.]+"[^"]+"([^"]+)"/;
	my($ip, $date, $obj, $referer) = ($1, $2, $3, $4);
	$obj =~ s/\s//g;
	my %elem;
	$elem{'ip'} = $ip;
	$elem{'date'} = $date;
	$elem{'referer'} = $referer;
	$elem{'obj'} = $obj;
	push(@{$stuff{$obj}}, \%elem);
	push(@{$ips{$ip}}, \%elem);
}

if($in{'obj'}){
	print qq('$in{'obj'}');
	print qq(<table>);
	foreach(@{$stuff{$in{'obj'}}}){
		print qq(<tr><td nowrap="nowrap"><a href="$ENV{'SCRIPT_NAME'}?ip=$_->{'ip'}">$_->{'ip'}</a></td><td nowrap="nowrap"> $_->{'date'} </td><td nowrap="nowrap"> <a href="$_->{'referer'}" target="ref">$_->{'referer'}</a></td></tr>\n);

	}
	print qq(</table>);
}
elsif($in{'ip'}){
	print qq('$in{'ip'}');
	print qq(<table>);
	foreach(@{$ips{$in{'ip'}}}){
		print qq(<tr><td nowrap="nowrap"><a href="$ENV{'SCRIPT_NAME'}?ip=$_->{'ip'}">$_->{'ip'}</a></td><td nowrap="nowrap"> $_->{'date'} </td><td nowrap="nowrap"> <a href="$_->{'referer'}" target="ref">$_->{'referer'}</a></td></tr>\n);

	}
	print qq(</table>);
}
else{
	foreach (sort(keys(%stuff))){
 		print qq(<a href="$ENV{'SCRIPT_NAME'}?obj=$_">$_ ($#{$stuff{$_}})</a><br>\n
 		);
 		#<table cellpadding=0 cellspacing=0 border=0>);
 		#foreach $t (@{$stuff{$_}}){
 		#	print qq(<tr><td nowrap="nowrap">$t->{'ip'} </td><td nowrap="nowrap"> $t->{'date'} </td><td nowrap="nowrap"> <a href="$t->{'referer'}">$t->{'referer'}</a></td></tr>\n);
 		#}
 		#print qq(</table>);
	}
	print qq(<hr>);
	foreach (sort(keys(%ips))){
 		print qq(<a href="$ENV{'SCRIPT_NAME'}?ip=$_">$_ ($#{$ips{$_}})</a><br>\n
 		);
	}
	
}

close(FILE);