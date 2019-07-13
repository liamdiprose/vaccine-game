

let game = d3.select("body")

function frame() {

        // .selectAll("circle")
        // .text(function (d) { return d; });

    let circles = game.selectAll(".virus")
        .data(["red", "blue", "orange"])
        //.enter()
        //.append("circle")
        .style("fill", (color) => color)
        .transition()
        .style("top", () => '' + Math.random() * 400 + 'px')
        .style("left", () => '' + Math.random() * 400 + 'px')
        //.attr("r", () => 10);

    requestAnimationFrame(frame);
}

requestAnimationFrame(frame);


var dragHandler = d3.drag()
    .on("drag", function () {
        d3.select(this)
            .attr("cx", d3.event.x)
            .attr("cy", d3.event.y);
    });

let newCircle = dragHandler(game.select("#new-circle"));
