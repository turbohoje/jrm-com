#!/usr/bin/perl

require LWP::UserAgent;

my $ua = LWP::UserAgent->new;
$ua->timeout(10);
$ua->env_proxy;

my $response = $ua->get('http://www.weather.com/weather/5-day/Boulder+CO+USCO0038');
open FILE, '>/var/vhosts/jrm/mobile/weather.html';
if ($response->is_success) {
	my $resp = $response->decoded_content;  # or whatever

	$resp =~ m/(<table class="twc-forecast-table twc-second">)(.*)(<table class="twc-forecast-table twc-last">)/sm;
	$content = $2;
	$content =~ s/<a href="[^"]+" from="5day_daypartforecast_icon">//smg;
	$content =~ s/<\/a>//smg;
	print FILE "<table style=\"font-family: arial; font-size:11px;\">\n";
	print FILE "<tr><td>Today</td><td>+1</td><td>+2</td><td>+3</td><td>+4</td></tr>\n";
	print FILE $content;
}
else {
    die $response->status_line;
}
close FILE;
