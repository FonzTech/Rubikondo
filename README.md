# Rubikondo
## Rubik's Cube Browser Game

This is a project to show my capabilities as a front-end engineer and game developer!! :)

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