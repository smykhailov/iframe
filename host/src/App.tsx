import React from 'react';

const App: React.FC = () => {
  return (
    <div>
      <h1>Application Host</h1>

      <iframe src="http://localhost:3001/" width="500" height="400" title="child"></iframe>
    </div>
  );
}

export default App;
