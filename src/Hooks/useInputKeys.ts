import {useState} from "react";

export const IsKeyPressedNullAction = (key: string): void => console.log(`Check Key ${key}`);

export const useInputKeys = (sourceNode: Node) => {
  const [ inputKeys, setInputKeys ] = useState<Map<string, boolean>>(new Map<string, boolean>());

  const _pressedKeyCallback = (event: KeyboardEvent) => {
    setInputKeys(inputKeys.set(event.key, true));
  };

  const _releaseKeyCallback = (event: KeyboardEvent) => {
    setInputKeys(inputKeys.set(event.key, false));
  };

  const setupFunc = () => {
    sourceNode.addEventListener("keydown", _pressedKeyCallback);
    sourceNode.addEventListener("keyup", _releaseKeyCallback);
  };

  const cleanUpFunc = () => {
    sourceNode.removeEventListener("keydown", _pressedKeyCallback);
    sourceNode.removeEventListener("keyup", _releaseKeyCallback);
  };

  const isKeyPressed =
    (key: string): boolean =>
      inputKeys.get(key) === true;

  return [isKeyPressed, setupFunc, cleanUpFunc];
}