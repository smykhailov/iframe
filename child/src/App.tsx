import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class App extends Component {
  render() {
    return (
      <div className="App">
        <h1>Child Host</h1>
        <button onClick={this.openWindow}>Open Window</button>
      </div>
    );
  }

  openWindow = () => {
    const childWindow: Window = window.open("", "ChildWindow", "left=200,top=100,width=500,height=500")!;

    ReactDOM.render(<ChildWindow renderWindow={childWindow} />, childWindow.document.body);
  }
}

class ChildWindow extends Component<{renderWindow: Window}> {
  render() {
    return (
      <div>
        <h1>Child Window (3rd party app host)</h1>

        <button onClick={this.sendToChildHost}>Send to Child Host</button>
        <button onClick={this.sendToThirdPartyApp}>Send to Third Party App</button>

        <iframe src="http://localhost:3002/" width="100%" height="300" title="Third Party"></iframe>
      </div>
    );
  }

  sendToChildHost = () => {

  }

  sendToThirdPartyApp = () => {
    
  }
}

export default App;
