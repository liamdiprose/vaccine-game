
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

function main() {
    requestAnimationFrame(frame);

    let viruses = game.selectAll(".virus")
        .data(virusData)
        .enter()
        .append("img");

    viruses.attr("src", (d) => `img/virus_${d.type}.png`)
           .attr("class", (d) => `virus virus-${d.type}`);


    var dragHandler = d3.drag()
        .on("drag", function () {
            d3.select(this)
                .style("left", '' + d3.event.x +'px')
                .style("top", '' + d3.event.y + 'px');
        });

    soliderOptions = d3.selectAll(".soldier-option");

    dragHandler(soliderOptions);
    

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