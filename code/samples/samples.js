$(function () {
    var whitespaceExpression = /^\s+|\s+$/g,
        sampleHtml = $("#sample-html").find("script").html().replace(whitespaceExpression, ""),
        sampleScript = $("#sample-script").find("script").html().replace(whitespaceExpression, "");

    $("#sample-html").find("pre").text(sampleHtml);
    $("#sample-script-pane").find("pre").text(sampleScript);

    SyntaxHighlighter.highlight();

    if(window.RunSample) {
        ko.applyBindings(window.RunSample(), document.getElementById("sample-live-model"));
    }
});