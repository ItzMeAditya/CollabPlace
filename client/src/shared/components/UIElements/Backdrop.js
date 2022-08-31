import React from 'react';
import ReactDOM from 'react-dom';

import './Backdrop.css';

const Backdrop = props => {

  const backdrop = <div className="backdrop" onClick={props.onClick}></div>;
  
  return ReactDOM.createPortal(backdrop, document.getElementById('backdrop-hook')
  );
};

export default Backdrop;
