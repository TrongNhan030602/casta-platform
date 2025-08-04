import React from "react";

const ViewerContainer = React.forwardRef((_, ref) => {
  return (
    <div
      ref={ref}
      className="space360viewer__viewer"
    />
  );
});

export default ViewerContainer;
