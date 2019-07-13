
let game = d3.select("#game")


   

function frame() {


    let circles = game.selectAll(".virus")
        //.enter()
        //.append("circle")
        .transition()
        .style("top", (d) => '' + d.y + 'px')
        .style("left", (d) => '' + d.x + 'px')
        //.attr("r", () => 10);

    requestAnimationFrame(frame);
}

function randomVirus() {
    var ran = Math.floor(Math.random() * 3);

    switch (ran) {
        case 0:
            return "snake";
        case 1:
            return "cucumber";
        case 2:
            return "tenticle";
    }
}

let virusData = [
    { x: 30, y: 60, type: "snake" },
    { x: 30, y: 60, type: "cucumber" },
    { x: 30, y: 60, type: "tenticle" },
    { x: 30, y: 60, type: "snake" },
];

let soldiersData = [
    { enabled: false, x: 30, y: 320 },
    { enabled: false, x: 30, y: 320 },
    { enabled: false, x: 30, y: 320 },
    { enabled: false, x: 30, y: 320 },
]

function main() {
    requestAnimationFrame(frame);

    let viruses = game.selectAll(".virus")
        .data(virusData)
        .enter()
        .append("img");

    viruses.attr("src", (d) => `img/virus_${d.type}.png`)
           .attr("class", (d) => `virus virus-${d.type}`);


    var dragHandler = d3.drag()
        .on("drag", function (d) {
            d3.select(this)
                .style("left", d.x = d3.event.x +'px')
                .style("top", d.y = d3.event.y + 'px');
        });

    let soldierOptions = game.selectAll(".soldier-option")
        .data(soldiersData)
        .enter()
        .append("img")
        .attr("src", "img/soldier.png")
        .attr("class", "soldier-option")
        .style("width", "30px")
        .style("left", (d) => d.x + 'px')
        .style("top", (d) => d.y + 'px')
        .style("width", "30px");

    dragHandler(game.selectAll(".soldier-option"));
    

    setTimeout(() => {
        virusData[1].x = 300;
        virusData[1].y = 300;
    }, 1030);
    setTimeout(() => {
        virusData[1].x = 0;
        virusData[1].y = 0;
    }, 3000);

    // dragHandler(viruses);
}

main();