console.log('confetti ');

const frame = document.querySelector('.frame'),
    row = [(<HTMLElement>frame).querySelector('.row')],
    struc = [(<HTMLElement>row[0]).querySelector('.struc')],
    strucCloned = struc[0].cloneNode(true),
    spheres: any = [],
    tl:Array<TimelineMax> = [];

row[0].appendChild(strucCloned);
struc.push(<Element>strucCloned);

function cloneRow() {
    const rowCloned = row[0].cloneNode(true);
    frame.appendChild(rowCloned);
    row.push(<Element>rowCloned);
}
cloneRow();
cloneRow();



let targetStruc = document.querySelectorAll('.struc');
for (let i = 0; i < targetStruc.length; i++) {
    if(i > 1){
        struc.push(targetStruc[i]);
    }

}

for (let i = 0; i < struc.length; i++) {
    spheres.push(struc[i].querySelectorAll('.sphere'));
    tl.push(new TimelineMax({paused: true, repeat: -1}));
    //tl.push(new TimelineMax({paused: true, repeat: -1}));
}


let duration = 4, // time for one sphere to go from right to left
    interval = 1, // time between 2 spheres appearing
    tlDelay = interval * ( spheres[0].length + 1 ) - duration, // time between the start of one timeline and the other's
    w = ( frame.clientWidth + spheres[0][0].clientWidth + 100 ) / 2; // assuming same size for every sphere and adding an arbitrary 100px margin

for (let i = 0; i < spheres.length; i++) {
    console.log(spheres[i]);
    tl[i].staggerFromTo(spheres[i], duration, {x: -w }, {x: w , ease: Linear.easeNone}, interval)
        .staggerTo(spheres[i], duration / 6, {scale: 1.25}, 1 , duration / 6)
        .staggerTo(spheres[i], duration / 6, {scale: 1}, 1 , duration * 4 / 6);

    /*tl[i].staggerFromTo(spheres[i], duration, {x: w}, {x: -w, ease: Linear.easeNone}, interval)
        .staggerTo(spheres[i], duration / 6, {scale: 1.25}, interval, duration / 6)
        .staggerTo(spheres[i], duration / 6, {scale: 1}, interval, duration * 4 / 6);*/
    if ( i % 2 === 0 ) {
        console.log(tl[i]);
        tl[i].delay(interval * spheres[0].length);
        //tl[1].delay(interval * spheres[0].length);
    }


    tl[i].repeatDelay(0).play();
}

frame.addEventListener('mouseenter', toggleTLplay);
frame.addEventListener('mouseleave', toggleTLplay);

function toggleTLplay():void {
    tl.forEach(tl => {
        if(tl.paused()) {
            tl.play();
        }else {
            tl.pause();
        }
    });
}
