import { ReactNode, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

function PortalImpl({
  onClose,
  children,
  title,
  closeOnClickOutside,
}: {
  children: ReactNode;
  closeOnClickOutside: boolean;
  onClose: () => void;
  title: string;
}) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (modalRef.current !== null) {
      modalRef.current.focus();
    }
  }, []);

  useEffect(() => {
    let modalOverlayElement: HTMLElement | null = null;
    const handler = (event: KeyboardEvent) => {
      if (event.keyCode === 27) {
        onClose();
      }
    };
    const clickOutsideHandler = (event: MouseEvent) => {
      const target = event.target;
      if (
        modalRef.current !== null &&
        !modalRef.current.contains(target as Node) &&
        closeOnClickOutside
      ) {
        onClose();
      }
    };
    const modelElement = modalRef.current;
    if (modelElement !== null) {
      modalOverlayElement = modelElement.parentElement;
      if (modalOverlayElement !== null) {
        modalOverlayElement.addEventListener("click", clickOutsideHandler);
      }
    }

    window.addEventListener("keydown", handler);

    return () => {
      window.removeEventListener("keydown", handler);
      if (modalOverlayElement !== null) {
        modalOverlayElement?.removeEventListener("click", clickOutsideHandler);
      }
    };
  }, [closeOnClickOutside, onClose]);

  return (
    <div
      className="flex justify-center items-center fixed flex-col top-0 bottom-0 left-0 right-0 z-100"
      role="dialog"
    >
      <div
        className="p-10 min-h-[100px] min-w-[300px] flex flex-col bg-white relative rounded-lg"
        tabIndex={-1}
        ref={modalRef}
      >
        <h2 className="">{title}</h2>
        <button
          className=""
          aria-label="Close modal"
          type="button"
          onClick={onClose}
        >
          X
        </button>
        <div className="">{children}</div>
      </div>
    </div>
  );
}

export default function Modal({
  onClose,
  children,
  title,
  closeOnClickOutside = false,
}: {
  children: ReactNode;
  closeOnClickOutside?: boolean;
  onClose: () => void;
  title: string;
}): JSX.Element {
  return createPortal(
    <PortalImpl
      onClose={onClose}
      title={title}
      closeOnClickOutside={closeOnClickOutside}
    >
      {children}
    </PortalImpl>,
    document.body
  );
}
