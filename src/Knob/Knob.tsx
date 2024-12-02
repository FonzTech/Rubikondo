import * as React from 'react'
import './Knob.css';
import KnobSvg from "../assets/knob.svg";
import {UIEvent, useEffect, useRef, useState} from "react";
import * as THREE from "three";

interface KnobProps {
  minHeight: string
  startingRotation: number,
  rotateCallback: (value: number) => void | null
}

const ANGLE_BOUNDARY_LEFT: Readonly<number> = THREE.MathUtils.degToRad(135);
const ANGLE_BOUNDARY_RIGHT: Readonly<number> = THREE.MathUtils.degToRad(45);
const ANGLE_BOUNDARY_CENTER: Readonly<number> = THREE.MathUtils.degToRad(90);

const ANGLE_BOUNDARY_ROUNDTRIP: Readonly<number> = THREE.MathUtils.degToRad(225);
const ANGLE_BOUNDARY_MAX: Readonly<number> = THREE.MathUtils.degToRad(270);

const MIN_CALLBACK_VALUE: Readonly<number> = 2;
const STEP_CALLBACK_VALUE: Readonly<number> = 6;

const Knob: React.FC<KnobProps> = ({
  minHeight = "64px",
  startingRotation = 3,
  rotateCallback = null
}) => {
  const componentRef = useRef<HTMLImageElement | null>(null);

  const startRotation = useRef<number>(THREE.MathUtils.degToRad(startingRotation));
  const currentRotationInRad = useRef<number>(startRotation.current!);
  const [currentRotationInDeg, setCurrentRotationInDeg] = useState<string>(THREE.MathUtils.radToDeg(startRotation.current!).toFixed(2));

  const centerPoint = useRef<THREE.Vector2 | null>(null);
  const startPoint = useRef<THREE.Vector2 | null>(null);
  const currentPoint = useRef<THREE.Vector2 | null>(null);

  const getValueForCallback = (radians: number): number => {
    const theta = radians < ANGLE_BOUNDARY_LEFT ? radians + ANGLE_BOUNDARY_ROUNDTRIP : (radians - ANGLE_BOUNDARY_LEFT);
    return Math.round(MIN_CALLBACK_VALUE + theta / ANGLE_BOUNDARY_MAX * STEP_CALLBACK_VALUE);
  };

  // ----- DRAG START -----

  const onMovementStart = (event: React.UIEvent<HTMLImageElement>, pointX: number, pointY: number): boolean => {
    if (componentRef.current === null) {
      return false;
    }
    event.preventDefault();

    startRotation.current = currentRotationInRad.current;

    startPoint.current = new THREE.Vector2(pointX, pointY);

    const componentRect = componentRef.current!.getBoundingClientRect();
    centerPoint.current = new THREE.Vector2(
      componentRect.x + componentRect.width / 2,
      componentRect.y + componentRect.height / 2,
    );

    return true;
  };

  const onImageMouseDown = (event: React.MouseEvent<HTMLImageElement>) => {
    if (!onMovementStart(event, event.clientX, event.clientY)) {
      return;
    }

    document.addEventListener("mousemove", onDocumentMouseOver);
    document.addEventListener("mouseup", onDocumentMouseUp);
  };

  const onTouchStart = (event: React.TouchEvent<HTMLImageElement>) => {
    if (!event.touches) {
      return;
    }
    if (!onMovementStart(event, event.touches[0].clientX, event.touches[0].clientY)) {
      return;
    }

    document.addEventListener("touchmove", onTouchMove);
    document.addEventListener("touchend", onTouchEnd);
  };

  // ----- DRAG MOVEMENT -----

  const onMovementMove = (event: React.UIEvent<Document>, pointX: number, pointY: number) => {
    if (centerPoint.current === null) {
      return false;
    }
    event.preventDefault();

    currentPoint.current = new THREE.Vector2(pointX, pointY);

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

    // Call callback, if possible
    if (rotateCallback !== null) {
      const value = getValueForCallback(viewAngle);
      rotateCallback(value);
    }

    return true;
  };

  const onDocumentMouseOver = (event: React.MouseEvent<Document>) => {
    onMovementMove(event, event.clientX, event.clientY);
  };

  const onTouchMove = (event: React.TouchEvent<Document>) => {
    if (!event.touches) {
      return;
    }
    onMovementMove(event, event.touches[0].clientX, event.touches[0].clientY);
  };

  // ----- DRAG END -----

  const onMovementEnd = (event: React.UIEvent<Document>) => {
    if (centerPoint.current === null) {
      return false;
    }
    event.preventDefault();

    centerPoint.current = null;

    return true;
  };

  const onDocumentMouseUp = (event: React.MouseEvent<Document>) => {
    if (!onMovementEnd(event)) {
      return;
    }

    document.removeEventListener("mousemove", onDocumentMouseOver);
    document.removeEventListener("mouseup", onDocumentMouseUp);
  };

  const onTouchEnd = (event: React.MouseEvent<Document>) => {
    if (!onMovementEnd(event)) {
      return;
    }

    document.removeEventListener("touchmove", onTouchMove, { passive: false });
    document.removeEventListener("touchend", onTouchEnd);
  };

  useEffect(() => {
    componentRef.current?.addEventListener("mousedown", onImageMouseDown);
    componentRef.current?.addEventListener("touchstart", onTouchStart, { passive: false });

    return () => {
      componentRef.current?.removeEventListener("mousedown", onImageMouseDown);
      componentRef.current?.removeEventListener("touchstart", onTouchStart);
    };
  }, []);

  return (
    <img
      data-testid="knob"
      ref={componentRef}
      className="knob"
      src={KnobSvg}
      alt="Knob"
      style={{
        touchAction: "none",
        minHeight: minHeight,
        transform: `rotate(${currentRotationInDeg}deg)`
      }}
    />
  );
};

export default Knob;