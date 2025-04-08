import * as React from "react";
import * as THREE from "three";

abstract class DraggableHandler {
  static readonly MOUSE_BUTTON_LEFT = 0;
  static readonly MOUSE_BUTTON_MIDDLE = 1;
  static readonly MOUSE_BUTTON_RIGHT = 2;

  trackingTouch: THREE.Vector2;

  constructor() {
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onTouchStart = this.onTouchStart.bind(this);

    this.onDocumentMouseOver = this.onDocumentMouseOver.bind(this);
    this.onTouchMove = this.onTouchMove.bind(this);

    this.onDocumentMouseUp = this.onDocumentMouseUp.bind(this);
    this.onTouchEnd = this.onTouchEnd.bind(this);

    this.trackingTouch = new THREE.Vector2(-100, -100);
  }

  // ----- DRAG START -----

  onMouseDown(event: React.MouseEvent<HTMLElement>) {
    if (event.button !== DraggableHandler.MOUSE_BUTTON_LEFT) {
      return;
    }

    if (!this.onMovementStart(event, event.clientX, event.clientY)) {
      return;
    }

    document.addEventListener("mousemove", this.onDocumentMouseOver, { passive: false });
    document.addEventListener("mouseup", this.onDocumentMouseUp, { passive: false });
  }

  onTouchStart(event: React.TouchEvent<HTMLElement>) {
    if (!event.touches) {
      return;
    }
    if (!this.onMovementStart(event, event.touches[0].clientX, event.touches[0].clientY)) {
      return;
    }

    this.trackingTouch.set(event.touches[0].clientX, event.touches[0].clientY);

    document.addEventListener("touchmove", this.onTouchMove, { passive: false });
    document.addEventListener("touchend", this.onTouchEnd, { passive: false });
  }

  // ----- DRAG MOVE -----

  onDocumentMouseOver(event: React.MouseEvent<Document>) {
    if (event.button !== DraggableHandler.MOUSE_BUTTON_LEFT) {
      return;
    }

    this.onMovementMove(event, event.clientX, event.clientY);
  }

  onTouchMove(event: React.TouchEvent<Document>) {
    if (!event.touches) {
      return;
    }
    this.onMovementMove(event, event.touches[0].clientX, event.touches[0].clientY);

    this.trackingTouch.set(event.touches[0].clientX, event.touches[0].clientY);
  }

  // ----- DRAG END -----

  onDocumentMouseUp(event: React.MouseEvent<Document>) {
    if (event.button !== DraggableHandler.MOUSE_BUTTON_LEFT) {
      return;
    }

    if (!this.onMovementEnd(event, event.clientX, event.clientY)) {
      return;
    }

    document.removeEventListener("mousemove", this.onDocumentMouseOver);
    document.removeEventListener("mouseup", this.onDocumentMouseUp);
  }

  onTouchEnd(event: React.TouchEvent<Document>) {
    if (!this.onMovementEnd(event, this.trackingTouch.x, this.trackingTouch.y)) {
      return;
    }

    document.removeEventListener("touchmove", this.onTouchMove);
    document.removeEventListener("touchend", this.onTouchEnd);
  }

  // ----- CALLBACKS -----

  abstract onMovementStart(event: React.UIEvent<Document>, pointX: number, pointY: number): boolean;

  abstract onMovementMove(event: React.UIEvent<Document>, pointX: number, pointY: number): boolean;

  abstract onMovementEnd(event: React.UIEvent<Document>, pointX: number, pointY: number): boolean;
}

export default DraggableHandler;