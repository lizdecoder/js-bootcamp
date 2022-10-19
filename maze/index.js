const { Engine, Render, Runner, World, Bodies, Body } = Matter;

const cells = 3;
const width = 600;
const height = 600;

const unitLength = width / cells;

const engine = Engine.create();
engine.world.gravity.y = 0;
const { world } = engine;
const render = Render.create({
    element: document.body,
    engine: engine,
    options: {
        wireframes: true,
        width,
        height
    }
});

Render.run(render);
Runner.run(Runner.create(), engine);

// Walls
const walls = [
    // top
    Bodies.rectangle(width / 2, 0, width, 2, { isStatic: true }),
    // bottom
    Bodies.rectangle(width / 2, height, width, 2, { isStatic: true }),
    // left
    Bodies.rectangle(0, height / 2, 2, height, { isStatic: true }),
    // right
    Bodies.rectangle(width, height /2 , 2, height, { isStatic: true })
];
World.add(world, walls);
    
// Maze generation

// randomize array
const shuffle = (arr) => {
    let counter = arr.length;
    
    while (counter > 0) {
        const index = Math.floor(Math.random() * counter);
        counter--;
        const temp = arr[counter];
        arr[counter] = arr[index];
        arr[index] = temp;
   }
   return arr; 
}

// one attempt for grid
// const grid = [];
// for (let i = 0; i < 3; i++) {
//     grid.push([]);
//     for (let j = 0; j < 3; j++) {
//         grid[i].push(false);
//     }
// }

// better approach to grid
const grid = Array(cells).fill(null).map(() => Array(cells).fill(false));

const verticals = Array(cells).fill(null).map(() => Array(cells-1).fill(false));
const horizontals = Array(cells-1).fill(null).map(() => Array(cells).fill(false));

const startRow = Math.floor(Math.random() * cells);
const startColumn = Math.floor(Math.random() * cells);

const stepThroughCell = (row, column) => {
    // If I have visited the cell at [row, column], then return
    if (grid[row][column]) {
        return;
    }
    // Mark this cell as being visited
    grid[row][column] = true;
    
    // Assemble randomly-ordered list of neighbors
    // Uses shuffle function to randomize
    const neighbors = shuffle([
        // adding third element as a flag for direction
        [row - 1, column, 'up'],
        [row, column + 1, 'right'],
        [row + 1, column, 'down'],
        [row, column - 1, 'left']
    ]);
    
    // for each neighbor...
    for (let neighbor of neighbors) {
        // destructuring next row and next column from neighbor
        const [nextRow, nextColumn, direction] = neighbor;
        // see if that neighbor is out of bounds
        if (nextRow < 0 || nextRow >= cells || nextColumn < 0 || nextColumn >= cells) {
            continue;
        }
        // if we have visited that neighbor, continue to next neightbor
        if (grid[nextRow][nextColumn]) {
            continue;
        }
        // remove a wall from either the horizontals or verticals array
        if (direction === 'left') {
            verticals[row][column-1] = true;
        } else if (direction === 'right') {
            verticals[row][column] = true;
        } else if (direction === 'up') {
            horizontals[row-1][column] = true;
        } else if (direction === 'down') {
            horizontals[row][column] = true;
        }
        // visit that next cell
        stepThroughCell(nextRow, nextColumn);
    }
};

stepThroughCell(startRow, startColumn);

// iterate over horizontals
horizontals.forEach((row, rowIndex) => {
    row.forEach((open, columnIndex) => {
        if (open) {
            return;
        }
        // render the rectangle for the wall
        const wall = Bodies.rectangle(
            // x-coordinate to center
            columnIndex * unitLength + unitLength / 2,
            // y-coordinate to center
            rowIndex * unitLength + unitLength,
            // width of rectangle
            unitLength,
            // height of rectangle
            10,
            {
                isStatic: true
            }
        );
        World.add(world, wall);
    });
});

// iterate over verticals
verticals.forEach((row, rowIndex) => {
    row.forEach((open, columnIndex) => {
        if (open) {
            return;
        }
        // render the rectangle for the wall
        const wall = Bodies.rectangle(
            // x-coordinate to center
            columnIndex * unitLength + unitLength,
            // y-coordinate to center
            rowIndex * unitLength + unitLength / 2,
            // width of rectangle
            10,
            // height of rectangle
            unitLength,
            {
                isStatic: true
            }
        );
        World.add(world, wall);
    });
});

// goal that scales with size of maze
const goal = Bodies.rectangle(
    // x-coordinate to center
    width - unitLength /2,
    // y-coordinate to center
    height - unitLength / 2,
    // width of rectangle
    unitLength * .7,
    // height of rectangle
    unitLength * .7,
    {
        isStatic: true
    }
);
World.add(world, goal);

// ball that scales with size of maze
const ball = Bodies.circle(
    // x cooordinate
    unitLength / 2,
    // y coordinate
    unitLength / 2,
    // radius of ball
    unitLength / 4,
);
World.add(world, ball);

// eventlistener for keypresses to move ball
document.addEventListener('keydown', event => {
    const { x, y } = ball.velocity;
    console.log(x, y);
    if (event.key === 'w') {
        Body.setVelocity(ball, { x, y: y - 5 });
    }
    if (event.key === 'd') {
        Body.setVelocity(ball, { x: x + 5, y });
    }
    if (event.key === 's') {
        Body.setVelocity(ball, { x, y: y + 5 });
    }
    if (event.key === 'a') {
        Body.setVelocity(ball, { x: x - 5, y });
    }
});
