window.addEventListener("message", function (ev) {
console.log(ev)

console.log(targetIframe)

if(targetIframe) {
    targetIframe.contentWindow.postMessage({
    to: "ThirdPartyApp",
    msg: "Send To Third Party App from proxy",
    originalEvent: ev.data
    }, "*")
}
});