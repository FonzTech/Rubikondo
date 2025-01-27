export const isForFaceFx =
  (selectedFaceIndex: number) =>
    (...faces: number[]) => faces.includes(selectedFaceIndex);

export const getEdgeIndex =
  (gameSize: number): number =>
    gameSize - 1;
