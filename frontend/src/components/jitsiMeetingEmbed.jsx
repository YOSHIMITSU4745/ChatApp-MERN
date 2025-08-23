import React, { useEffect, useRef } from "react";

export default function JitsiMeetingEmbed({ roomName, userName, onClose }) {
  const containerRef = useRef();

  useEffect(() => {
    let api;

    const loadScript = () =>
      new Promise((resolve, reject) => {
        if (window.JitsiMeetExternalAPI) {
          resolve();
          return;
        }
        const script = document.createElement("script");
        script.src = "https://meet.jit.si/external_api.js";
        script.async = true;
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
      });

    loadScript().then(() => {
      const domain = "meet.jit.si";
      const options = {
        roomName,
        width: "100%",
        height: 500,
        parentNode: containerRef.current,
        userInfo: { displayName: userName },
      };

      api = new window.JitsiMeetExternalAPI(domain, options);
    });

    return () => {
      if (api) {
        api.dispose();
      }
    };
  }, [roomName, userName]);

  return (
    <div className="mt-4 border border-gray-300 rounded-xl overflow-hidden shadow-md">
      <div className="flex justify-between items-center bg-gray-100 px-3 py-2 border-b">
        <span className="font-semibold text-gray-700">Live Meeting</span>
        <button
          onClick={onClose}
          className="text-red-600 font-bold hover:text-red-800"
        >
          ✕
        </button>
      </div>
      <div ref={containerRef} style={{ height: 500, width: "100%" }} />
    </div>
  );
}
