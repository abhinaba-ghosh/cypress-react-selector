import React from 'react';
import ReactShadowRoot from 'react-shadow-root';

const App = () => {
  return (
    <basic-demo>
      <ReactShadowRoot>
        <div className="shadow-host">Shadow DOM Test App</div>
      </ReactShadowRoot>
    </basic-demo>
  );
};

export default App;
