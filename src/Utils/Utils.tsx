import * as THREE from "three";

class Utils {
  static readonly IS_DEBUG = process.env.NODE_ENV === "test" || import.meta.env.VITE_APP_DEBUG === "true";
  static readonly RANDOMIZE_CUBE = import.meta.env.VITE_APP_FIXED_CUBE !== "true";
  static readonly HASH_ROUTER = import.meta.env.VITE_APP_HASH_ROUTER === "true";

  static readonly MESH_CUBE_PATH = "./cube.obj";
  static readonly TEXTURE_CUBE_PATH = "./cube.png";

  static readonly DEFAULT_GAME_SIZE = 3;

  static readonly CUBE_FACE_INDEX_FRONT = 0;
  static readonly CUBE_FACE_INDEX_RIGHT = 1;
  static readonly CUBE_FACE_INDEX_BACK = 2;
  static readonly CUBE_FACE_INDEX_LEFT = 3;
  static readonly CUBE_FACE_INDEX_BOTTOM = 4;
  static readonly CUBE_FACE_INDEX_TOP = 5;

  static readonly CUBE_FACE_HORIZONTALS = [
    Utils.CUBE_FACE_INDEX_FRONT,
    Utils.CUBE_FACE_INDEX_RIGHT,
    Utils.CUBE_FACE_INDEX_BACK,
    Utils.CUBE_FACE_INDEX_LEFT
  ];

  static readonly CUBE_COLOR_BLACK = new THREE.Color(THREE.Color.NAMES.black);
  static readonly CUBE_COLOR_WHITE = new THREE.Color(THREE.Color.NAMES.white);
  static readonly CUBE_COLOR_ORANGE = new THREE.Color(THREE.Color.NAMES.orange);
  static readonly CUBE_COLOR_GREEN = new THREE.Color(THREE.Color.NAMES.lime);
  static readonly CUBE_COLOR_RED = new THREE.Color(THREE.Color.NAMES.red);
  static readonly CUBE_COLOR_BLUE = new THREE.Color(THREE.Color.NAMES.skyblue);
  static readonly CUBE_COLOR_YELLOW = new THREE.Color(THREE.Color.NAMES.yellow);

  static readonly VIEW_VECTOR = new THREE.Vector3(0, 0, 1);

  static readonly HALF_PI = Math.PI * 0.5;
  static readonly DOUBLE_PI = Math.PI * 2.0;
  static readonly ONE_AND_HALF_PI = Math.PI * 1.5;

  static readonly CUBE_KEY_PREFIX = "Cube";

  static readonly CUBE_VERTEX_SHADER = `
    #define _DEBUG ${Utils.IS_DEBUG ? 1 : 0}
    
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec2 vUv;
    
    void main() {
        vNormal = normalize(normalMatrix * normal);
        vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
        vUv = uv;
        
        vec4 fPosition = vec4(position, 1.0);
        
        #if _DEBUG == 1
        fPosition.xyz = fPosition.xyz * 0.5;
        #endif
        
        gl_Position = projectionMatrix * modelViewMatrix * fPosition;
    }`;

  static readonly CUBE_FRAGMENT_SHADER = `
    #define _DEBUG 0
     
    uniform vec3 uLightPosition;
    uniform vec3 uLightColor;
    uniform vec3 uFaceColor;
    uniform sampler2D uTexture;
    
    uniform float uSelected;
    uniform float uSelectedAnim;
    
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec2 vUv;
    
    const vec3 SELECTED_COLOR = vec3(1.0);
    
    void main() {
        // Normalize light direction
        vec3 lightDir = normalize(uLightPosition - vPosition);
    
        // Calculate diffuse lighting
        float diff = max(dot(vNormal, lightDir), 0.0);
    
        // Texturize and Combine light color and texture color
        vec4 objectColor = texture2D(uTexture, vUv);
        
        float _aus = min(uSelected * 2.0, 1.0);
        
        #if _DEBUG == 1
        float _v = 1.0;
        vec3 albedo = mix(objectColor.rgb * uFaceColor, SELECTED_COLOR, _aus * uSelectedAnim);
        if (uSelected > 0.75) {
          albedo.rgb = vec3(1.0, 0.0, 1.0);
        }
        vec3 diffuse = albedo;
        #else
        vec3 albedo = mix(objectColor.rgb * uFaceColor, SELECTED_COLOR, _aus * sin(uSelectedAnim));
        vec3 diffuse = albedo * diff * uLightColor;
        #endif
    
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
        uTexture: { value: texture },
        uSelected: { value: 0.0 },
        uSelectedAnim: { value: 0.0 }
      },
    });
  }

  static isDev(): boolean {
    return [
      "development",
      "test"
    ].includes(process.env.NODE_ENV);
  }

  static getAxesLength(): number {
    return Utils.isDev() ? 15 : 0;
  }

  static getAssetBasePath(): string {
    return window.location.origin + window.location.pathname;
  }

  static getCubeKey(faceIndex: number, x: number, y: number): string {
    return `${faceIndex}_${x}_${y}`;
  }

  static getCubeKeyPrefix(): string {
    return Utils.CUBE_KEY_PREFIX + "_";
  }

  static getCubeKeyForGame(faceIndex: number, x: number, y: number): string {
    return Utils.getCubeKeyPrefix() + Utils.getCubeKey(faceIndex, x, y);
  }

  static getComponentsFromCubeKey(value: string): number[] {
    return value.split("_")
      .filter(v => v !== Utils.CUBE_KEY_PREFIX)
      .map(v => parseInt(v));
  }

  // istanbul ignore next
  static generateCubeTextureForDebug(baseTexture: THREE.Texture, text: string): THREE.CanvasTexture {
    // Create a canvas to draw on
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error("Could not get canvas context");
    }

    // Set the size of the canvas
    canvas.width = 128;
    canvas.height = 128;

    // Draw the base image onto the canvas first
    ctx.drawImage(baseTexture.image, 0, 0, canvas.width, canvas.height);

    // Set text styles
    ctx.font = '12px sans-serif';
    ctx.fillStyle = 'black';

    // Draw the text on the canvas
    ctx.fillText(text, 30, 50);

    // Update the texture with the new canvas content
    // document.body.appendChild(canvas);
    const dynamicTexture = new THREE.CanvasTexture(canvas);
    dynamicTexture.needsUpdate = true;
    return dynamicTexture;
  }

  static rotateAroundPoint = (object: THREE.Group<THREE.Object3DEventMap>, point: THREE.Vector3, axis: THREE.Vector3, angle: number, firstAxis: THREE.Vector3, firstSign: number = 1) => {
    const offset = new THREE.Vector3().subVectors(object.position, point);
    offset.applyAxisAngle(firstAxis, angle * firstSign);
    object.position.copy(point).add(offset);
    object.rotateOnAxis(axis, angle);
  }

  static isTouchAvailable(): boolean {
    return "ontouchstart" in window || navigator.maxTouchPoints > 0;
  }

  // istanbul ignore next
  static spawnDebugSphere = (position: THREE.Vector3, group: THREE.Group, color = 0xff0000, size = 0.1): THREE.Mesh<any> => {
    const geometry = new THREE.SphereGeometry(size, 16, 16); // Small sphere
    const material = new THREE.MeshBasicMaterial({ color: color });
    const sphere = new THREE.Mesh(geometry, material);

    sphere.position.copy(position); // Set position
    group.add(sphere); // Add to group

    return sphere;
  }
}

export default Utils;