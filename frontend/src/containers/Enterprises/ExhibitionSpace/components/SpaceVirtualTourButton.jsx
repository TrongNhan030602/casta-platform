import React from "react";
import Button from "@/components/common/Button";

import { FaWalking } from "react-icons/fa";

const SpaceVirtualTourButton = ({ onStart }) => {
  return (
    <div className="d-flex justify-content-center py-4">
      <Button
        variant="outline"
        size="lg"
        onClick={onStart}
      >
        <FaWalking className="me-2" />
        Tham quan không gian 360°
      </Button>
    </div>
  );
};

export default SpaceVirtualTourButton;
