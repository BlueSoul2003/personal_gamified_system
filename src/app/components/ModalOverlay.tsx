"use client";

import { ArrowLeft } from "lucide-react";
import { ReactNode } from "react";

interface ModalOverlayProps {
  id: string;
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export default function ModalOverlay({ id, isOpen, onClose, title, children }: ModalOverlayProps) {
  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay show"
      onClick={(e) => {
        if ((e.target as HTMLElement).classList.contains("modal-overlay")) {
          onClose();
        }
      }}
    >
      <div className="modal-content p-6 overflow-y-auto w-full max-w-4xl mx-auto">
        <button className="modal-close-btn" onClick={onClose}>
          <ArrowLeft className="w-4 h-4 mr-2" /> RETURN
        </button>
        {title && <h2 className="section-header pixel-font text-[var(--color-neon-cyan)] mb-6">&gt; {title}</h2>}
        {children}
      </div>
    </div>
  );
}
