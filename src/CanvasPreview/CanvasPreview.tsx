import * as React from 'react'

interface CanvasPreviewProps {
  addStyle: React.CSSProperties
};

const CanvasPreview: React.FC<CanvasPreviewProps> = ({
  addStyle = {}
}) => {
  return (
    <div
      data-testid={"canvas-preview"}
      style={{
        ...addStyle,
        backgroundColor: "red"
      }}
    ></div>
  );
};

export default CanvasPreview;