import React, { Component } from 'react';

class App extends Component {
  render() {
    return (
      <div>
        <h1>Third Party App</h1>

        <button onClick={this.sendToChildWindow}>Send to child window</button>
        <button onClick={this.sendToChildHost}>Send to child host</button>
      </div>
    );
  }

  sendToChildWindow = () => {
    
  }

  sendToChildHost = () => {

  }
}

export default App;
