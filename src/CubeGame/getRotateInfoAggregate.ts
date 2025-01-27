import {RotateInfo, SelectedFace} from "./commonDataStructs.ts";
import getRotateInfoForRowsAndColumns from "./getRotateInfoForRowsAndColumns.ts";
import getRotateInfoForEdgeFace from "./getRotateInfoForEdgeFace.ts";

const getRotateInfoAggregate = (swipeVertical: boolean, swipeNegative: boolean, gameSize: number, selectedFace: SelectedFace, faceIndex: number, x: number, y: number): RotateInfo | null => {
  return getRotateInfoForRowsAndColumns(swipeVertical, swipeNegative, gameSize, selectedFace, faceIndex, x, y) ||
    getRotateInfoForEdgeFace(swipeVertical, swipeNegative, gameSize, selectedFace, faceIndex, x, y);
}

export default getRotateInfoAggregate;