import * as THREE from "three";
import Utils from "../Utils/Utils.tsx";
import {RotateInfo, SelectedFace} from "./commonDataStructs.ts";
import {getEdgeIndex, isForFaceFx} from "./getRotateInfoCommon.ts";

const getRotateInfoForEdgeFace = (swipeVertical: boolean, swipeNegative: boolean, gameSize: number, selectedFace: SelectedFace, faceIndex: number, x: number, y: number): RotateInfo | null => {
  let sign = 0;
  let signFirst = 0;
  let axis = new THREE.Vector3(0, 0, 0);
  let axisFirst = new THREE.Vector3(0, 0, 0);

  const gs = getEdgeIndex(gameSize);

  const isForFace = isForFaceFx(selectedFace.faceIndex);

  const isAtEdgeStart = (component: number) => component === 0;
  const isAtEdgeEnd = (component: number) => component === gs;

  const isCurrentFaceEqualTo = (_fi: number) => faceIndex == _fi;

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
      /*
      --------------------
      START
      --------------------
      */
      if (
        isAtEdgeStart(selectedFace.x) &&
        isCurrentFaceEqualTo(Utils.CUBE_FACE_INDEX_LEFT)
      ) {
        sign = -1;
        signFirst = -1;
        axis.set(0, 0, 1);
        axisFirst.set(1, 0, 0);
      }
      /*
      --------------------
      END
      --------------------
      */
      else if (
        isAtEdgeEnd(selectedFace.x) &&
        isCurrentFaceEqualTo(Utils.CUBE_FACE_INDEX_RIGHT)
      ) {
        sign = 1;
        signFirst = 1;
        axis.set(0, 0, 1);
        axisFirst.set(1, 0, 0);
      }
    }
    /*
    --------------------
    HORIZONTAL
    --------------------
    */
    else {
      /*
      --------------------
      START
      --------------------
      */
      if (
        isAtEdgeStart(selectedFace.y) &&
        isCurrentFaceEqualTo(Utils.CUBE_FACE_INDEX_BOTTOM)
      ) {
        sign = -1;
        signFirst = -1;
        axis.set(0, 0, 1);
        axisFirst.set(0, 1, 0);
      }
      /*
      --------------------
      END
      --------------------
      */
      else if (
        isAtEdgeEnd(selectedFace.y) &&
        isCurrentFaceEqualTo(Utils.CUBE_FACE_INDEX_TOP)
      ) {
        sign = 1;
        signFirst = 1;
        axis.set(0, 0, 1);
        axisFirst.set(0, 1, 0);
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
    return null;
  }
  /*
  ====================
  RIGHT
  ====================
  */
  else if (isForFace(
    Utils.CUBE_FACE_INDEX_RIGHT
  )) {
    return null;
  }
  /*
  ====================
  TOP
  ====================
  */
  else if (isForFace(
    Utils.CUBE_FACE_INDEX_TOP
  )) {
    return null;
  }
  /*
  ====================
  BACK
  ====================
  */
  else if (isForFace(
    Utils.CUBE_FACE_INDEX_BACK
  )) {
    return null;
  }
  /*
  ====================
  BOTTOM
  ====================
  */
  else if (isForFace(
    Utils.CUBE_FACE_INDEX_BOTTOM
  )) {
    return null;
  }
  /*
  ====================
  UNRECOGNIZED FACE
  ====================
  */
  else {
    // throw `Unrecognized face index ${selectedFace.faceIndex}`;
    return null;
  }

  return {
    sign: swipeNegative ? -sign : sign,
    signFirst: signFirst,
    axis: axis,
    axisFirst: axisFirst
  };
}

export default getRotateInfoForEdgeFace;