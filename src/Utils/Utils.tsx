import * as THREE from "three";

class Utils {
  static readonly MESH_CUBE_PATH = "/cube.obj";
  static readonly TEXTURE_CUBE_PATH = "/cube.png";

  static readonly DEFAULT_GAME_SIZE = 3;

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
    uniform vec3 lightPosition;
    uniform vec3 lightColor;
    uniform sampler2D uTexture;
    
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec2 vUv;
    
    void main() {
        // Normalize light direction
        vec3 lightDir = normalize(lightPosition - vPosition);
    
        // Calculate diffuse lighting
        float diff = max(dot(vNormal, lightDir), 0.0);
    
        // Combine light color and texture color
        vec4 objectColor = texture2D(uTexture, vUv);
        vec3 diffuse = diff * lightColor * objectColor.rgb;
    
        gl_FragColor = vec4(diffuse, 1.0);
    }`;

  static getMaterialForCube(lightPosition: THREE.Vector3, texture: THREE.Texture): THREE.ShaderMaterial {
    return new THREE.ShaderMaterial({
      vertexShader: Utils.CUBE_VERTEX_SHADER,
      fragmentShader: Utils.CUBE_FRAGMENT_SHADER,
      uniforms: {
        lightPosition: { value: lightPosition },
        lightColor: { value: new THREE.Color(1, 1, 1) },
        uTexture: { value: texture }
      },
    });
  }
}

export default Utils;