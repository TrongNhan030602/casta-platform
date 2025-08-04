import { useNavigate } from "react-router-dom";
import Button from "@/components/common/Button";

const SpaceHeader = ({ code, name }) => {
  const navigate = useNavigate();

  return (
    <div className="space-header d-flex justify-content-between align-items-center mb-4">
      <div className="space-header__info">
        <h2 className="page-title">
          {name} ({code})
        </h2>
      </div>

      <div className="space-header__action">
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
        >
          ← Quay lại
        </Button>
      </div>
    </div>
  );
};

export default SpaceHeader;
