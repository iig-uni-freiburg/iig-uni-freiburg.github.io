/* Based on the model of:
 *
 * Author: https://github.com/Somsubhra
 * URI: https://github.com/Somsubhra/github-release-stats
 * 
 * The MIT License (MIT)
 * 
 * Copyright (c) 2015 Somsubhra Bairi <somsubhra.bairi@gmail.com>
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

var apiRoot = "https://api.github.com/";

// Display the stats
function showStats(htmlelementid) {
    return function(data) {

    var err = false;
    var errMessage = '';

    if(data.status == 404) {
        err = true;
        errMessage = "The project does not exist!";
    }

    if(data.length == 0) {
        err = true;
        errMessage = "<!--No releases yet.-->";
    }

    var html = '';

    if(err) {
        html = errMessage;
    } else {
        var latest = true;
	var latestStr = "";
	var totalDownloads = 0;

        $.each(data, function(index, item) {
            var releaseTag = item.tag_name;
            var releaseURL = item.html_url;
            var isPrerelease = item.prerelease;
            var releaseAssets = item.assets;
            var hasAssets = releaseAssets.length != 0;
            var releaseAuthor = item.author;
            var publishDate = new Date(item.published_at.split("T")[0]).toDateString().substring(4);
            var prereleaseStr = "";
	    var releaseDownloads = 0;

            if(isPrerelease) {
                prereleaseStr = " (pre-release)";
            }

            if(hasAssets) {
                $.each(releaseAssets, function(index, asset) {
                    var assetSize = (asset.size / 1000000.0).toFixed(2);
                    var lastUpdate = asset.updated_at.split("T")[0];
		    releaseDownloads += asset.download_count;
                });
            }
	    totalDownloads += releaseDownloads;

            if(latest) {
		// set latest stuff
		latestStr = "Latest release: <a href=\"" + releaseURL + "\">" + releaseTag + "</a>" + prereleaseStr + " &bull; " + releaseDownloads + " downloads since " + publishDate + " &bull; ";
                latest = false;
            }
        });

	html = latestStr + totalDownloads + " downloads in total";
    }

    var resultDiv = $("#" + htmlelementid);
    resultDiv.html(html);
    };
}

// Callback function for getting release stats
function getStats(user, repository, htmlelementid) {
    var url = apiRoot + "repos/" + user + "/" + repository + "/releases";
    $.getJSON(url, showStats(htmlelementid)).fail(showStats);
}

// The main function
$(function() {
    getStats("iig-uni-freiburg", "WOLFGANG", "wolfgang-stats");
    getStats("iig-uni-freiburg", "SWAT20", "swat-stats");
    getStats("iig-uni-freiburg", "SecSy", "secsy-stats");
    getStats("iig-uni-freiburg", "SEPIA", "sepia-stats");
    getStats("iig-uni-freiburg", "SEWOL", "sewol-stats");
    getStats("iig-uni-freiburg", "JAGAL", "jagal-stats");
    getStats("GerdHolz", "TOVAL", "toval-stats");
});
