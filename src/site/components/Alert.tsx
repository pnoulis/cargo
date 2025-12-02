import { React } from "react";
import "./Alert.css";

export enum EAlert {
  Error = "error",
  Warning = "warning",
  Success = "success",
  Info = "info",
}

export interface AlertProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  message: string;
  type?: EAlert;
}

export function Alert({ message, type, isOpen, setIsOpen }: AlertProps) {
  const dialogRef = React.useRef<HTMLDialogElement>(null);

  // Close Dialog when user clicks on the backdrop
  function handleBackdropClick(e: React.MouseEvent<HTMLDialogElement>) {
    if (e.target === dialogRef.current) {
      setIsOpen(false);
    }
  }

  // Close Dialog when these keys are pressed: ESC
  function handleKeyDown(e: React.KeyboardEvent<HTMLDialogElement>) {
    e.stopPropagation();
    if (e.key === "Escape") {
      setIsOpen(false);
    }
  }

  // Close Dialog when user clicks on the close button
  function handleCloseClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    setIsOpen(false);
  }

  React.useEffect(() => {
    if (isOpen) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [isOpen, setIsOpen]);

  return (
    <dialog
      ref={dialogRef}
      className={isOpen ? `alert ${type}` : ""}
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      closedby="none"
    >
      <div className="alert-content">
        <span className="alert-icon">{getIcon(type)}</span>
        <p className="alert-message">{message}</p>
      </div>
      <button autoFocus className="alert-close" onClick={handleCloseClick} aria-label="Close alert">
        ✕
      </button>
    </dialog>
  );
}

function getIcon(type: EAlert): string {
  switch (type) {
    case EAlert.Error:
      return "⚠";
    case EAlert.Warning:
      return "⚡";
    case EAlert.Success:
      return "✓";
    case EAlert.Info:
      return "ℹ";
    default:
      return "";
  }
}

export function useAlert() {
  const [isOpen, setIsOpen] = React.useState(false);
  let props = React.useRef({});

  function emitAlert(message: string, type: EAlert): void {
    props.current = {
      message,
      type: type || EAlert.Error,
    };
    setIsOpen(true);
  }

  return { emitAlert, alert: { ...props.current, isOpen, setIsOpen } };
}
