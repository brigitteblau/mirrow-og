"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [animating, setAnimating] = useState(true);

  useEffect(() => {
    setAnimating(true);
  }, [pathname]);

  return (
    <div
      key={pathname}
      className={`flex min-h-full flex-1 flex-col ${animating ? "animate-page-fade" : ""}`}
      onAnimationEnd={() => setAnimating(false)}
    >
      {children}
    </div>
  );
}
