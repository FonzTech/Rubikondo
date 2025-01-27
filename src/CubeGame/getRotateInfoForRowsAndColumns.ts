import * as THREE from "three";
import Utils from "../Utils/Utils.tsx";
import {RotateInfo, SelectedFace} from "./commonDataStructs.ts";
import {getEdgeIndex, isForFaceFx} from "./getRotateInfoCommon.ts";

const getRotateInfoForRowsAndColumns = (swipeVertical: boolean, swipeNegative: boolean, gameSize: number, selectedFace: SelectedFace, faceIndex: number, x: number, y: number): RotateInfo | null => {
  let sign = 0;
  let signFirst = 0;
  let axis = new THREE.Vector3(0, 0, 0);
  let axisFirst = new THREE.Vector3(0, 0, 0);

  const gs = getEdgeIndex(gameSize);

  const isForFace = isForFaceFx(selectedFace.faceIndex);

  /*
  ====================
  FRONT
  ====================
  */
  if (isForFace(
    Utils.CUBE_FACE_INDEX_FRONT
  )) {
    /*
    --------------------
    VERTICAL
    --------------------
    */
    if (swipeVertical) {
      switch (faceIndex) {

        case Utils.CUBE_FACE_INDEX_FRONT:
        case Utils.CUBE_FACE_INDEX_BOTTOM:
        case Utils.CUBE_FACE_INDEX_TOP:
          if (selectedFace.x !== x) {
            return null;
          }
          sign = 1;
          signFirst = 1;
          axis.set(1, 0, 0);
          axisFirst.set(1, 0, 0);
          break;

        case Utils.CUBE_FACE_INDEX_BACK:
          if (selectedFace.x !== gs - x) {
            return null;
          }
          sign = -1;
          signFirst = -1;
          axis.set(1, 0, 0);
          axisFirst.set(1, 0, 0);
          break;

        default:
          return null;
      }
    }
    /*
    --------------------
    HORIZONTAL
    --------------------
    */
    else {
      switch (faceIndex) {

        case Utils.CUBE_FACE_INDEX_FRONT:
        case Utils.CUBE_FACE_INDEX_RIGHT:
        case Utils.CUBE_FACE_INDEX_BACK:
        case Utils.CUBE_FACE_INDEX_LEFT:
          if (selectedFace.y !== y) {
            return null;
          }
          sign = 1;
          signFirst = 1;
          axis.set(0, 1, 0);
          axisFirst.set(0, 1, 0);
          break;

        default:
          return null;
      }
    }
  }
  /*
  ====================
  LEFT
  ====================
  */
  else if (isForFace(
    Utils.CUBE_FACE_INDEX_LEFT
  )) {
    /*
    --------------------
    VERTICAL
    --------------------
    */
    if (swipeVertical) {
      switch (faceIndex) {

        case Utils.CUBE_FACE_INDEX_TOP:
          if (selectedFace.x !== gs - y) {
            return null;
          }
          sign = -1;
          signFirst = -1;
          axis.set(0, 1, 0);
          axisFirst.set(0, 0, 1);
          break;

        case Utils.CUBE_FACE_INDEX_BOTTOM:
          if (selectedFace.x !== y) {
            return null;
          }
          sign = 1;
          signFirst = 1;
          axis.set(0, 1, 0);
          axisFirst.set(0, 0, 1);
          break;

        case Utils.CUBE_FACE_INDEX_RIGHT:
          if (selectedFace.x !== gs - x) {
            return null;
          }
          sign = -1;
          signFirst = -1;
          axis.set(1, 0, 0);
          axisFirst.set(0, 0, 1);
          break;

        case Utils.CUBE_FACE_INDEX_LEFT:
          if (selectedFace.x !== x) {
            return null;
          }
          sign = 1;
          signFirst = 1;
          axis.set(1, 0, 0);
          axisFirst.set(0, 0, 1);
          break;

        default:
          return null;
      }
    }
    /*
    --------------------
    HORIZONTAL
    --------------------
    */
    else {
      switch (faceIndex) {

        case Utils.CUBE_FACE_INDEX_FRONT:
        case Utils.CUBE_FACE_INDEX_RIGHT:
        case Utils.CUBE_FACE_INDEX_BACK:
        case Utils.CUBE_FACE_INDEX_LEFT:
          if (selectedFace.y !== y) {
            return null;
          }
          sign = 1;
          signFirst = 1;
          axis.set(0, 1, 0);
          axisFirst.set(0, 1, 0);
          break;

        default:
          return null;
      }
    }
  }
  /*
  ====================
  RIGHT
  ====================
  */
  else if (isForFace(
    Utils.CUBE_FACE_INDEX_RIGHT
  )) {
    /*
    --------------------
    VERTICAL
    --------------------
    */
    if (swipeVertical) {
      switch (faceIndex) {

        case Utils.CUBE_FACE_INDEX_TOP:
          if (selectedFace.x !== y) {
            return null;
          }
          sign = 1;
          signFirst = -1;
          axis.set(0, 1, 0);
          axisFirst.set(0, 0, 1);
          break;

        case Utils.CUBE_FACE_INDEX_BOTTOM:
          if (selectedFace.x !== gs - y) {
            return null;
          }
          sign = -1;
          signFirst = 1;
          axis.set(0, 1, 0);
          axisFirst.set(0, 0, 1);
          break;

        case Utils.CUBE_FACE_INDEX_RIGHT:
          if (selectedFace.x !== x) {
            return null;
          }
          sign = 1;
          signFirst = -1;
          axis.set(1, 0, 0);
          axisFirst.set(0, 0, 1);
          break;

        case Utils.CUBE_FACE_INDEX_LEFT:
          if (selectedFace.x !== gs - x) {
            return null;
          }
          sign = -1;
          signFirst = 1;
          axis.set(1, 0, 0);
          axisFirst.set(0, 0, 1);
          break;

        default:
          return null;
      }
    }
    /*
    --------------------
    HORIZONTAL
    --------------------
    */
    else {
      switch (faceIndex) {

        case Utils.CUBE_FACE_INDEX_FRONT:
        case Utils.CUBE_FACE_INDEX_RIGHT:
        case Utils.CUBE_FACE_INDEX_BACK:
        case Utils.CUBE_FACE_INDEX_LEFT:
          if (selectedFace.y !== y) {
            return null;
          }
          sign = 1;
          signFirst = 1;
          axis.set(0, 1, 0);
          axisFirst.set(0, 1, 0);
          break;

        default:
          return null;
      }
    }
  }
  /*
  ====================
  TOP
  ====================
  */
  else if (isForFace(
    Utils.CUBE_FACE_INDEX_TOP
  )) {
    /*
    --------------------
    VERTICAL
    --------------------
    */
    if (swipeVertical) {
      switch (faceIndex) {

        case Utils.CUBE_FACE_INDEX_FRONT:
        case Utils.CUBE_FACE_INDEX_BOTTOM:
        case Utils.CUBE_FACE_INDEX_TOP:
          if (selectedFace.x !== x) {
            return null;
          }
          sign = 1;
          signFirst = 1;
          axis.set(1, 0, 0);
          axisFirst.set(1, 0, 0);
          break;

        case Utils.CUBE_FACE_INDEX_BACK:
          if (selectedFace.x !== gs - x) {
            return null;
          }
          sign = -1;
          signFirst = -1;
          axis.set(1, 0, 0);
          axisFirst.set(1, 0, 0);
          break;

        default:
          return null;
      }
    }
    /*
    --------------------
    HORIZONTAL
    --------------------
    */
    else {
      switch (faceIndex) {

        case Utils.CUBE_FACE_INDEX_TOP:
          if (selectedFace.y !== y) {
            return null;
          }
          sign = 1;
          signFirst = -1;
          axis.set(0, 1, 0);
          axisFirst.set(0, 0, 1);
          break;

        case Utils.CUBE_FACE_INDEX_BOTTOM:
          if (selectedFace.y !== gs - y) {
            return null;
          }
          sign = -1;
          signFirst = 1;
          axis.set(0, 1, 0);
          axisFirst.set(0, 0, 1);
          break;

        case Utils.CUBE_FACE_INDEX_LEFT:
          if (selectedFace.y !== gs - x) {
            return null;
          }
          sign = -1;
          signFirst = 1;
          axis.set(1, 0, 0);
          axisFirst.set(0, 0, 1);
          break;

        case Utils.CUBE_FACE_INDEX_RIGHT:
          if (selectedFace.y !== x) {
            return null;
          }
          sign = 1;
          signFirst = -1;
          axis.set(1, 0, 0);
          axisFirst.set(0, 0, 1);
          break;

        default:
          return null;
      }
    }
  }
  /*
  ====================
  BACK
  ====================
  */
  else if (isForFace(
    Utils.CUBE_FACE_INDEX_BACK
  )) {
    /*
    --------------------
    VERTICAL
    --------------------
    */
    if (swipeVertical) {
      switch (faceIndex) {

        case Utils.CUBE_FACE_INDEX_FRONT:
        case Utils.CUBE_FACE_INDEX_BOTTOM:
        case Utils.CUBE_FACE_INDEX_TOP:
          if (selectedFace.x !== gs - x) {
            return null;
          }
          sign = -1;
          signFirst = 1;
          axis.set(1, 0, 0);
          axisFirst.set(1, 0, 0);
          break;

        case Utils.CUBE_FACE_INDEX_BACK:
          if (selectedFace.x !== x) {
            return null;
          }
          sign = 1;
          signFirst = -1;
          axis.set(1, 0, 0);
          axisFirst.set(1, 0, 0);
          break;

        default:
          return null;
      }
    }
    /*
    --------------------
    HORIZONTAL
    --------------------
    */
    else {
      switch (faceIndex) {

        case Utils.CUBE_FACE_INDEX_FRONT:
        case Utils.CUBE_FACE_INDEX_RIGHT:
        case Utils.CUBE_FACE_INDEX_BACK:
        case Utils.CUBE_FACE_INDEX_LEFT:
          if (selectedFace.y !== y) {
            return null;
          }
          sign = 1;
          signFirst = 1;
          axis.set(0, 1, 0);
          axisFirst.set(0, 1, 0);
          break;

        default:
          return null;
      }
    }
  }
  /*
  ====================
  BOTTOM
  ====================
  */
  else if (isForFace(
    Utils.CUBE_FACE_INDEX_BOTTOM
  )) {
    /*
    --------------------
    VERTICAL
    --------------------
    */
    if (swipeVertical) {
      switch (faceIndex) {

        case Utils.CUBE_FACE_INDEX_FRONT:
        case Utils.CUBE_FACE_INDEX_BOTTOM:
        case Utils.CUBE_FACE_INDEX_TOP:
          if (selectedFace.x !== x) {
            return null;
          }
          sign = 1;
          signFirst = 1;
          axis.set(1, 0, 0);
          axisFirst.set(1, 0, 0);
          break;

        case Utils.CUBE_FACE_INDEX_BACK:
          if (selectedFace.x !== gs - x) {
            return null;
          }
          sign = -1;
          signFirst = -1;
          axis.set(1, 0, 0);
          axisFirst.set(1, 0, 0);
          break;

        default:
          return null;
      }
    }
    /*
    --------------------
    HORIZONTAL
    --------------------
    */
    else {
      switch (faceIndex) {

        case Utils.CUBE_FACE_INDEX_TOP:
          if (selectedFace.y !== gs - y) {
            return null;
          }
          sign = -1;
          signFirst = -1;
          axis.set(0, 1, 0);
          axisFirst.set(0, 0, 1);
          break;

        case Utils.CUBE_FACE_INDEX_BOTTOM:
          if (selectedFace.y !== y) {
            return null;
          }
          sign = 1;
          signFirst = 1;
          axis.set(0, 1, 0);
          axisFirst.set(0, 0, 1);
          break;

        case Utils.CUBE_FACE_INDEX_LEFT:
          if (selectedFace.y !== x) {
            return null;
          }
          sign = 1;
          signFirst = 1;
          axis.set(1, 0, 0);
          axisFirst.set(0, 0, 1);
          break;

        case Utils.CUBE_FACE_INDEX_RIGHT:
          if (selectedFace.y !== gs - x) {
            return null;
          }
          sign = -1;
          signFirst = -1;
          axis.set(1, 0, 0);
          axisFirst.set(0, 0, 1);
          break;

        default:
          return null;
      }
    }
  }
  /*
  ====================
  UNRECOGNIZED FACE
  ====================
  */
  else {
    throw `Unrecognized face index ${selectedFace.faceIndex}`;
  }

  return {
    sign: swipeNegative ? -sign : sign,
    signFirst: signFirst,
    axis: axis,
    axisFirst: axisFirst
  };
}

export default getRotateInfoForRowsAndColumns;