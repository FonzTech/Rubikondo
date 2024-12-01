import * as THREE from "three";

class Utils {
  static readonly MESH_CUBE_PATH = "/cube.obj";
  static readonly TEXTURE_CUBE_PATH = "/cube.png";

  static readonly DEFAULT_GAME_SIZE = 3;

  static readonly CUBE_FACE_INDEX_FRONT = 0;
  static readonly CUBE_FACE_INDEX_RIGHT = 1;
  static readonly CUBE_FACE_INDEX_LEFT = 2;
  static readonly CUBE_FACE_INDEX_BACK = 3;
  static readonly CUBE_FACE_INDEX_TOP = 4;
  static readonly CUBE_FACE_INDEX_BOTTOM = 5;

  static readonly CUBE_COLOR_BLACK = THREE.Color.NAMES.black;
  static readonly CUBE_COLOR_WHITE = THREE.Color.NAMES.white;
  static readonly CUBE_COLOR_ORANGE = THREE.Color.NAMES.orange;
  static readonly CUBE_COLOR_GREEN = THREE.Color.NAMES.lime;
  static readonly CUBE_COLOR_RED = THREE.Color.NAMES.red;
  static readonly CUBE_COLOR_BLUE = THREE.Color.NAMES.skyblue;
  static readonly CUBE_COLOR_YELLOW = THREE.Color.NAMES.yellow;

  static readonly CUBE_VERTEX_SHADER = `
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec2 vUv;
    
    void main() {
        vNormal = normalize(normalMatrix * normal);
        vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
        vUv = uv;
        
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }`;

  static readonly CUBE_FRAGMENT_SHADER = `
    uniform vec3 uLightPosition;
    uniform vec3 uLightColor;
    uniform vec3 uFaceColor;
    uniform sampler2D uTexture;
    
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec2 vUv;
    
    void main() {
        // Normalize light direction
        vec3 lightDir = normalize(uLightPosition - vPosition);
    
        // Calculate diffuse lighting
        float diff = max(dot(vNormal, lightDir), 0.0);
    
        // Texturize and Combine light color and texture color
        vec4 objectColor = texture2D(uTexture, vUv);
        vec3 diffuse = diff * uLightColor * objectColor.rgb * uFaceColor;
    
        gl_FragColor = vec4(diffuse, 1.0);
    }`;

  static getMaterialForCube(lightPosition: THREE.Vector3, texture: THREE.Texture, faceColor: THREE.Color): THREE.ShaderMaterial {
    return new THREE.ShaderMaterial({
      vertexShader: Utils.CUBE_VERTEX_SHADER,
      fragmentShader: Utils.CUBE_FRAGMENT_SHADER,
      uniforms: {
        uLightPosition: { value: lightPosition },
        uLightColor: { value: new THREE.Color(1, 1, 1) },
        uFaceColor: { value: faceColor },
        uTexture: { value: texture }
      },
    });
  }
}

export default Utils;