import { Turtle, SimpleTurtle, Point, Color } from "./turtle";
import * as fs from "fs";
import { execSync } from "child_process";

/**
 * Draws a square of the given side length using the turtle.
 * @param turtle The turtle to use for drawing.
 * @param sideLength The length of each side of the square in pixels.
 */
export function drawSquare(turtle: Turtle, sideLength: number): void {
  // TODO: Implement drawSquare
  // Example (incorrect square, just to show usage):
  turtle.forward(sideLength);
  turtle.turn(90);
  turtle.forward(sideLength);
  turtle.turn(90);
  turtle.forward(sideLength);
  turtle.turn(90);
  turtle.forward(sideLength);
  turtle.turn(90);
}

/**
 * Calculates the length of a chord of a circle.
 * Read the specification comment above it carefully in the problem set description.
 * @param radius Radius of the circle.
 * @param angleInDegrees Angle subtended by the chord at the center of the circle (in degrees).
 * @returns The length of the chord.
 */
export function chordLength(radius: number, angleInDegrees: number): number {
  // Convert the full angle from degrees to radians
  const angleInRadians = (angleInDegrees * Math.PI) / 180;
  // The chord length is 2 * r * sin(angle/2)
  // So we take the half-angle in radians
  const halfAngle = angleInRadians / 2;

  const rawVale = 2 * radius * Math.sin(halfAngle);
  return Math.round(rawVale * 1e6) / 1e6;
}

/**
 * Draws an approximate circle using the turtle.
 * Use your implementation of chordLength.
 * @param turtle The turtle to use.
 * @param radius The radius of the circle.
 * @param numSides The number of sides to approximate the circle with (e.g., 360 for a close approximation).
 */
export function drawApproximateCircle(
  turtle: Turtle,
  radius: number,
  numSides: number
): void {
  // TODO: Implement drawApproximateCircle
  const degree = 360 / numSides;
  const chordL = chordLength(radius, degree);
  for (let i = 0; i < numSides; i++) {
    turtle.forward(chordL);
    turtle.turn(degree);
  }
}

/**
 * Calculates the distance between two points.
 * @param p1 The first point.
 * @param p2 The second point.
 * @returns The distance between p1 and p2.
 */
export function distance(p1: Point, p2: Point): number {
  // TODO: Implement distance
  let X = Math.abs(p1.x - p2.x);
  let Y = Math.abs(p1.y - p2.y);
  return Math.sqrt(X ** 2 + Y ** 2); // Placeholder
}

/**
 * Finds a path (sequence of turns and moves) for the turtle to visit a list of points in order.
 * You should use your distance method as appropriate.
 * @param turtle The turtle to move.
 * @param points An array of points to visit in order.
 * @returns An array of instructions (e.g., strings like "forward 10", "turn 90") representing the path.
 *          This is simplified for Problem Set 0 and we won't actually use these instructions to drive the turtle directly in this starter code.
 *          The function primarily needs to *calculate* the path conceptually.
 */

export function findPath(turtle: Turtle, points: Point[]): string[] {
  // We'll build an array of instructions like ["turn 30", "forward 10", ...]
  const instructions: string[] = [];

  // Get the turtle's initial position & heading (assuming your Turtle has these getters).
  // If your Turtle doesn't store heading, you can track it manually starting at 0°.
  let currentPosition = turtle.getPosition();
  let currentHeading = turtle.getHeading(); // If your Turtle library doesn't have getHeading(), assume 0° start.

  for (let i = 0; i < points.length; i++) {
    // 1) Compute the vector from currentPosition to next point
    const dx = points[i].x - currentPosition.x;
    const dy = points[i].y - currentPosition.y;

    // 2) The absolute angle (in degrees) of that vector (range: -180..180 or 0..360).
    //    Use atan2 because it handles all quadrants correctly.
    let angleToPoint = Math.atan2(dy, dx) * (180 / Math.PI);

    // 3) Figure out how much we need to turn from the turtle's current heading.
    //    This might be negative or positive, depending on your turning convention.
    let turnAngle = angleToPoint - currentHeading;

    // 4) Normalize turnAngle so it's typically in the 0..360 range or -180..180 range.
    //    One common approach:
    turnAngle = (turnAngle + 360) % 360;

    // 5) Create a "turn {X}" instruction
    instructions.push(`turn ${turnAngle.toFixed(2)}`);

    // 6) Distance from current position to next point
    const dist = distance(currentPosition, points[i]);
    instructions.push(`forward ${dist.toFixed(2)}`);

    // 7) Update the turtle's conceptual "state"
    //    - new position is obviously the next point
    //    - new heading is angleToPoint
    currentPosition = points[i];
    currentHeading = angleToPoint;
  }

  return instructions; // e.g. ["turn 45.00", "forward 10.00", ...]
}

/**
 * Draws your personal art using the turtle.
 * Be creative and implement something interesting!
 * Use at least 20 lines of non-repetitive code.
 * You may use helper methods, loops, etc., and the `color` method of the Turtle.
 * @param turtle The turtle to use.
 */
export function drawPersonalArt(turtle: Turtle): void {
  // TODO: Implement drawPersonalArt
  // Example - replace with your own art!
  const pointsToVisit: Point[] = [
    { x: 0, y: 20 },
    { x: 20, y: 20 },
    { x: 20, y: 0 },
    { x: 20, y: -20 },
    { x: 0, y: -20 },
    { x: -20, y: -20 },
    { x: -20, y: 0 },
    { x: -20, y: 20 },
    { x: -20, y: 40 },
    { x: 0, y: 40 },
    { x: 20, y: 40 },
    { x: 40, y: 40 },
    { x: 40, y: 20 },
    { x: 40, y: 0 },
    { x: 40, y: -20 },
  ];
  const path = findPath(turtle, pointsToVisit);
  for (let i = 0; i < path.length; i++) {
    let amount: number = parseInt(path[i].split(" ")[1]);
    path[i].split(" ")[0] == "forward"
      ? turtle.forward(amount)
      : turtle.turn(amount);
  }
}

function generateHTML(
  pathData: { start: Point; end: Point; color: Color }[]
): string {
  const canvasWidth = 500;
  const canvasHeight = 500;
  const scale = 1; // Adjust scale as needed
  const offsetX = canvasWidth / 2; // Center the origin
  const offsetY = canvasHeight / 2; // Center the origin

  let pathStrings = "";
  for (const segment of pathData) {
    const x1 = segment.start.x * scale + offsetX;
    const y1 = segment.start.y * scale + offsetY;
    const x2 = segment.end.x * scale + offsetX;
    const y2 = segment.end.y * scale + offsetY;
    pathStrings += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${segment.color}" stroke-width="2"/>`;
  }

  return `<!DOCTYPE html>
<html>
<head>
    <title>Turtle Graphics Output</title>
    <style>
        body { margin: 0; }
        canvas { display: block; }
    </style>
</head>
<body>
    <svg width="${canvasWidth}" height="${canvasHeight}" style="background-color:#f0f0f0;">
        ${pathStrings}
    </svg>
</body>
</html>`;
}

function saveHTMLToFile(
  htmlContent: string,
  filename: string = "output.html"
): void {
  fs.writeFileSync(filename, htmlContent);
  console.log(`Drawing saved to ${filename}`);
}

function openHTML(filename: string = "output.html"): void {
  try {
    // For macOS
    execSync(`open ${filename}`);
  } catch {
    try {
      // For Windows
      execSync(`start ${filename}`);
    } catch {
      try {
        // For Linux
        execSync(`xdg-open ${filename}`);
      } catch {
        console.log("Could not open the file automatically");
      }
    }
  }
}

export function main(): void {
  const turtle = new SimpleTurtle();

  // Example Usage - Uncomment functions as you implement them

  // Draw a square
  // drawSquare(turtle, 100);

  // Example chordLength calculation (for testing in console)
  // console.log("Chord length for radius 5, angle 60 degrees:", chordLength(5, 60));

  // Draw an approximate circle
  //drawApproximateCircle(turtle, 50, 360);

  // Example distance calculation (for testing in console)
  // const p1: Point = {x: 1, y: 2};
  // const p2: Point = {x: 4, y: 6};
  // console.log("Distance between p1 and p2:", distance(p1, p2));

  // Example findPath (conceptual - prints path to console)
  //const pointsToVisit: Point[] = [{x: 20, y: 20}, {x: 80, y: 20}, {x: 80, y: 80}];
  // const pathInstructions = findPath(turtle, pointsToVisit);
  // console.log(findPath(turtle, pointsToVisit));
  // console.log("Path instructions:", pathInstructions);

  // Draw personal art
   drawPersonalArt(turtle);

  const htmlContent = generateHTML((turtle as SimpleTurtle).getPath()); // Cast to access getPath
  saveHTMLToFile(htmlContent);
  openHTML();
}

// Run main function if this file is executed directly
if (require.main === module) {
  main();
}
