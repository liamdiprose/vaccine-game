


function frame() {

    let game = d3.select("#game")
        // .selectAll("circle")
        // .text(function (d) { return d; });

    let circles = game.selectAll("circle")
        .data(["red", "blue", "orange"])
        //.enter()
        //.append("circle")
        .transition()
        .attr("cx", () => Math.random() * 400)
        .attr("cy", () => Math.random() * 400)
        .attr("r", () => 3)
        .style("fill", (color) => color);

    requestAnimationFrame(frame);
}

requestAnimationFrame(frame);
