let game = d3.select("#game")

let types = {
    normal: {
        width: 30,
        height: 30,
        collsion_radius: 15,
        default_image: "img/normal.png",
    },
    soldier: {
        width: 30,
        height: 30,
        collsion_radius: 15,
        default_image: "img/soldier.png",
    },
    snake: {
        width: 30,
        height: 30,
        collsion_radius: 15,
        default_image: "img/virus_snake.png",
    },
    cucumber: {
        width: 30,
        height: 30,
        collsion_radius: 15,
        default_image: "img/virus_cucumber.png",
    },
    tenticle: {
        width: 30,
        height: 30,
        collsion_radius: 15,
        default_image: "img/virus_tenticle.png",
    },
}

let normalCellData = (function () {
    let num_cells = 10;
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
    { enabled: false, x: 30,  y: 330, type: "soldier" },
    { enabled: false, x: 60,  y: 330, type: "soldier" },
    { enabled: false, x: 90,  y: 330, type: "soldier" },
    { enabled: false, x: 120, y: 330, type: "soldier" },
];

let virusData = [
    { x: 30, y: 60, type: "snake" },
    { x: 60, y: 60, type: "cucumber" },
    { x: 90, y: 60, type: "tenticle" },
];

function magnitude(x, y) {
    return Math.sqrt(x * x + y * y);
}

function nearest_cell(self) {

    let min_soldier
    let min_distance = 10000000000000;
    for (let normal of normalCellData) {
        let distance = magnitude(self.x - normal.x, self.y - normal.y);
        if (distance < min_distance) {
            min_distance = distance;
            min_soldier = normal;
        }
    }

    return min_soldier;
}

function check_for_collision() {
    for (let virus of virusData) {
        for (let normalcell of normalCellData) {
            if (magnitude(virus.x - normalcell.x, virus.y - normalcell.y) < types[virus.type].collision_radius + types[normalcell.type].collision_radius) {
                normalcell.infection += 0.01;
            }
        }
    }
}

function frame() {

    for (let virus of virusData) {
        //virus.x += Math.random() * 2 - 1;
        //virus.y += Math.random() * 2 - 1;

        let nearest = nearest_cell(virus);
        let dir_x = nearest.x - virus.x;
        let dir_y = nearest.y - virus.y;
        let norm_x = dir_x / magnitude(dir_x, dir_y);
        let norm_y = dir_y / magnitude(dir_x, dir_y);
        let speed = 0.1;

        virus.x += norm_x * speed;
        virus.y += norm_y * speed;
    }

    let allCells = game.selectAll("image") // offset after they move
        //.transition()
        .attr("x", (d) => d.x - types[d.type].width / 2)
        .attr("y", (d) => d.y - types[d.type].height / 2)
        .attr("href", d => {
            if (d.type === "normal" && d.infection >= 1) {
                return "img/normal-infected.png";
            } else {
                return types[d.type].default_image;
            }
        })
        ;

    check_for_collision();


    requestAnimationFrame(frame);
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
        .attr("y", d => d.y - types[d.type].height / 2)
        ;

    game.select("#toolbar").raise()

    let soldiers = game.selectAll(".soldier-option")
        .data(soldiersData)
        .enter()
        .append("image")
        .attr("xlink:href", "img/soldier.png")
        .attr("class", "soldier-option")
        .attr("width", d => types[d.type].width)
        .attr("height", d => types[d.type].height)
        .attr("x", d => d.x - types[d.type].width / 2)
        .attr("y", d => d.y - types[d.type].height /2 );

    requestAnimationFrame(frame);

    var dragHandler = d3.drag()
        .on("drag", function (d) {
            d3.select(this)
                .attr("cx", d.x = d3.event.x)
                .attr("cy", d.y = d3.event.y);
        });

    dragHandler(game.selectAll(".soldier-option"));

    // dragHandler(viruses);
}

main();
