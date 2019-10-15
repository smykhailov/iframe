import React, { Component } from 'react';

class App extends Component {
  render() {
    return (
      <div>
        <h1>Third Party App</h1>

        <button onClick={this.sendTo3rdPartyHost}>Send to 3rd party app host</button>
        <button onClick={this.sendToChildHost}>Send to child host</button>
      </div>
    );
  }

  sendTo3rdPartyHost = () => {
    
  }

  sendToChildHost = () => {
    
  }
}

export default App;
