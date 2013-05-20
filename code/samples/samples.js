$(function () {
    var whitespaceExpression = /^\s+|\s+$/g,
        sampleHtml = $("#sample-html").find("script").html().replace(whitespaceExpression, ""),
        sampleScript = $("#sample-script").find("script").html().replace(whitespaceExpression, "");

    //sampleHtml = sampleHtml.substring(0, sampleHtml.length - 3);

    $("#sample-html").find("pre").text(sampleHtml);
    $("#sample-script-pane").find("pre").text(sampleScript);

    SyntaxHighlighter.highlight();

    if(window.RunSample) {
        window.RunSample();
    }
});