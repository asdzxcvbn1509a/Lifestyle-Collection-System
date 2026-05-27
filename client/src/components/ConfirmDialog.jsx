import Modal from './Modal';

export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = 'ยืนยันการลบ',
  message,
  loading,
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      footer={
        <>
          <button className="btn-ghost" onClick={onClose} disabled={loading}>
            ยกเลิก
          </button>
          <button className="btn-danger" onClick={onConfirm} disabled={loading}>
            {loading ? 'กำลังลบ...' : 'ลบ'}
          </button>
        </>
      }
    >
      <p className="text-sm text-slate-600 dark:text-slate-300">{message}</p>
    </Modal>
  );
}
