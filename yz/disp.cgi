#!/usr/local/bin/perl

print "Content-type: text\/html\n\n";
$root_dir = "/var/vhosts/haus/yz/pics/thumb";
$pic_dir = "/var/vhosts/haus/yz/pics/pics";

opendir(DIR, $root_dir) || die "Couldn't open '$root_dir'\n";
@contents = readdir DIR;
@contents = sort(@contents);
closedir(DIR);

print "<table><tr>";
my $count = 2;
foreach(@contents){
	if($_ ne ".." && $_ ne "."){
		if ($count %2 == 0)
		{
			print "</tr><tr valign=center>";
		}
		print "<td align=center><a href=\"pics/$_\"><img src=\"thumb/$_\" border=\"0\"></a></td>\n";
		$count++;
	}
}

print "</tr></table>";
