import { ConfirmDialog } from "primereact/confirmdialog";
import { Button } from "primereact/button";

interface CustomConfirmDialogProps {
  visible: boolean;
  onHide: () => void;
  header: string;
  message: string;
  icon?: string;
  onAccept: () => void;
  acceptLabel?: string;
  rejectLabel?: string;
  acceptClassName?: string;
}

export default function CustomConfirmDialog({
  visible,
  onHide,
  header,
  message,
  icon = "pi pi-exclamation-triangle",
  onAccept,
  acceptLabel = "Yes",
  rejectLabel = "Cancel",
  acceptClassName = "p-button-success",
}: CustomConfirmDialogProps) {
  return (
    <ConfirmDialog
      visible={visible}
      onHide={onHide}
      header={header}
      message={message}
      icon={icon}
      footer={
        <div className="flex justify-end gap-3">
          <Button
            label={rejectLabel}
            className="p-button-text"
            onClick={onHide}
          />
          <Button
            label={acceptLabel}
            className={acceptClassName}
            onClick={() => {
              onAccept();
              onHide();
            }}
          />
        </div>
      }
    />
  );
}
