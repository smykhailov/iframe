import React, { Component } from 'react';

type AppState = { message: MessageEvent; areOriginsEqual: boolean }

class App extends Component<{}, AppState> {
  constructor(props: {}) {
    super(props);

    window.addEventListener("message", (ev: MessageEvent) => {
      if (ev.data.to !== "ThirdPartyApp") {
        return;
      }
      
      this.setState({message: ev, areOriginsEqual: window.parent === ev.source});
    });


    this.state = {
      message: { data: {} } as any,
      areOriginsEqual: false,
    }
  }

  render() {
    return (
      <div>
        <h1>Third Party App</h1>

        <button onClick={this.sendToChildWindow}>Send to Child Window</button>
        <button onClick={() => this.setState({message: { data: {} } as any})}>Clear</button>

        <div>
          <div><strong>Message Origin: </strong> <span>{this.state.message.origin}</span></div>
          <div><strong>Message Data To: </strong> <span>{this.state.message.data.to}</span></div>
          <div><strong>Message Data: </strong> <span>{JSON.stringify(this.state.message.data)}</span></div>
          <div><strong>Message Type: </strong> <span>{this.state.message.type}</span></div>
          <div><strong>Correct window reference:</strong><span>{this.state.areOriginsEqual ? 'yup' : 'nope'}</span></div>
        </div>
      </div>
    );
  }

  sendToChildWindow = () => {
    window.parent.postMessage({to: "ChildWindow", from: "3rd party"}, "*")
  }
}

export default App;
