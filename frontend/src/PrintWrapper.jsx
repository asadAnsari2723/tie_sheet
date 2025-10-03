import React, { useRef } from "react";

const PrintWrapper = ({ children }) => {
  const containerRef = useRef(null);

  const handlePrint = () => {
    const content = containerRef.current;
    if (!content) return;

    // Approx A4 landscape width in px (at 96dpi ~ 1122px)
    const pageWidth = 1122;

    const scale = Math.min(1, pageWidth / content.offsetWidth);
    content.style.transform = `scale(${scale})`;
    content.style.transformOrigin = "top left";

    window.print();

    // Reset after print
    content.style.transform = "";
  };

  return (
    <div>
      <button
        type="button"
        onClick={handlePrint}
        className="no-print mb-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Print
      </button>

      <div ref={containerRef} className="print-container">
        {children}
      </div>
    </div>
  );
};

export default PrintWrapper;
