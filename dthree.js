
let game = d3.select("#game")

let virusData = [
    { x: 3, y: 3, r: 4 },
    { x: 3, y: 3, r: 4 },
    { x: 3, y: 3, r: 4 }
];

   

function frame() {


    let circles = game.selectAll(".virus")
        .data(["red", "blue", "orange"])
        //.enter()
        //.append("circle")
        .transition()
        .style("top", () => '' + Math.random() * 400 + 'px')
        .style("left", () => '' + Math.random() * 400 + 'px')
        //.attr("r", () => 10);

    requestAnimationFrame(frame);
}

function randomVirus() {
    var ran = Math.floor(Math.random() * 3);

    switch (ran) {
        case 0:
            return "img/virus1.png";
        case 1:
            return "img/virus2.png";
        case 2:
            return "img/virus3.png";
    }
}

function main() {
    requestAnimationFrame(frame);

    let viruses = game.selectAll(".virus")
        .data(virusData)
        .enter()
        .append("img");

    viruses.attr("src", randomVirus)
           .attr("class", "virus");


    var dragHandler = d3.drag()
        .on("drag", function () {
            d3.select(this)
                .attr("left", d3.event.x)
                .attr("top", d3.event.y);
        });

    dragHandler(viruses);
}

main();