"use client";

import type { ReactNode } from "react";
import { OPEN_CONTACT_CHAT_EVENT } from "./ContactChat";

export function OpenContactChatButton({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(OPEN_CONTACT_CHAT_EVENT))}
      className={className}
    >
      {children}
    </button>
  );
}
