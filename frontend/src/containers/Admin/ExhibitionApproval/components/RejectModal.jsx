import Modal from "@/components/common/Modal";
import Button from "@/components/common/Button";

const RejectModal = ({
  open,
  onClose,
  onConfirm,
  product,
  note,
  onChangeNote,
}) => {
  const handleConfirm = () => {
    if (!note.trim()) {
      alert("Vui lòng nhập lý do từ chối.");
      return;
    }

    onConfirm();
  };

  const handleClose = () => {
    onChangeNote(""); // reset
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Từ chối sản phẩm"
    >
      <p>
        Nhập lý do từ chối sản phẩm:
        <br />
        <strong>{product?.product?.name || "Không rõ"}</strong>
      </p>

      <textarea
        className="form-control my-2"
        rows={3}
        value={note}
        onChange={(e) => onChangeNote(e.target.value)}
        placeholder="Nhập lý do từ chối..."
      />

      <div className="modal-footer gap-2">
        <Button
          variant="danger-outline"
          onClick={handleClose}
        >
          Hủy
        </Button>
        <Button
          variant="primary"
          onClick={handleConfirm}
        >
          Xác nhận từ chối
        </Button>
      </div>
    </Modal>
  );
};

export default RejectModal;
