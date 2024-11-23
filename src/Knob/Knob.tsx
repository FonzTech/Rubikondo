import * as React from 'react'
import './Knob.css';
import KnobSvg from "../assets/knob.svg";
import {useRef, useState} from "react";
import * as THREE from "three";

interface KnobProps {
  minHeight: string;
}

const ANGLE_BOUNDARY_LEFT: Readonly<number> = THREE.MathUtils.degToRad(135);
const ANGLE_BOUNDARY_RIGHT: Readonly<number> = THREE.MathUtils.degToRad(45);
const ANGLE_BOUNDARY_CENTER: Readonly<number> = THREE.MathUtils.degToRad(90);

const Knob: React.FC<KnobProps> = ({
  minHeight = "256px",
}) => {
  const componentRef = useRef<HTMLImageElement | null>(null);

  const startRotation = useRef<number>(THREE.MathUtils.degToRad(135));
  const currentRotationInRad = useRef<number>(startRotation.current!);
  const [currentRotationInDeg, setCurrentRotationInDeg] = useState<string>(THREE.MathUtils.radToDeg(startRotation.current!).toFixed(2));

  const centerPoint = useRef<THREE.Vector2 | null>(null);
  const startPoint = useRef<THREE.Vector2 | null>(null);
  const currentPoint = useRef<THREE.Vector2 | null>(null);

  const onImageMouseDown = (event: React.MouseEvent<HTMLImageElement>) => {
    if (componentRef.current === null) {
      return;
    }
    event.preventDefault();

    startRotation.current = currentRotationInRad.current;

    startPoint.current = new THREE.Vector2(event.clientX, event.clientY);

    const componentRect = componentRef.current!.getBoundingClientRect();
    centerPoint.current = new THREE.Vector2(
      componentRect.x + componentRect.width / 2,
      componentRect.y + componentRect.height / 2,
    );

    document.addEventListener("mousemove", onDocumentMouseOver);
    document.addEventListener("mouseup", onDocumentMouseUp);
  }

  const onDocumentMouseOver = (event: React.MouseEvent<Document>) => {
    if (centerPoint.current === null) {
      return;
    }
    event.preventDefault();

    currentPoint.current = new THREE.Vector2(event.clientX, event.clientY);

    const deltaY1 = currentPoint.current!.y - centerPoint.current!.y;
    const deltaX1 = currentPoint.current!.x - centerPoint.current!.x;

    const deltaY2 = startPoint.current!.y - centerPoint.current!.y;
    const deltaX2 = startPoint.current!.x - centerPoint.current!.x;

    const angleInRad1 = Math.atan2(deltaY1, deltaX1);
    const angleInRad2 = Math.atan2(deltaY2, deltaX2);

    const normalizedAngle = THREE.MathUtils.euclideanModulo(startRotation.current! + angleInRad1 - angleInRad2, 2 * Math.PI);

    currentRotationInRad.current = normalizedAngle;

    const viewAngle =
      normalizedAngle > ANGLE_BOUNDARY_LEFT ||
      normalizedAngle < ANGLE_BOUNDARY_RIGHT ?
        normalizedAngle :
        normalizedAngle > ANGLE_BOUNDARY_CENTER ?
          ANGLE_BOUNDARY_LEFT :
          ANGLE_BOUNDARY_RIGHT;
    setCurrentRotationInDeg(THREE.MathUtils.radToDeg(viewAngle).toFixed(2));
  }

  const onDocumentMouseUp = (event: React.MouseEvent<Document>) => {
    if (centerPoint.current === null) {
      return;
    }
    event.preventDefault();

    centerPoint.current = null;

    document.removeEventListener("mousemove", onDocumentMouseOver);
    document.removeEventListener("mouseup", onDocumentMouseUp);
  }

  return (
    <img
      data-testid="knob"
      ref={componentRef}
      className="knob"
      src={KnobSvg}
      alt="Knob"
      style={{
        minHeight: minHeight,
        transform: `rotate(${currentRotationInDeg}deg)`
      }}
      onMouseDown={onImageMouseDown}
    />
  );
};

export default Knob;