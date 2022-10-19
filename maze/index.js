const { Engine, Render, Runner, World, Bodies, Body, Events } = Matter;

const cellsHorizontal = 14;
const cellsVertical = 10;
const width = window.innerWidth;
const height = window.innerHeight;

const unitLengthX = width / cellsHorizontal;
const unitLengthY = height / cellsVertical;

const engine = Engine.create();
engine.world.gravity.y = 0;
const { world } = engine;
const render = Render.create({
    element: document.body,
    engine: engine,
    options: {
        wireframes: false,
        width,
        height
    }
});

Render.run(render);
Runner.run(Runner.create(), engine);

// borders
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
const grid = Array(cellsVertical).fill(null).map(() => Array(cellsHorizontal).fill(false));

const verticals = Array(cellsVertical).fill(null).map(() => Array(cellsHorizontal-1).fill(false));

const horizontals = Array(cellsVertical-1).fill(null).map(() => Array(cellsHorizontal).fill(false));

const startRow = Math.floor(Math.random() * cellsVertical);
const startColumn = Math.floor(Math.random() * cellsHorizontal);

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
        if (nextRow < 0 || nextRow >= cellsVertical || nextColumn < 0 || nextColumn >= cellsHorizontal) {
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
            columnIndex * unitLengthX + unitLengthX / 2,
            // y-coordinate to center
            rowIndex * unitLengthY + unitLengthY,
            // width of rectangle
            unitLengthX,
            // height of rectangle
            5,
            {
                label: 'wall',
                isStatic: true,
                render: {
                    fillStyle: 'blue'
                }
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
            columnIndex * unitLengthX + unitLengthX,
            // y-coordinate to center
            rowIndex * unitLengthY + unitLengthY / 2,
            // width of rectangle
            5,
            // height of rectangle
            unitLengthY,
            {
                label: 'wall',
                isStatic: true,
                render: {
                    fillStyle: 'blue'
                }
            }
        );
        World.add(world, wall);
    });
});

// goal that scales with size of maze
const goal = Bodies.rectangle(
    // x-coordinate to center
    width - unitLengthX / 2,
    // y-coordinate to center
    height - unitLengthY / 2,
    // width of rectangle
    unitLengthX * .7,
    // height of rectangle
    unitLengthY * .7,
    {
        label: 'goal',
        isStatic: true,
        render: {
            fillStyle: 'green'
        }
    }
);
World.add(world, goal);

// ball that scales with size of maze
// ball radius
const ballRadius = Math.min(unitLengthX, unitLengthY) / 4;
const ball = Bodies.circle(
    // x cooordinate
    unitLengthX / 2,
    // y coordinate
    unitLengthY / 2,
    // radius of ball
    ballRadius,
    {
        label: 'ball',
        render: {
            fillStyle: 'grey'
        }
    }
);
World.add(world, ball);

// eventlistener for keypresses to move ball
document.addEventListener('keydown', event => {
    const { x, y } = ball.velocity;
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

// Win condition: shapes collided with each other
Events.on(engine, 'collisionStart', event => {
    event.pairs.forEach((collision) => {
        const labels = ['ball', 'goal'];

        if (labels.includes(collision.bodyA.label) && labels.includes(collision.bodyB.label)) {
            world.gravity.y = 1;
            world.bodies.forEach(body => {
                if (body.label === 'wall') {
                    Body.setStatic(body, false);
                }
            });
        }
    });
});