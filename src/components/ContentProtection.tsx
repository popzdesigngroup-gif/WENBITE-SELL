"use client";

import { useEffect, useState, useRef } from "react";

export function ContentProtection() {
  const [showWarning, setShowWarning] = useState(false);
  const [warningText, setWarningText] = useState("");
  const [isShieldActive, setIsShieldActive] = useState(false);
  const [screenProtectBlocked, setScreenProtectBlocked] = useState(false);
  const shieldTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const activateBlackoutShield = (reason: string, durationMs: number = 3000) => {
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
    // 1. Screen Capture API Interceptor (getDisplayMedia detection)
    if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
      const originalGetDisplayMedia = navigator.mediaDevices.getDisplayMedia.bind(navigator.mediaDevices);
      navigator.mediaDevices.getDisplayMedia = async function (...args) {
        setScreenProtectBlocked(true);
        activateBlackoutShield("Screen recording detected and disabled.", 5000);
        throw new DOMException("Screen capture is prohibited on this website.", "NotAllowedError");
      };
    }

    // 2. Right-Click / Context Menu
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      activateBlackoutShield("Right-click & asset inspection disabled.");
    };

    // 3. Prevent Copy & Cut
    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      activateBlackoutShield("Content copying is strictly restricted.");
    };

    const handleCut = (e: ClipboardEvent) => {
      e.preventDefault();
      activateBlackoutShield("Content extraction restricted.");
    };

    // 4. Prohibit Dragging of any elements
    const handleDragStart = (e: DragEvent) => {
      e.preventDefault();
      return false;
    };

    // 5. Aggressive Window Blur / Window Defocus
    // System recorders (macOS QuickTime, Screen Record toolbar, OBS, Chrome screen share) 
    // cause the browser tab to immediately lose active focus.
    const handleWindowBlur = () => {
      setIsShieldActive(true);
    };

    const handleWindowFocus = () => {
      // Delay unshield slightly to catch frame-grabbing snippers
      setTimeout(() => {
        setIsShieldActive(false);
      }, 300);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsShieldActive(true);
      } else {
        setIsShieldActive(false);
      }
    };

    // 6. Keyboard Interceptors for Shortcuts (macOS Cmd+Shift+5 is QuickTime/Screen Record)
    const handleKeyDown = (e: KeyboardEvent) => {
      // PrintScreen key
      if (e.key === "PrintScreen" || e.code === "PrintScreen") {
        e.preventDefault();
        activateBlackoutShield("Screen capture is prohibited.", 4000);
        return;
      }

      // macOS Screen Recording / Screenshot shortcuts: Cmd+Shift+3, Cmd+Shift+4, Cmd+Shift+5
      if ((e.metaKey && e.shiftKey) || (e.ctrlKey && e.shiftKey)) {
        if (["3", "4", "5", "6", "s", "S"].includes(e.key)) {
          e.preventDefault();
          activateBlackoutShield("Screen recording shortcut detected. Display shielded.", 5000);
          return;
        }
      }

      // Windows Game Bar Record (Win + Alt + R)
      if (e.altKey && (e.key.toLowerCase() === "r" || e.code === "KeyR")) {
        activateBlackoutShield("Recording shortcut detected.", 4000);
        return;
      }

      // Print / PDF
      if ((e.ctrlKey || e.metaKey) && (e.key.toLowerCase() === "p" || e.code === "KeyP")) {
        e.preventDefault();
        activateBlackoutShield("Printing and PDF export are disabled.", 3000);
        return;
      }

      // Save page
      if ((e.ctrlKey || e.metaKey) && (e.key.toLowerCase() === "s" || e.code === "KeyS")) {
        e.preventDefault();
        activateBlackoutShield("Webpage file saving is restricted.", 3000);
        return;
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
      {/* 1. Permanent Video Dynamic Protection Canvas Overlay (Renders continuous anti-piracy grid) */}
      <div className="fixed inset-0 pointer-events-none z-[99990] overflow-hidden select-none opacity-20">
        <div className="absolute inset-0 flex flex-wrap items-center justify-around gap-24 p-8 transform -rotate-12 scale-125">
          {Array.from({ length: 48 }).map((_, i) => (
            <div key={i} className="text-[11px] font-black tracking-widest text-white/40 whitespace-nowrap">
              VIPER.AI SECURE MASTER • PROTECTED CONTENT • DO NOT RECORD
            </div>
          ))}
        </div>
      </div>

      {/* 2. Full Blackout Shield (Engages during recording attempts / defocus / shortcuts) */}
      <div
        className={`fixed inset-0 z-[999999] bg-[#050507] flex flex-col items-center justify-center p-6 text-center transition-all duration-75 select-none ${
          isShieldActive || screenProtectBlocked
            ? "opacity-100 visible pointer-events-auto"
            : "opacity-0 invisible pointer-events-none"
        }`}
      >
        <div className="w-20 h-20 rounded-3xl bg-red-500/10 border border-red-500/40 flex items-center justify-center text-red-400 mb-5 shadow-2xl shadow-red-500/20 animate-pulse">
          <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-2xl font-black text-white tracking-wider uppercase">
          Recording & Capture Blocked
        </h2>
        <p className="text-sm text-gray-400 max-w-lg mt-3 leading-relaxed">
          Screen recording, screen mirroring, and frame captures are prohibited under digital asset rights. Uncompressed 4K master files are only released upon licensed purchase.
        </p>
      </div>

      {/* 3. Floating Alert Toast */}
      {showWarning && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[1000000] px-5 py-3 rounded-2xl bg-[#11131a]/95 border border-red-500/50 text-white shadow-2xl backdrop-blur-xl flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
          <span className="text-xs font-semibold text-gray-200 tracking-wide">
            {warningText}
          </span>
        </div>
      )}
    </>
  );
}
