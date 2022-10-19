const { Engine, Render, Runner, World, Bodies } = Matter;

const cells = 3;
const width = 600;
const height = 600;

const engine = Engine.create();
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
    Bodies.rectangle(width / 2, 0, width, 40, { isStatic: true }),
    // bottom
    Bodies.rectangle(width / 2, height, width, 40, { isStatic: true }),
    // left
    Bodies.rectangle(0, height / 2, 40, height, { isStatic: true }),
    // right
    Bodies.rectangle(width, height /2 , 40, height, { isStatic: true })
];
World.add(world, walls);
    
// Maze generation

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

    // Mark this cell as being visited

    // Assemble randomly-ordered list of neightbors

    // for each neightbor...

    // see if that neightbor is out of bounds

    // if we have visited that neightbor, continue to next neightbor

    // remove a wall from either the horizontals or verticals array
    
    // visit that next cell
};

stepThroughCell(startRow, startColumn);