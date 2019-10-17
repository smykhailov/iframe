import React, { Component } from 'react';
import ReactDOM from 'react-dom';

type AppState = { message: MessageEvent }

class App extends Component<{}, AppState> {
  private iframeElementRef: React.RefObject<HTMLIFrameElement> = React.createRef();
  private childWindow!: Window;

  constructor(props: {}) {
    super(props);

    window.addEventListener("message", (ev: MessageEvent) => {
      if (ev.data.to !== "ChildHost") {
        return;
      }
      
      this.setState({message: ev});
    });

    this.state = {
      message: { data: {} } as any
    }
  }

  render() {
    return (
      <div>
        <h1>Child Host</h1>
        <button onClick={this.openWindow}>Open Window</button>
        <button onClick={this.sendMessage}>Send Message</button>
        <button onClick={() => this.setState({message: { data: {} } as any})}>Clear</button>

        <div>
          <div><strong>Message Origin: </strong> <span>{this.state.message.origin}</span></div>
          <div><strong>Message Data To: </strong> <span>{this.state.message.data.to}</span></div>
          <div><strong>Message Data: </strong> <span>{JSON.stringify(this.state.message.data)}</span></div>
          <div><strong>Message Type: </strong> <span>{this.state.message.type}</span></div>
        </div>
      </div>
    );
  }

  openWindow = () => {
    this.childWindow = window.open("", "ChildWindow", "left=200,top=100,width=500,height=500")!;
    ReactDOM.render(<ChildWindow renderWindow={this.childWindow} iframeElementRef={this.iframeElementRef} />, this.childWindow.document.body);
  }

  sendMessage = () => {
    this.childWindow.postMessage({
      to: "ChildWindow",
      msg: "To child window"
    }, "*");
  }
}

type ChildWindowProps = {renderWindow: Window, iframeElementRef:React.RefObject<HTMLIFrameElement>};
type ChildWindowState = { message: MessageEvent }

class ChildWindow extends Component<ChildWindowProps, ChildWindowState> {
  constructor(props: ChildWindowProps) {
    super(props);
    
    this.initProxy();

    props.renderWindow.addEventListener("message", (ev: MessageEvent) => {

      if (ev.data.to !== "ChildWindow") {
        return;
      }

      window.postMessage({
        to: "ChildHost",
        msg: "Init",
        origin: `ChildWindow:${window.origin}`,
        originalEvent: ev.data
      }, '*');

      this.setState({message: ev});
    });

    this.state = {
      message: { data: {} } as any 
    }
  }

  /**
   * Create a proxy living in the child window context to pass the messages to the iframe
   */
  initProxy() {
    const script = this.props.renderWindow.document.createElement("script");
    script.type = 'text/javascript';

    script.innerHTML= `
      window.addEventListener("message", function (ev) {
        console.log(ev)

        var iframeEl = window.document.getElementsByTagName("iframe")[0];
        // var iframeEl = window.targetIframe
  
        if(iframeEl) {
          iframeEl.contentWindow.postMessage({
            to: "ThirdPartyApp",
            msg: "Send To Third Party App from proxy",
            originalEvent: ev.data
          }, "*")
        }
      });
    `

    this.props.renderWindow.document.getElementsByTagName("head")[0].append(script);
  }

  render() {
    return (
      <div>
        <h1>Child Window (3rd party app host)</h1>
        <button onClick={this.sendToThirdPartyAppTgt}>Send to Third Party App</button>
        <button onClick={this.sendToHost}>Send to host</button>

        <button onClick={() => this.setState({message: { data: {} } as any})}>Clear</button>

        <div>
          <div><strong>Message Origin: </strong> <span>{this.state.message.origin}</span></div>
          <div><strong>Message Data To: </strong> <span>{this.state.message.data.to}</span></div>
          <div><strong>Message Data: </strong> <span>{JSON.stringify(this.state.message.data)}</span></div>
          <div><strong>Message Type: </strong> <span>{this.state.message.type}</span></div>
        </div>

        <iframe src="http://localhost:3002/" width="100%" height="300" title="Third Party" ref={this.props.iframeElementRef}></iframe>
      </div>
    );
  }

  sendToHost = () => {
    window.postMessage({
      to: "Child host",
      msg: "Send to child host"
    }, '*')
  }

  sendToThirdPartyAppTgt = () => {
    this.props.renderWindow.postMessage({
      to: "ThirdPartyApp",
      msg: "Send To Third Party App Using Target"
    }, "*");
  }
}

export default App;
