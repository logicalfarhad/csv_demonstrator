import React from "react";
import favicon from "./../favicon.svg"; 

const SvgComponent = ({ w, h, stroke }) => {
  return (
<div>
<img src={favicon} width={w} height={h} />
</div>
  );
};

export default SvgComponent;
