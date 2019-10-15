import React, { Component } from 'react';

type AppState = { message: MessageEvent }

class App extends Component<{}, AppState> {
  constructor(props: {}) {
    super(props);

    window.addEventListener("message", (ev: MessageEvent) => {
      // if (ev.data.to !== "ThirdPartyApp") {
      //   return;
      // }
      
      this.setState({message: ev});
    });

    this.state = {
      message: { data: {} } as any
    }
  }

  render() {
    return (
      <div>
        <h1>Third Party App</h1>

        <button onClick={this.sendToChildWindow}>Send to Child Window</button>
        <button onClick={this.sendToChildHost}>Send to Child Host</button>
        <button onClick={() => this.setState({message: { data: {} } as any})}>Clear</button>

        <div>
          <div><strong>Message Origin: </strong> <span>{this.state.message.origin}</span></div>
          <div><strong>Message Data To: </strong> <span>{this.state.message.data.to}</span></div>
          <div><strong>Message Data: </strong> <span>{this.state.message.data.msg}</span></div>
          <div><strong>Message Type: </strong> <span>{this.state.message.type}</span></div>
        </div>
      </div>
    );
  }

  sendToChildWindow = () => {
    window.postMessage({
      to: "ChildWindow",
      msg: "Send To Child Window"
    }, "*");
  }

  sendToChildHost = () => {
    window.postMessage({
      to: "ChildHost",
      msg: "Send To Child Host"
    }, "*");
  }
}

export default App;
