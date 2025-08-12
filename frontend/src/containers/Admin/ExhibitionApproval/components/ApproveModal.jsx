import Modal from "@/components/common/Modal";
import Button from "@/components/common/Button";

const ApproveModal = ({ open, onClose, onConfirm, product }) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Duyệt sản phẩm"
    >
      <p>
        Bạn có chắc muốn <strong>duyệt</strong> sản phẩm
        <br />
        <strong>{product?.product?.name || "Không rõ"}</strong>?
      </p>

      <div className="modal-footer gap-3">
        <Button
          variant="danger-outline"
          onClick={onClose}
        >
          Hủy
        </Button>
        <Button
          variant="primary"
          onClick={onConfirm}
        >
          Xác nhận duyệt
        </Button>
      </div>
    </Modal>
  );
};

export default ApproveModal;
