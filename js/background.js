/**
 * Created by Wesley Nascimento on 07/11/2014.
 */

var reges = /([A-Za-z]{1,2})([0-9]{1,2})\.(.+)\/game\.php/g;

// When the extension is installed or upgraded ...
chrome.runtime.onInstalled.addListener(function() {
    // Replace all rules ...
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
        // With a new rule ...
        chrome.declarativeContent.onPageChanged.addRules([
            {
               // That fires when a page's URL contains a 'g' ...
                conditions: [
                             new chrome.declarativeContent.PageStateMatcher({
                                    pageUrl: { hostContains: "tribalwars" }
                             })],
    	        // And shows the extension's page action.
    	        actions: [
                    new chrome.declarativeContent.ShowPageAction()
                ]
            }
	    ]);
    });
});

console.log("Background.js");

