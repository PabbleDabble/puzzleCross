function clickPixel(event){
    // console.log(event.target.id);
    var pixelID = event.target.id;
    if ($(event.target).hasClass("YES")){
        $(event.target).removeClass("YES");
        $(event.target).addClass("NO");
    }
    else if ($(event.target).hasClass("NO")){
        $(event.target).removeClass("NO");            
    }
    else {
        $(event.target).addClass("YES");
    }
    console.log('--------------------');

    console.log($(event.target).data());
    var i = $(event.target).data().rowindex;
    var j = $(event.target).data().colindex;


    console.log('R:' + i + ' / C:' + j);
    console.log(zzCells[i * 8 + j].val);
    
}
function clickClue(event){
    // console.log(event.target.id);
    var clueID = event.target.id;
    var direction = $(event.target).data().direction;
    var index = $(event.target).data().clueIndex;
    console.log('--------------------');
    console.log(clueID);
    console.log(direction);
    console.log(zzClues[direction][index]);

}
function clickOrigin(event){
    // console.log(event);
    console.log(zzSln);
    console.log(zzCells);
    console.log(zzClues);
}
