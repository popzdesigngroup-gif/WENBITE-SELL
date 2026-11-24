"use client";

import { useEffect, useState, useRef } from "react";

export function ContentProtection() {
  const [showWarning, setShowWarning] = useState(false);
  const [warningText, setWarningText] = useState("");
  const [isShieldActive, setIsShieldActive] = useState(false);
  const shieldTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const activateBlackoutShield = (reason: string, durationMs: number = 2000) => {
    setIsShieldActive(true);
    setWarningText(reason);
    setShowWarning(true);

    if (shieldTimeoutRef.current) {
      clearTimeout(shieldTimeoutRef.current);
    }

    shieldTimeoutRef.current = setTimeout(() => {
      setIsShieldActive(false);
      setShowWarning(false);
    }, durationMs);
  };

  useEffect(() => {
    // 1. Context Menu (Right Click)
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      activateBlackoutShield("Right-click & asset inspection disabled.");
    };

    // 2. Prevent Copy & Cut
    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      activateBlackoutShield("Content copying is strictly restricted.");
    };

    const handleCut = (e: ClipboardEvent) => {
      e.preventDefault();
      activateBlackoutShield("Content extraction restricted.");
    };

    // 3. Prohibit Dragging of media
    const handleDragStart = (e: DragEvent) => {
      e.preventDefault();
      return false;
    };

    // 4. Keyboard Interceptors for Screenshots
    const handleKeyDown = (e: KeyboardEvent) => {
      // PrintScreen key (Windows / Linux)
      if (e.key === "PrintScreen" || e.code === "PrintScreen") {
        e.preventDefault();
        activateBlackoutShield("Screen capture is prohibited.", 3000);
        return;
      }

      // Mac screenshot combinations: Command + Shift + 3 / 4 / 5 / 6
      if (
        (e.metaKey && e.shiftKey) ||
        (e.ctrlKey && e.shiftKey)
      ) {
        if (["3", "4", "5", "6", "s", "S"].includes(e.key)) {
          e.preventDefault();
          activateBlackoutShield("Screenshot shortcut detected. Display shielded.", 3500);
          return;
        }
      }

      // Windows Snipping Tool (Win + Shift + S) or Alt + PrintScreen
      if (e.key === "Meta" || e.key === "OS" || e.code.includes("Meta")) {
        // Prepare shield if Meta is pressed with Shift
        if (e.shiftKey) {
          activateBlackoutShield("Screen capture shortcut detected.", 3500);
          return;
        }
      }

      // Ctrl+P / Cmd+P (Print to PDF / Print Dialog)
      if ((e.ctrlKey || e.metaKey) && (e.key.toLowerCase() === "p" || e.code === "KeyP")) {
        e.preventDefault();
        activateBlackoutShield("Printing and PDF export are disabled.", 2500);
        return;
      }

      // Ctrl+S / Cmd+S (Save Page)
      if ((e.ctrlKey || e.metaKey) && (e.key.toLowerCase() === "s" || e.code === "KeyS")) {
        e.preventDefault();
        activateBlackoutShield("Saving webpage files is restricted.", 2000);
        return;
      }

      // F12 or Inspect shortcuts
      if (
        e.key === "F12" ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key.toLowerCase() === "i" || e.code === "KeyI")) ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key.toLowerCase() === "c" || e.code === "KeyC")) ||
        ((e.ctrlKey || e.metaKey) && (e.key.toLowerCase() === "u" || e.code === "KeyU"))
      ) {
        e.preventDefault();
        activateBlackoutShield("Developer inspection tools are disabled.", 2500);
        return;
      }
    };

    // 5. Window Blur / Defocus Shielding (Snipping tools / macOS screenshot overlays steal focus)
    const handleWindowBlur = () => {
      // Whenever external capture tool activates, window loses focus -> instantly blackout
      setIsShieldActive(true);
    };

    const handleWindowFocus = () => {
      // Restore when user returns
      setIsShieldActive(false);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsShieldActive(true);
      } else {
        setIsShieldActive(false);
      }
    };

    window.addEventListener("contextmenu", handleContextMenu);
    window.addEventListener("copy", handleCopy);
    window.addEventListener("cut", handleCut);
    window.addEventListener("dragstart", handleDragStart);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("blur", handleWindowBlur);
    window.addEventListener("focus", handleWindowFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("contextmenu", handleContextMenu);
      window.removeEventListener("copy", handleCopy);
      window.removeEventListener("cut", handleCut);
      window.removeEventListener("dragstart", handleDragStart);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("blur", handleWindowBlur);
      window.removeEventListener("focus", handleWindowFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (shieldTimeoutRef.current) {
        clearTimeout(shieldTimeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      {/* 1. Dynamic Blackout Shield Layer */}
      <div
        className={`fixed inset-0 z-[999999] bg-[#090a0f] flex flex-col items-center justify-center p-6 text-center transition-opacity duration-75 pointer-events-none select-none ${
          isShieldActive ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 mb-4 animate-pulse">
          <svg
            className="w-8 h-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-white tracking-wide">
          Protected Content
        </h2>
        <p className="text-sm text-gray-400 max-w-md mt-2">
          Screenshots, recording, and media captures are strictly blocked to protect proprietary 4K AI video masters.
        </p>
      </div>

      {/* 2. Floating Warning Toast */}
      {showWarning && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[1000000] px-5 py-3 rounded-2xl bg-[#11131a]/95 border border-red-500/50 text-white shadow-2xl backdrop-blur-xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-150">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
          <span className="text-xs font-semibold text-gray-200 tracking-wide">
            {warningText}
          </span>
        </div>
      )}
    </>
  );
}
