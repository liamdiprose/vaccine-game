let game = d3.select("#game")

let body_parts = [
    {
        name: "Head",
        value: 0,
        stages: [
            {
                name: "Fine",
                image: "img/person-head-normal.png",
            },
            {
                name: "Not Feeling Great",
                image: "img/person-head-mild.png",
            },
            {
                name: "Severe Nausea",
                image: "img/person-head-severe.png",
            }
        ]
    },
    {
        name: "Torso",
        value: 0,
        stages: [
            {
                name: "Normal",
                image: "img/person-torso-normal.png",
            },
            {
                name: "Mild Rash",
                image: "img/person-torso-mild.png",
            },
            {
                name: "Severe Rash",
                image: "img/person-torso-severe.png",
            }
        ]
    },
    {
        name: "Legs",
        value: 0,
        stages: [
            {
                name: "Legs",
                image: "img/person-legs-normal.png",
            },
            {
                name: "Cold Legs",
                image: "img/person-legs-mild.png",
            },
            {
                name: "Really Cold Legs",
                image: "img/person-legs-severe.png",
            }
        ]
    },
];

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
        collision_radius: 50,
        default_image: "img/memory-inactive.png",
        activated_image: "img/memory-active.png",
    }
};
var soldierDrag = d3.drag()
 .on("start", (d) => {
    toolbarSlots = toolbarSlots.filter(e => e !== d);
    console.log(`started to drag: ${d}`);
    d.dragged = true;
 })
 .on("end", d => {
        recalcToolbarXs();
        console.log(`finished to drag: ${d.type}`);
        console.log(`finished. dragged?: ${d.dragged}`);
        toolbarSlots = toolbarSlots.filter(e => e !== d);
         if (d.type === "soldier"){
            soldiersData.push(d);
         }
        d.dragged = true;

         d.enabled = true})
 .on("drag", function (d) {
     if (d.type === "soldier" && d.enabled) return;
     if (d.type === "memory" && d.enabled) return;
     d3.select(this)
         .attr("cx", d.x = d3.event.x)
         .attr("cy", d.y = d3.event.y);
 });

let num_cells = 15;
let normalCellData = (function () {
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
    //    { enabled: false, x: 30,  y: 316, type: "soldier" },
    //    { enabled: false, x: 60,  y: 316, type: "soldier" },
    //    { enabled: false, x: 90,  y: 316, type: "soldier" },
    //    { enabled: false, x: 120, y: 316, type: "soldier" },
];

let memoryData = [
    { enabled: false, activated: false, x: 270,  y: 316, type: "memory", id: 1 },
    { enabled: false, activated: false, x: 240, y: 316, type: "memory", id: 2},
    { enabled: false, activated: false, x: 210, y: 316, type: "memory", id: 3},
];

// function addSoldier(game) {
//     game.selectAll(".soldier")
//     ;.data()
// }

let virusData = [
    { x: 30, y: 60, type: "snake" },
    { x: 60, y: 60, type: "cucumber" },
    { x: 90, y: 60, type: "tenticle" },
];

let toolbarSlots = [];

function magnitude(x, y) {
    return Math.sqrt(x * x + y * y);
}

function nearest_cell(self, cells, pred) {

    let min_soldier;
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
        if (virus.dead) continue;
        for (let normalcell of normalCellData) {
            if (magnitude(virus.x - normalcell.x, virus.y - normalcell.y) < types[virus.type].collision_radius + types[normalcell.type].collision_radius) {
                normalcell.infection += 0.01;
                normalcell.infection_type = virus.type;
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
        if (!soldier.enabled) continue;
        for (let virus of virusData) {
            if (virus.dead) continue;
            if (magnitude(virus.x - soldier.x, virus.y - soldier.y) < types[virus.type].collision_radius + types[soldier.type].collision_radius
                && !virus.dead) {
                virus.dead = true;
            }
        }
    }
    for (let memory of memoryData) {
        if (!memory.enabled) continue;
        for (let virus of virusData) {
            if (magnitude(virus.x - memory.x, virus.y - memory.y) < types[virus.type].collision_radius + types[memory.type].collision_radius
                && !virus.dead) {

                if (!memory.activated) {
                    memory.activated = true;
                    setTimeout(() => {
                            soldierDrag(makeSoldier(game));
                            recalcToolbarXs();
                            setTimeout(() => {
                                    soldierDrag(makeSoldier(game));
                                    recalcToolbarXs()
                    setTimeout(() => {
                            soldierDrag(makeSoldier(game));
                            recalcToolbarXs();
                            setTimeout(() => {
                                    soldierDrag(makeSoldier(game));
                                    recalcToolbarXs()
                    setTimeout(() => {
                            soldierDrag(makeSoldier(game));
                            recalcToolbarXs();
                            setTimeout(() => {
                                    soldierDrag(makeSoldier(game));
                                    recalcToolbarXs()
                            }, 2000);
                    }
                    , 2000);
                            }, 2000);
                    }
                    , 2000);
                            }, 2000);
                    }
                    , 2000);
                }

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
                let speed = 0.4;

                virus.x += norm_x * speed;
                virus.y += norm_y * speed;
            } else {
                virus.dead = true;
            }
        }
    }

    for (let soldier of soldiersData) {
        if (!soldier.enabled) continue;

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
            } else if (d.type === "memory" && d.activated) {
                return types[d.type].activated_image;
            } else {
                return types[d.type].default_image;
            }
        });

    check_for_collision();

    // calculate health and sickness stages
    let stats = {
        infected: 0,
        virus1: 0,
        virus2: 0,
        virus3: 0,
    };
    for (let cell of normalCellData) {
        if (cell.infection >= 1) {
            stats.infected += 1;
            if (cell.infection_type == "snake") {
                stats.virus1 += 1;
            } else if (cell.infection_type == "cucumber") {
                stats.virus2 += 1;
            } else if (cell.infection_type == "tenticle") {
                stats.virus3 += 1;
            }
        }
    }
    let health = Math.round(100 - 100 * stats.infected / num_cells);
    body_parts[0].stage = Math.min(2, Math.floor(stats.virus1 / (num_cells / 6)));
    body_parts[1].stage = Math.min(2, Math.floor(stats.virus2 / (num_cells / 6)));
    body_parts[2].stage = Math.min(2, Math.floor(stats.virus3 / (num_cells / 6)));

    d3
        .select("#healthbar div")
        .text(health + "%")
        ;

    d3
        .selectAll(".body-image")
        .attr("src", d => d.stages[d.stage].image)
        ;
    d3
        .selectAll(".body-text")
        .text(d => d.stages[d.stage].name)
        ;

    redraw();

    requestAnimationFrame(frame);
}

function redraw() {
    game.select("#toolbar").raise();
    game.selectAll(".soldier").raise();
    game.selectAll(".memory").raise();
}


//var soldierDrag = d3.drag()
//    .on("start", (d) => {
//            // TO DO: set enabled on max's array
//        // d.enabled = true;
//    })
//    .on("end", d => {
//            toolbarSlots.splice(toolbarSlots.find(e => e == d), 1);
//            recalcToolbarXs();
//            d.enabled = true})
//    .on("drag", function (d) {
//        if (d.enabled) return;
//        d3.select(this)
//            .attr("cx", d.x = d3.event.x)
//            .attr("cy", d.y = d3.event.y);
//    });

function makeSoldier(game) {

    if (toolbarSlots.length >= 6)
        return game.selectAll(".soldier");

    data = {};

    data.y = 316
    data.x = toolbarSlots.length * 30 + 20;
    data.type = "soldier";
    data.enabled = false;
    data.dragged = false;

    toolbarSlots.push(data);
    let soldiers = game.selectAll(".soldier")
        .data(toolbarSlots)
        .enter()
        .append("image")
        .attr("xlink:href", "img/soldier.png")
        .attr("class", "soldier")
        .attr("width", d => types[d.type].width)
        .attr("height", d => types[d.type].height)
        .attr("x", d => d.x - types[d.type].width / 2)
        .attr("y", d => d.y - types[d.type].height /2 );
    return soldiers;
}

function recalcToolbarXs() {

    let i = 0;
    for (let slot of toolbarSlots) {
        console.log(`Recalc Looping slot: ${slot.type}`);
        console.log(`Soldier dragged? ${slot.dragged}`);
        if (slot.type == "soldier" && slot.dragged) {
            console.log("skipping dragged");
        }
        slot.x = 30 * i + 20;
        i++;
    }
}


function main() {


    let divs = d3
        .select("#person-panel")
        .selectAll(".body-part")
        .data(body_parts)
        .enter()
        .append("div")
        .attr("class", "body-part")
        ;
    divs
        .append("img")
        .attr("class", "body-image")
        .attr("src", d => d.stages[2].image)
        .style("width", "auto")
        .style("height", "21vh")
        ;
    divs
        .append("div")
        .attr("class", "body-text")
        .text(d => d.stages[2].name)
        .style("color", "white")
        .style("text-align", "center")
        ;

    // d3
    //     .select("#person-panel")
    //     //.select(".body-part")
    //     .selectAll(".asdf")
    //     .data(body_parts)
    //     .enter()
    //     ;

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
        .attr("y", d => d.y - types[d.type].height / 2);

    let memories = game.selectAll(".memory")
        .data(memoryData)
        .enter()
        .append("image")
        .attr("xlink:href", "img/memory-active.png")
        .attr("class", "memory")
        .attr("id", d => d.id)
        .attr("width", d => types[d.type].width)
        .attr("height", d => types[d.type].height)
        .attr("x", d => d.x - types[d.type].width / 2)
        .attr("y", d => d.y - types[d.type].height / 2);

    requestAnimationFrame(frame);


    let toolbarSoldiers = makeSoldier(game);
    console.log(toolbarSoldiers);

    soldierDrag(toolbarSoldiers);
    soldierDrag(memories);
    console.log(memories);
    soldierDrag(soldiers);
}

main();
