# Rubikondo
## Rubik's Cube Browser Game

This is a project to show my capabilities as a front-end engineer and game developer!! :)

Build on Node `v20.12.0` and NPM `10.5.0`

### Cube Model and Texture

Cube's texture is composed of six "main faces", formed by 2x3 squares.

Starting from left-top most, and counting from left to right, row by row,
we have a match between index, face direction and a fixed gray-scale color, used
by fragment shader to colorize the face accordingly:
- 0 -> Front -> 255
- 1 -> Right -> 224
- 2 -> Left -> 192
- 3 -> Back -> 160
- 4 -> Top -> 128
- 5 -> Bottom -> 96

### Environment variables
- `VITE_APP_HASH_ROUTER`, use `HashRouter` instead of `BrowserRouter`. Useful for GitHub Pages.
- `VITE_APP_DEBUG`, behaves the same when `NODE_ENV === "test"`, to trigger some debugging measures, like console logging and visual eyecandy for debugging purposes.
- `VITE_APP_FIXED_CUBE`, to spawn the Rubik Cube always with the same color on a given face. Basically, the Cube is already completed when game is started.
