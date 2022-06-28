import React from 'react';
import ReactShadowRoot from 'react-shadow-root';

const Web = () => {
  return (
    <basic-demo>
      <ReactShadowRoot>
        <div className="shadow-host">Shadow DOM Test Web</div>
      </ReactShadowRoot>
    </basic-demo>
  );
};

export default Web;
