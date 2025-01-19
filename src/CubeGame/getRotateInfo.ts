import * as THREE from "three";
import Utils from "../Utils/Utils.tsx";
import {RotateInfo, SelectedFace} from "./commonDataStructs.ts";

const getRotateInfo = (swipeVertical: boolean, swipeNegative: boolean, gameSize: number, selectedFace: SelectedFace, faceIndex: number, x: number, y: number): RotateInfo | null => {
  let sign = 0;
  let signFirst = 0;
  let axis = new THREE.Vector3(0, 0, 0);
  let axisFirst = new THREE.Vector3(0, 0, 0);

  const gs = gameSize - 1;

  const _isForFace =
    (...faces: number[]): boolean =>
      faces.includes(selectedFace.faceIndex);

  /*
  ====================
  FRONT
  ====================
  */
  if (_isForFace(
    Utils.CUBE_FACE_INDEX_FRONT
  )) {
    /*7
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
          if (swipeVertical) {
            if (selectedFace.x !== gs - x) {
              return null;
            }
          } else if (selectedFace.y !== gs - y) {
            return null;
          }
          sign = -1;
          signFirst = 1;
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
      }
    }
  }
  /*
  ====================
  RIGHT
  ====================
  */
  else if (_isForFace(
    Utils.CUBE_FACE_INDEX_RIGHT
  )) {
    console.error("TODO HEREEE");
    /*
    --------------------
    VERTICAL
    --------------------
    */
    if (swipeVertical) {
      switch (faceIndex) {

        case Utils.CUBE_FACE_INDEX_RIGHT:
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

        case Utils.CUBE_FACE_INDEX_LEFT:
          if (swipeVertical) {
            if (selectedFace.x !== gs - x) {
              return null;
            }
          } else if (selectedFace.y !== gs - y) {
            return null;
          }
          sign = -1;
          signFirst = 1;
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
      }
    }
  }
  /*
  ====================
  TOP
  ====================
  */
  else if (_isForFace(
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
          if (swipeVertical) {
            if (selectedFace.x !== gs - x) {
              return null;
            }
          } else if (selectedFace.y !== gs - y) {
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
      }
    }
  }
  /*
  ====================
  BACK
  ====================
  */
  else if (_isForFace(
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
      }
    }
  }
  /*
  ====================
  BOTTOM
  ====================
  */
  else if (_isForFace(
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
          if (swipeVertical) {
            if (selectedFace.x !== gs - x) {
              return null;
            }
          } else if (selectedFace.y !== gs - y) {
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
      }
    }
  }

  return {
    sign: swipeNegative ? -sign : sign,
    signFirst: signFirst,
    axis: axis,
    axisFirst: axisFirst
  };
}

export default getRotateInfo;