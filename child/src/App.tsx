import React, { Component } from 'react';
import ReactDOM from 'react-dom';

type AppState = { message: MessageEvent }

class App extends Component<{}, AppState> {
  private iframeElementRef: React.RefObject<HTMLIFrameElement> = React.createRef();
  constructor(props: {}) {
    super(props);

    window.addEventListener("message", (ev: MessageEvent) => {
      if (ev.data.to !== "ChildHost") {
        return;
      }

      window.postMessage({
        to: "ChildWindow",
        name: "Init Response",
        origin: `ChildHost:${window.origin}`,
        originalEvent: ev.data
      }, '*')

      if(this.iframeElementRef.current) {
        const frame = this.iframeElementRef.current;
        const target = frame.contentWindow;

        if(target) {
          target.postMessage({
            to: "ThirdPartyApp",
            msg: "Send To Third Party App from Host"
          }, "*")
        }
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

        {/* <iframe src="http://localhost:3002/" width="500" height="250" title="Third Party"></iframe> */}
      </div>
    );
  }

  openWindow = () => {
    const childWindow: Window = window.open("", "ChildWindow", "left=200,top=100,width=500,height=500")!;

    ReactDOM.render(<ChildWindow renderWindow={childWindow} iframeElementRef={this.iframeElementRef} />, childWindow.document.body);
  }

  sendMessage = () => {
    window.postMessage({
      to: "*",
      msg: "To All Windows"
    }, "*");
  }
}

type ChildWindowProps = {renderWindow: Window, iframeElementRef:React.RefObject<HTMLIFrameElement>};
type ChildWindowState = { message: MessageEvent }

class ChildWindow extends Component<ChildWindowProps, ChildWindowState> {
  constructor(props: ChildWindowProps) {
    super(props);

    window.addEventListener("message", (ev: MessageEvent) => {
      if(props.iframeElementRef.current) {
        const frame = props.iframeElementRef.current;
        const target = frame.contentWindow;

        // if(target) {
        //   target.postMessage({
        //     to: "ThirdPartyApp",
        //     msg: "Send To Third Party App from child window"
        //   }, "*")
        // }
      }

      if (ev.data.to !== "ChildWindow") {
        return;
      }

    });

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

  render() {
    return (
      <div>
        <h1>Child Window (3rd party app host)</h1>

        <button onClick={this.sendToChildHostWdw}>Send to Child Host (using window)</button>
        <button onClick={this.sendToThirdPartyAppWdw}>Send to Third Party App (using window)</button>
        <button onClick={this.sendToChildHostTgt}>Send to Child Host (using target)</button>
        <button onClick={this.sendToThirdPartyAppTgt}>Send to Third Party App (using target)</button>

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

  sendToChildHostWdw = () => {
    window.postMessage({
      to: "ChildHost",
      msg: "Send To Child Host Using Window"
    }, "*");
  }

  sendToThirdPartyAppWdw = () => {
    window.postMessage({
      to: "ThirdPartyApp",
      msg: "Send To Third Party App Using Window"
    }, "*");
  }

  sendToChildHostTgt = () => {
    this.props.renderWindow.postMessage({
      to: "ChildHost",
      msg: "Send To Child Host Using Target"
    }, "*");
  }

  sendToThirdPartyAppTgt = () => {
    this.props.renderWindow.postMessage({
      to: "ThirdPartyApp",
      msg: "Send To Third Party App Using Target"
    }, "*");
  }
}

export default App;
