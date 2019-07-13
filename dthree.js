let game = d3.select("#game")

let types = {
    normal: {
        width: 30,
        height: 30,
        collision_radius: 15,
        default_image: "img/normal.png",
    },
    soldier: {
        width: 30,
        height: 30,
        collision_radius: 5,
        default_image: "img/soldier.png",
    },
    snake: {
        width: 30,
        height: 30,
        collision_radius: 15,
        default_image: "img/virus_snake.png",
    },
    cucumber: {
        width: 30,
        height: 30,
        collision_radius: 15,
        default_image: "img/virus_cucumber.png",
    },
    tenticle: {
        width: 30,
        height: 30,
        collision_radius: 10,
        default_image: "img/virus_tenticle.png",
    },
    memory: {
        width: 25,
        height: 25,
        collision_radius: 15,
        default_image: "img/memory-inactive.png",
    }
};

let normalCellData = (function () {
    let num_cells = 15;
    let cells = [];
    for (let i = 0; i < num_cells; i++) {
        cells.push({
            type: "normal",
            infection: 0,
            x: Math.floor(Math.random() * 300),
            y: Math.floor(Math.random() * 300),
        });
    }
    return cells;
})();

let soldiersData = [
    { enabled: false, x: 30,  y: 316, type: "soldier" },
    { enabled: false, x: 60,  y: 316, type: "soldier" },
    { enabled: false, x: 90,  y: 316, type: "soldier" },
    { enabled: false, x: 120, y: 316, type: "soldier" },
];

function addSoldier(game) {
    game.selectAll(".soldier")
      .data()
}

let virusData = [
    { x: 30, y: 60, type: "snake" },
    { x: 60, y: 60, type: "cucumber" },
    { x: 90, y: 60, type: "tenticle" },
];

function magnitude(x, y) {
    return Math.sqrt(x * x + y * y);
}

function nearest_cell(self, cells, pred) {

    let min_soldier
    let min_distance = 10000000000000;
    for (let cell of cells) {
        if (pred && !pred(cell)) continue;
        let distance = magnitude(self.x - cell.x, self.y - cell.y);
        if (distance < min_distance) {
            min_distance = distance;
            min_soldier = cell;
        }
    }

    return min_soldier;
}

function check_for_collision() {
    for (let virus of virusData) {
        for (let normalcell of normalCellData) {
            if (magnitude(virus.x - normalcell.x, virus.y - normalcell.y) < types[virus.type].collision_radius + types[normalcell.type].collision_radius) {
                normalcell.infection += 0.01;
                if (!normalcell.dead && normalcell.infection >= 1) {
                    normalcell.dead = true;
                    let new_virus = {
                        x: normalcell.x,
                        y: normalcell.y,
                        type: virus.type,
                    };
                    virusData.push(new_virus);
                    game
                        .selectAll(".asdfasdf")
                        .data([new_virus])
                        .enter()
                        .append("image")
                        .attr("class", "virus")
                        .attr("width", d => types[d.type].width)
                        .attr("height", d => types[d.type].height)
                        .attr("x", d => d.x - types[d.type].width / 2)
                        .attr("y", d => d.y - types[d.type].height / 2)
                        .attr("xlink:href", (d) => `img/virus_${d.type}.png`)
                        ;
                }
            }
        }
    }


    for (let soldier of soldiersData) {
        for (let virus of virusData) {
            if (magnitude(virus.x - soldier.x, virus.y - soldier.y) < types[virus.type].collision_radius + types[soldier.type].collision_radius
                && !virus.dead) {
                virus.dead = true;
            }
        }
    }
}

function frame() {

    for (let cell of normalCellData) {
        cell.targeted = false;
    }

    for (let v of virusData) {
        v.targeted = false;
    }

    for (let virus of virusData) {
        if (!virus.dead) {
            let nearest = nearest_cell(virus, normalCellData, c => c.infection < 1 && !c.targeted);
            if (nearest) {
                nearest.targeted = true;
                let dir_x = nearest.x - virus.x;
                let dir_y = nearest.y - virus.y;
                let norm_x = dir_x / magnitude(dir_x, dir_y);
                let norm_y = dir_y / magnitude(dir_x, dir_y);
                let speed = 0.8;

                virus.x += norm_x * speed;
                virus.y += norm_y * speed;
            } else {
                virus.dead = true;
            }
        }
    }

    for (let soldier of soldiersData) {
        let nearest = nearest_cell(soldier, virusData, c => !c.targeted && !c.dead);
        if (nearest) {
            nearest.targeted = true;
            let dir_x = nearest.x - soldier.x;
            let dir_y = nearest.y - soldier.y;
            let norm_x = dir_x / magnitude(dir_x, dir_y);
            let norm_y = dir_y / magnitude(dir_x, dir_y);
            let speed = 0.5;

            soldier.x += norm_x * speed;
            soldier.y += norm_y * speed;
        }
    }

    let allCells = game.selectAll("image") // offset after they move
        .attr("x", (d) => d.x - types[d.type].width / 2)
        .attr("y", (d) => d.y - types[d.type].height / 2)
        .attr("href", d => {
            if (d.type === "normal" && d.infection >= 1) {
                return "img/normal-infected.png";
            } else if (d.dead) {
                return "";
            } else {
                return types[d.type].default_image;
            }
        })
        ;

    check_for_collision();
    redraw();

    requestAnimationFrame(frame);
}

function redraw() {
    game.select("#toolbar").raise()
    game.selectAll(".soldier").raise()
    game.selectAll(".memory").raise()
}

function main() {

    let viruses = game.selectAll(".virus")
        .data(virusData)
        .enter()
        .append("image")
        .attr("class", "virus")
        .attr("width", 30)
        .attr("height", 30)
        .attr("x", d => d.x - types[d.type].width / 2)
        .attr("y", d => d.y - types[d.type].height / 2)
        .attr("xlink:href", (d) => `img/virus_${d.type}.png`)
        ;

    let normalCells = game.selectAll(".normal-cell")
        .data(normalCellData)
        .enter()
        .append("image")
        .attr("xlink:href", "img/normal.png")
        .attr("width", 30)
        .attr("height", 30)
        .attr("x", d => d.x - types[d.type].width / 2)
        .attr("y", d => d.y - types[d.type].height / 2);


    let soldiers = game.selectAll(".soldier")
        .data(soldiersData)
        .enter()
        .append("image")
        .attr("xlink:href", "img/soldier.png")
        .attr("class", "soldier")
        .attr("width", d => types[d.type].width)
        .attr("height", d => types[d.type].height)
        .attr("x", d => d.x - types[d.type].width / 2)
        .attr("y", d => d.y - types[d.type].height /2 );

    let memories = game.selectAll(".memory")
        .data([{x: 153, y: 314, type: "memory"}])
        .enter()
        .append("image")
        .attr("xlink:href", "img/memory-active.png")
        .attr("class", "memory")
        .attr("width", d => types[d.type].width)
        .attr("height", d => types[d.type].height)
        .attr("x", d => d.x - types[d.type].width / 2)
        .attr("y", d => d.y - types[d.type].height /2 );

    requestAnimationFrame(frame);

    var soldierDrag = d3.drag()
        .on("start", (d) => {
            console.log(`Started d: ${d.x}`);
        })
        .on("drag", function (d) {
            d3.select(this)
                .attr("cx", d.x = d3.event.x)
                .attr("cy", d.y = d3.event.y);
        });

    soldierDrag(memories);
    soldierDrag(soldiers);
}

main();
