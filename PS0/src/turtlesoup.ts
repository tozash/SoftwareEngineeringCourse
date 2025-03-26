import { Turtle, SimpleTurtle, Point, Color } from "./turtle";
import * as fs from "fs";
import { execSync } from "child_process";

/**
 * A collection of geometric and artistic functions for turtle graphics.
 */

// Geometric Constants
const DEGREES_IN_CIRCLE = 360;
const RIGHT_ANGLE = 90;

/**
 * Draws a square of the given side length using the turtle.
 * @param turtle The turtle to use for drawing.
 * @param sideLength The length of each side of the square in pixels.
 */
export function drawSquare(turtle: Turtle, sideLength: number): void {
  for (let i = 0; i < 4; i++) {
    turtle.forward(sideLength);
    turtle.turn(RIGHT_ANGLE);
  }
}

/**
 * Calculates the length of a chord of a circle.
 * @param radius Radius of the circle.
 * @param angleInDegrees Angle subtended by the chord at the center of the circle (in degrees).
 * @returns The length of the chord.
 */
export function chordLength(radius: number, angleInDegrees: number): number {
  const angleInRadians = (angleInDegrees * Math.PI) / DEGREES_IN_CIRCLE;
  const halfAngle = angleInRadians / 2;
  const rawValue = 2 * radius * Math.sin(halfAngle);
  return Math.round(rawValue * 1e6) / 1e6;
}

/**
 * Draws an approximate circle using the turtle.
 * @param turtle The turtle to use.
 * @param radius The radius of the circle.
 * @param numSides The number of sides to approximate the circle with.
 */
export function drawApproximateCircle(
  turtle: Turtle,
  radius: number,
  numSides: number
): void {
  const anglePerSide = DEGREES_IN_CIRCLE / numSides;
  const chordLengthValue = chordLength(radius, anglePerSide);
  
  for (let i = 0; i < numSides; i++) {
    turtle.forward(chordLengthValue);
    turtle.turn(anglePerSide);
  }
}

/**
 * Calculates the Euclidean distance between two points.
 * @param p1 The first point.
 * @param p2 The second point.
 * @returns The distance between p1 and p2.
 */
export function distance(p1: Point, p2: Point): number {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Calculates the angle between two points in degrees.
 * @param p1 The first point.
 * @param p2 The second point.
 * @returns The angle in degrees from p1 to p2.
 */
function calculateAngle(p1: Point, p2: Point): number {
  return Math.atan2(p2.y - p1.y, p2.x - p1.x) * (DEGREES_IN_CIRCLE / (2 * Math.PI));
}

/**
 * Normalizes an angle to be between 0 and 360 degrees.
 * @param angle The angle to normalize.
 * @returns The normalized angle.
 */
function normalizeAngle(angle: number): number {
  return ((angle % DEGREES_IN_CIRCLE) + DEGREES_IN_CIRCLE) % DEGREES_IN_CIRCLE;
}

/**
 * Finds a path for the turtle to visit a list of points in order.
 * @param turtle The turtle to move.
 * @param points An array of points to visit in order.
 * @returns An array of instructions representing the path.
 */
export function findPath(turtle: Turtle, points: Point[]): string[] {
  const instructions: string[] = [];
  let currentPosition = turtle.getPosition();
  let currentHeading = turtle.getHeading();

  for (const targetPoint of points) {
    const targetAngle = calculateAngle(currentPosition, targetPoint);
    let turnAngle = normalizeAngle(targetAngle - currentHeading);
    
    instructions.push(`turn ${turnAngle.toFixed(2)}`);
    
    const dist = distance(currentPosition, targetPoint);
    instructions.push(`forward ${dist.toFixed(2)}`);
    
    currentPosition = targetPoint;
    currentHeading = targetAngle;
  }

  return instructions;
}

/**
 * Draws a star pattern with the specified number of points.
 * @param turtle The turtle to use.
 * @param size The size of the star.
 * @param points The number of points in the star.
 */
function drawStar(turtle: Turtle, size: number, points: number): void {
  const angle = DEGREES_IN_CIRCLE / points;
  for (let i = 0; i < points; i++) {
    turtle.forward(size);
    turtle.turn(angle * 2);
  }
}

/**
 * Draws a spiral pattern.
 * @param turtle The turtle to use.
 * @param initialSize The initial size of the spiral.
 * @param growthFactor The factor by which the size grows each iteration.
 * @param iterations The number of iterations to draw.
 */
function drawSpiral(
  turtle: Turtle,
  initialSize: number,
  growthFactor: number,
  iterations: number
): void {
  let size = initialSize;
  for (let i = 0; i < iterations; i++) {
    turtle.forward(size);
    turtle.turn(RIGHT_ANGLE);
    size *= growthFactor;
  }
}

/**
 * Draws a branch of a tree.
 * @param turtle The turtle to use.
 * @param length The length of the branch.
 * @param angle The angle to turn.
 */
function drawBranch(turtle: Turtle, length: number, angle: number): void {
  if (length < 10) return; // Stop when branches get too small
  
  turtle.forward(length);
  turtle.turn(angle);
  drawBranch(turtle, length * 0.7, angle);
  turtle.turn(-angle * 2);
  drawBranch(turtle, length * 0.7, angle);
  turtle.turn(angle);
  turtle.forward(-length);
}

/**
 * Draws a root of a tree.
 * @param turtle The turtle to use.
 * @param length The length of the root.
 * @param angle The angle to turn.
 */
function drawRoot(turtle: Turtle, length: number, angle: number): void {
  if (length < 10) return; // Stop when roots get too small
  
  turtle.forward(length);
  turtle.turn(angle);
  drawRoot(turtle, length * 0.7, angle);
  turtle.turn(-angle * 2);
  drawRoot(turtle, length * 0.7, angle);
  turtle.turn(angle);
  turtle.forward(-length);
}

/**
 * Draws a petal of a flower.
 * @param turtle The turtle to use.
 * @param size The size of the petal.
 */
function drawPetal(turtle: Turtle, size: number): void {
  for (let i = 0; i < 2; i++) {
    drawApproximateCircle(turtle, size, 30);
    turtle.turn(180);
  }
}

/**
 * Draws a flower with multiple layers of petals.
 * @param turtle The turtle to use.
 * @param size The base size of the flower.
 * @param layers The number of layers of petals.
 */
function drawFlower(turtle: Turtle, size: number, layers: number): void {
  for (let layer = 0; layer < layers; layer++) {
    const petalSize = size * (1 - layer * 0.2);
    const numPetals = 8 + layer * 4;
    const angleStep = DEGREES_IN_CIRCLE / numPetals;
    
    for (let i = 0; i < numPetals; i++) {
      turtle.forward(petalSize * 0.5);
      drawPetal(turtle, petalSize);
      turtle.forward(-petalSize * 0.5);
      turtle.turn(angleStep);
    }
  }
}

/**
 * Draws a decorative pattern.
 * @param turtle The turtle to use.
 * @param size The size of the pattern.
 */
function drawPattern(turtle: Turtle, size: number): void {
  for (let i = 0; i < 4; i++) {
    turtle.forward(size);
    turtle.turn(90);
    drawApproximateCircle(turtle, size * 0.3, 16);
    turtle.turn(90);
    turtle.forward(size);
    turtle.turn(90);
    drawApproximateCircle(turtle, size * 0.3, 16);
    turtle.turn(90);
    turtle.forward(-size);
    turtle.turn(90);
  }
}

/**
 * Draws personal art using the turtle.
 * Creates a beautiful mandala-like pattern with flowers and geometric shapes.
 * @param turtle The turtle to use.
 */
export function drawPersonalArt(turtle: Turtle): void {
  // Draw the outer circle
  turtle.color("purple");
  drawApproximateCircle(turtle, 150, 360);
  
  // Draw decorative patterns
  turtle.color("blue");
  for (let i = 0; i < 8; i++) {
    turtle.forward(150);
    drawPattern(turtle, 30);
    turtle.forward(-150);
    turtle.turn(45);
  }
  
  // Draw medium circle
  turtle.color("cyan");
  drawApproximateCircle(turtle, 100, 360);
  
  // Draw flowers
  turtle.color("yellow");
  for (let i = 0; i < 4; i++) {
    turtle.forward(100);
    drawFlower(turtle, 20, 3);
    turtle.forward(-100);
    turtle.turn(90);
  }
  
  // Draw inner circle
  turtle.color("magenta");
  drawApproximateCircle(turtle, 50, 360);
  
  // Draw star pattern
  turtle.color("red");
  drawStar(turtle, 40, 8);
  
  // Draw center flower
  turtle.color("orange");
  drawFlower(turtle, 15, 4);
  
  // Draw spiral patterns
  turtle.color("green");
  for (let i = 0; i < 4; i++) {
    turtle.forward(50);
    drawSpiral(turtle, 10, 1.2, 8);
    turtle.forward(-50);
    turtle.turn(90);
  }
  
  // Draw final center circle
  turtle.color("black");
  drawApproximateCircle(turtle, 10, 32);
}

/**
 * Generates HTML content for displaying the turtle's path.
 */
function generateHTML(
  pathData: { start: Point; end: Point; color: Color }[]
): string {
  const canvasWidth = 500;
  const canvasHeight = 500;
  const scale = 1;
  const offsetX = canvasWidth / 2;
  const offsetY = canvasHeight / 2;

  const pathStrings = pathData
    .map(segment => {
      const x1 = segment.start.x * scale + offsetX;
      const y1 = segment.start.y * scale + offsetY;
      const x2 = segment.end.x * scale + offsetX;
      const y2 = segment.end.y * scale + offsetY;
      return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${segment.color}" stroke-width="2"/>`;
    })
    .join("");

  return `<!DOCTYPE html>
<html>
<head>
    <title>Turtle Graphics Output</title>
    <style>
        body { margin: 0; background-color: #f0f0f0; }
        svg { display: block; margin: 20px auto; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
    </style>
</head>
<body>
    <svg width="${canvasWidth}" height="${canvasHeight}" style="background-color:white;">
        ${pathStrings}
    </svg>
</body>
</html>`;
}

/**
 * Saves HTML content to a file.
 */
function saveHTMLToFile(
  htmlContent: string,
  filename: string = "output.html"
): void {
  fs.writeFileSync(filename, htmlContent);
  console.log(`Drawing saved to ${filename}`);
}

/**
 * Opens an HTML file in the default browser.
 */
function openHTML(filename: string = "output.html"): void {
  const commands = {
    win32: `start ${filename}`,
    darwin: `open ${filename}`,
    linux: `xdg-open ${filename}`
  };

  try {
    execSync(commands[process.platform as keyof typeof commands]);
  } catch {
    console.log("Could not open the file automatically. Please open it manually.");
  }
}

/**
 * Main function to demonstrate the turtle graphics capabilities.
 */
export function main(): void {
  const turtle = new SimpleTurtle();
  
  // Draw personal art
  drawPersonalArt(turtle);

  const htmlContent = generateHTML((turtle as SimpleTurtle).getPath());
  saveHTMLToFile(htmlContent);
  openHTML();
}

// Run main function if this file is executed directly
if (require.main === module) {
  main();
}
