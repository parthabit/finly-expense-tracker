import Modal from "./Modal";
import Button from "./Button";

export default function ConfirmDialog({ open, onClose, onConfirm, title, description, confirmLabel = "Confirm", danger = true, loading }) {
  return (
    <Modal open={open} onClose={onClose} title={title} maxWidth="max-w-sm">
      <p className="text-sm text-secondary-500 dark:text-secondary-400">{description}</p>
      <div className="mt-6 flex justify-end gap-3">
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button variant={danger ? "danger" : "primary"} onClick={onConfirm} isLoading={loading}>
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
