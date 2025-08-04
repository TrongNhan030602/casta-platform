import Button from "@/components/common/Button";
import {
  approveEnterprise,
  rejectEnterprise,
  suspendEnterprise,
  resumeEnterprise,
} from "@/services/admin/enterpriseService";

const ActionButtons = ({ status, onAction }) => {
  return (
    <div className="enterprise-detail__actions">
      {status === "pending" && (
        <>
          <Button
            size="sm"
            variant="primary"
            onClick={() => onAction(approveEnterprise)}
          >
            Phê duyệt
          </Button>
          <Button
            size="sm"
            variant="danger-outline"
            onClick={() => onAction(rejectEnterprise)}
          >
            Từ chối
          </Button>
        </>
      )}
      {status === "approved" && (
        <Button
          size="sm"
          variant="danger-outline"
          onClick={() => onAction(suspendEnterprise)}
        >
          Khóa hồ sơ
        </Button>
      )}
      {status === "suspended" && (
        <Button
          size="sm"
          variant="primary"
          onClick={() => onAction(resumeEnterprise)}
        >
          Kích hoạt lại
        </Button>
      )}
    </div>
  );
};

export default ActionButtons;
