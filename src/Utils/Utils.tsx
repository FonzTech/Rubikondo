class Utils {
  static MESH_CUBE_PATH = "/cube.obj";
  static TEXTURE_CUBE_PATH = "/cube.png";

  static setInMapIfNotExist(inputMap: Map<any, any>, key: any, value: any) {
    if (inputMap.get(key) === undefined) {
      inputMap.set(key, value);
    }
  }
}

export default Utils;