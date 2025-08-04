import React from "react";
import PropTypes from "prop-types";
import "@/assets/styles/layout/two-column-layout.css";

const TwoColumnLayout = ({
  title,
  backButton,
  leftChildren,
  rightChildren,
  leftWidth = "1fr",
  rightWidth = "1fr",
}) => {
  const gridStyle = {
    "--left-column-width": leftWidth,
    "--right-column-width": rightWidth,
  };

  return (
    <div className="two-col-layout">
      <div className="header">
        <h2 className="page-title">{title}</h2>
        {backButton}
      </div>

      <div
        className="content-grid"
        style={gridStyle}
      >
        <div className="left-column">{leftChildren}</div>
        <div className="right-column">{rightChildren}</div>
      </div>
    </div>
  );
};

TwoColumnLayout.propTypes = {
  title: PropTypes.node.isRequired,
  backButton: PropTypes.node,
  leftChildren: PropTypes.node,
  rightChildren: PropTypes.node,
  leftWidth: PropTypes.string,
  rightWidth: PropTypes.string,
};

export default TwoColumnLayout;
