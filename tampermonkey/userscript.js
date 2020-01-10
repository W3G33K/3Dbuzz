// ==UserScript==
// @name         3Dbuzz Downloader
// @namespace    w3g33k.github.io
// @version      0.1
// @description  Downloads all the zip packages from 3Dbuzz (end of an era).
// @author       W3G33K
// @match        https://w3g33k.github.io/3Dbuzz/3Dbuzz.html
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery.fileDownload/1.4.2/jquery.fileDownload.min.js
// @grant        none
// ==/UserScript==

window.addEventListener("load", function() {
    let jQuery = window.jQuery;
    !(function($, document, undefined) {
        "use strict";

        // ADJUST BASED OFF FROM YOUR ASSUMED DOWNLOAD SPEED
        const DOWNLOAD_INT_TIME = ((1000 * 60) * 8);

        function calculateDonePercent(remainingLength, startingLength) {
            let remaining = (startingLength - remainingLength),
                percentDone = ((100 * remaining) / startingLength);
            console.debug(`Percent Done: ${percentDone} %`, `Remaining/Starting Length [${remaining}/${startingLength}]`);
            return percentDone;
        }

        function download(href) {
            if (href.endsWith(".zip")) {
                $.fileDownload(href)
                    .done(() => console.debug(`File download successful! ${href}`))
                    .fail(() => {
                    console.error(`File download failed! ${href}`, "Retrying...");
                    download(href);
                });
            }
        }

        function processDownloads(downloadProcessId, anchorsTags, anchors) {
            let anchor = anchors.shift(),
                href = anchor.href;
            download(href);

            let remainingLength = anchors.length,
                startingLength = anchorsTags.length;
            let percentDone = calculateDonePercent(remainingLength, startingLength);
            if (percentDone >= 100) {
                clearInterval(downloadProcessId);
            }
        }


        let anchorsTags = document.getElementsByTagName("a"),
            anchors = Array.from(anchorsTags);
        processDownloads(0, anchorsTags, anchors);
        let downloadProcessId = setInterval(function() {
            processDownloads(downloadProcessId, anchorsTags, anchors);
        }, DOWNLOAD_INT_TIME);

        console.info(`Download PID: ${downloadProcessId}`);
    })(jQuery, document);
});
