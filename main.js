let $ = document.querySelector.bind(document);
let $$ = document.querySelectorAll.bind(document);
let limitFrames = 20;
let vd = [];
function frame () {
    let viruses = $$('.virus');

    // console.log(viruses);
    while (vd.length < viruses.length) {
        vd.push({
            pos: [Math.random() * 40, Math.random()*40],
        });
    }
    let i = 0;
    for (let v of viruses) {
        // console.log(v);
        v.style.backgroundColor = 'red';
        vd[i].pos[0]++;
        vd[i].pos[1]++;
        v.style.left = vd[i].pos[0].toString() + 'px';
        v.style.top = vd[i].pos[1].toString() + 'px';
        i++;
    }
    if (limitFrames-- > 0)
    requestAnimationFrame(frame);
}
requestAnimationFrame(frame);