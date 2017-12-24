// REPO
// https://github.com/PabbleDabble/puzzleCross/blob/master/index.html
// RUN HTML - Local
// file:///C:/Users/pv0005/Documents/puzzleCross/index.html
// RUN HTML - Live
// https://rawgit.com/PabbleDabble/puzzleCross/master/index.html

 // test  ssss
var puzzleID = 'PUZZ_r8c6';
// var puzzleID = 'PUZZ_r8c6_tweaked';
var breakString = '<br/>';
var MAXSIZE = 15;
var POSSIBLESIZE = [];
var solutionDunno = 0;
var solutionYes = 1;
var solutionNo = 2;
var xxSLN = [];
var xxCLUE = []

const reducer = (accumulator, currentValue) => accumulator + currentValue;


for (var i = 0; i < 15; i++){
    POSSIBLESIZE.push(i+1);
}

$(document).ready(function(){
    // I don't know why this is needed....
    document.getElementById("size").addEventListener("wheel", function(){});

    $('#createPuzzle').on('click',function(){
        makePuzzle();
    });

    $('#solvePuzzle').on('click',function(){
        solvePuzzle();
    });

    makePuzzle();
    solvePuzzle();

});
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

    var i = $(event.target).data().rowindex - 1;
    var j = $(event.target).data().colindex - 1;


    console.log('R:' + i + ' / C:' + j);
    console.log(solutionArr[i * 8 + j].val);
    
}
function displaySolution(solution){

    var pixels = solution.cellData.length;
    var size = Math.sqrt(pixels);

    if (parseInt(size) !== size){
        showMessage('Incorrect solution size');
    }
    clearSolution();
    for (var i = 0; i < size; i++){
        if (solution.clueData['c'][i].isComplete){
            $('td#col' + i).addClass('COMPLETE');
        }
        if (solution.clueData['r'][i].isComplete){
            $('td#row' + i).addClass('COMPLETE');
        }

        for (var j = 0; j < size; j++){
            var xTemp = solution.cellData[i*size + j].val;
            if (xTemp == solutionYes){
                $('#r' + i + 'c' + j + '.pixel').addClass('YES');
            } else if (xTemp == solutionNo){
                $('#r' + i + 'c' + j + '.pixel').addClass('NO');
            }
        }
    }


}
function clearSolution(){
    $('.clueCell').removeClass('COMPLETE');
    $('.pixel').removeClass('YES');
    $('.pixel').removeClass('NO');
}
function getClues(divID){
    if (!divID)
        divID = $(".clueDiv").first().attr('id');
    var tempColClues = $('#' + divID + ' #colClues').html();
    var tempRowClues = $('#' + divID + ' #rowClues').html();

    tempColClues = tempColClues.split(',');
    tempRowClues = tempRowClues.split(',');

    for (var i = 0; i < tempColClues.length; i++){
        tempColClues[i] = $.map(tempColClues[i].trim().split('-'), function(value){
            return parseInt(value, 10);
            // or return +value; which handles float values as well
        });
        tempRowClues[i] = $.map(tempRowClues[i].trim().split('-'), function(value){
            return parseInt(value, 10);
            // or return +value; which handles float values as well
        });
    }

    var tempClues = {
        r: [],
        c: []
    };
    for (var i = 0; i < tempColClues.length; i++){
        var tempColStruct = {vals: [], sum: 0, isComplete: false};
        var tempRowStruct = {vals: [], sum: 0, isComplete: false};
        tempColStruct.vals = tempColClues[i];
        tempRowStruct.vals = tempRowClues[i];
        tempColStruct.sum = tempColClues[i].reduce(reducer);
        tempRowStruct.sum = tempRowClues[i].reduce(reducer);
        tempClues['c'].push(tempColStruct);
        tempClues['r'].push(tempRowStruct);
    }    
    return tempClues;
}
function makePuzzle(){
    // This is the first thing you do to make the puzzle
    var solutionObject = initializeSolution('blank');
    var clues = solutionObject.clueData;
    

    $('#puzzleContainer').html('');
    // var size = parseInt($('#size').val());

    var size = clues['c'].length;

    if (!POSSIBLESIZE.includes(size)) {
        showMessage('Bad Puzzle Size');
        return;
    }
    if (clues['c'].length != size || 
        clues['r'].length != size ||
        clues['c'].length != clues['r'].length) {
        var msg = [];
        msg.push('Size: ' + size);
        msg.push('Cols: ' + clues['c'].length);
        msg.push('Rows: ' + clues['r'].length);
        showMessage(msg);
        return;
    }

    showMessage('Make Puzzle: ' + size);

    // console.log(clues['c'].vals);
    // console.log(clues['r'].vals);

    var puzzleHTML = '';
    puzzleHTML += '<table>';

    for (var i = 0; i <= size; i++){
        puzzleHTML += '<tr>';

        for (var j = 0; j <= size; j++){
            // Put in the clues
            if (j > 0 && i == 0){
                puzzleHTML += '<td id="col' + (j-1).toString() + '" class="clueCell colClue">';
                // First row = column clues
                puzzleHTML += clues['c'][j-1].vals.join(breakString);
            }
            else if (i > 0 && j == 0) {
                puzzleHTML += '<td id="row' + (i-1).toString() + '" class="clueCell rowClue">';
                // First column = row clues
                puzzleHTML += clues['r'][i-1].vals.join(' ');
            }
            else {
                if (i > 0 && j > 0){
                    puzzleHTML += '<td id="r' + (i-1).toString() + 'c' + (j-1).toString() + '" ';
                    puzzleHTML += ' data-rowIndex='+i;
                    puzzleHTML += ' data-colIndex='+i;
                    puzzleHTML += ' class="pixel">';
                    
                    
                }
                else {
                    puzzleHTML += '<td>';
                }
                // This is what is inside the empty cells
                puzzleHTML += '';
            }
            puzzleHTML += '</td>';
        }

        puzzleHTML += '</tr>';
    }
    puzzleHTML += '</table>';
    $('#puzzleContainer').html(puzzleHTML);
    
    // This must be done after the puzzle has been made
    $('td.pixel').on('click',function(event){
        clickPixel(event);
    });
    xxSLN = solutionObject.cellData;
    xxCLUE = solutionObject.clueData;
}
function solvePuzzle(){
    // This is the first thing you do to solve the puzzle
    var solutionObject = initializeSolution('blank');
    var clues = solutionObject.clueData;
    var size = clues['c'].length;



    var solutionUpdated = false;
    var doCounter = 1;

    // [1,2].concat([3,4]); = [1,2,3,4]
    // [1,2,3,4].slice(2) = [3,4]   // 2 ending values
    // [1,2,3,4].slice(2,3) = [3,4]   // 2=begin, 3=end (not included)
    // [1,2,3,4,5].splice(1,3) = [2,3,4] // 2=begin,3=how many
    // var test =[1,2,3,4,5]; test.unshift(9,8); // test then is [9.8.1.2.3.4.5] // pre-pend


    initialFullLine('r', solutionObject);
    initialFullLine('c', solutionObject);
    singleValueMoreThanHalf('r', solutionObject);
    singleValueMoreThanHalf('c', solutionObject);
    
    // XX - Start solve loop
    do {
        solutionUpdated = false;
        console.log('Beginning solve loop: ' + doCounter);
        doCounter++;
        
        return;

        if (doCounter < 10){
            solutionUpdated = lineComplete('r', solutionObject);
            solutionUpdated = lineComplete('c', solutionObject);
            solutionUpdated = edgeOfPuzzleIsYes('r', solutionObject);
            solutionUpdated = edgeOfPuzzleIsYes('c', solutionObject);
        

        }
        else 
            debugger;
        displaySolution(solutionObject);
    } while (solutionUpdated);
}

/* -------------------- LOGICS -------------------- */
function functionTemplate(direction){
    if (!direction || (direction != 'r' && direction != 'c'))
        debugger;

    var tempSplitSolution = solutionSplit(direction, solution.cellData);
    var tempClues = clues[direction];
    var size = tempClues.length;
    var solutionUpdated = false;
    for (var i = 0; i < size; i++){
        if (!tempClues[i].isComplete) {




        }
    }    
    if (solutionUpdated) {
        solution.cellData = solutionMerge(direction, tempSplitSolution, solution.cellData);
        displaySolution(solution);
    }
    return {wasUpdate: solutionUpdated, solution: solution};
}
function edgeOfPuzzleIsYes(direction, solution){
    if (!direction || (direction != 'r' && direction != 'c'))
        debugger;

    var tempSplitSolution = solutionSplit(direction, solution.cellData);
    var tempClues = solution.clueData[direction];
    var size = tempClues.length;
    var solutionUpdated = false;
    for (var i = 0; i < size; i++){
        if (!tempClues[i].isComplete) {
            var clueVals = tempClues[i].vals;
            // First edge
            var clueIndex = 0;
            if(tempSplitSolution[i][0] == solutionYes){
                solutionUpdated = true;
                
                var yesChunkSize = clueVals[clueIndex];
                var yesChunk = Array.apply(null, Array(yesChunkSize)).map(Number.prototype.valueOf,solutionYes);

                var newLine = yesChunk;
                newLine.push(solutionNo);

                var dunnoChunkSize = size - newLine.length;
                var dunnoChunk = Array.apply(null, Array(dunnoChunkSize)).map(Number.prototype.valueOf,solutionDunno);
                newLine = newLine.concat(dunnoChunk);

                tempSplitSolution[i] = mergeLines(newLine, tempSplitSolution[i]);
            } 
            // Ending edge
            var clueIndex = clueVals.length - 1;
            if(tempSplitSolution[i][size - 1] == solutionYes) {
                solutionUpdated = true;

                var yesChunkSize = clueVals[clueIndex];
                var yesChunk = Array.apply(null, Array(yesChunkSize)).map(Number.prototype.valueOf,solutionYes);

                // Start with a no...
                var newLine = [solutionNo];
                // Add the yes's to the end of it
                newLine = newLine.concat(yesChunk);

                var dunnoChunkSize = size - newLine.length;
                var dunnoChunk = Array.apply(null, Array(dunnoChunkSize)).map(Number.prototype.valueOf,solutionDunno);
                // Put dunnos in front of it
                newLine = dunnoChunk.concat(newLine);

                tempSplitSolution[i] = mergeLines(newLine, tempSplitSolution[i]);
            }
        }    
    }    
    if (solutionUpdated) {
        solution.cellData = solutionMerge(direction, tempSplitSolution, solution.cellData);
        displaySolution(solution);
    }
    return {wasUpdate: solutionUpdated, solution: solution};
}
function lineComplete(direction, solution){
    if (!direction || (direction != 'r' && direction != 'c'))
        debugger;

    var tempSplitSolution = solutionSplit(direction, solution.cellData);
    var tempClues = solution.clueData[direction];
    var size = tempClues.length;
    var solutionUpdated = false;

    for (var i = 0; i < size; i++){
        if (!tempClues[i].isComplete) {
            var clueSum = tempClues[i].sum;
            var solutionYesCount = occurrence(tempSplitSolution[i], solutionYes, 'val');
            if (clueSum == solutionYesCount){
                solutionUpdated = true;
                solution.clueData[direction][i].isComplete = true;
                tempSplitSolution[i].forEach(function(item, j) {
                    if (item == solutionDunno)
                        tempSplitSolution[i][j] = solutionNo;
                });
            }
        }        
    }

    if (solutionUpdated) {
        solution.cellData = solutionMerge(direction, tempSplitSolution, solution.cellData);
        displaySolution(solution);
    }
    return {wasUpdate: solutionUpdated, solution: solution};
}
function singleValueMoreThanHalf(direction, solution){
    if (!direction || (direction != 'r' && direction != 'c'))
        debugger;
    var clues = solution.clueData;

    // Line is single values more than half width
    var tempSplitSolution = solutionSplit(direction, solution.cellData);
    var tempClues = clues[direction];
    var size = tempClues.length;
    var solutionUpdated = false;
    for (var i = 0; i < size; i++){
        if (tempClues[i].vals.length == 1 && tempClues[i].vals[0] > (size/2)){
            solutionUpdated = true;
            var middleChunk = tempClues[i].vals[0];
            var endCapSize = size - middleChunk;
            var middleSize = size - endCapSize * 2;
            var endCaps = Array.apply(null, Array(endCapSize)).map(Number.prototype.valueOf,solutionDunno);
            var middle = Array.apply(null, Array(middleSize)).map(Number.prototype.valueOf,solutionYes);
            var newLine = endCaps.concat(middle.concat(endCaps));
            
            tempSplitSolution[i] = mergeLines(newLine, tempSplitSolution[i]);

        }
    }
    if (solutionUpdated) {
        solution.cellData = solutionMerge(direction, tempSplitSolution, solution.cellData);
        displaySolution(solution);
    }
    return {wasUpdate: solutionUpdated, solution: solution};
}
function initialFullLine(direction, solution){
    if (!direction || (direction != 'r' && direction != 'c'))
        debugger;

    // Line is entirely full from the Beginning
    var tempSplitSolution = solutionSplit(direction, solution.cellData);
    var tempClues = solution.clueData[direction];

    var size = tempClues.length;
    var solutionUpdated = false;
    for (var i = 0; i < size; i++){
        if (!tempClues[i].isComplete) {

            var xSum = tempClues[i].sum;
            // for (var j = 0; j < tempClues[i].length; j++){
            //     xSum += tempClues[i][j];
            // }
            // If every value in the clue is accounted for, fill in the solution with the rest no values
            if (xSum + tempClues[i].vals.length - 1 == size){
                solution.clueData[direction][i].isComplete = true;
                solutionUpdated = true;
                var thisLine = [];
                for (var j = 0; j < tempClues[i].vals.length; j++){            
                    // Push as many YES values to the line
                    thisLine = thisLine.concat(Array.apply(null, Array(tempClues[i].vals[j])).map(Number.prototype.valueOf,solutionYes));
                    // Then push one separator NO value
                    thisLine.push(solutionNo);
                }
                thisLine = thisLine.splice(0,thisLine.length - 1);
                tempSplitSolution[i] = thisLine;
            }
        }
    }
    if (solutionUpdated) {
        solution.cellData = solutionMerge(direction, tempSplitSolution, solution.cellData);
        displaySolution(solution);
    }
    return {wasUpdate: solutionUpdated, solution: solution};
}




function puzzleComplete(solution){
    var cols = solutionSplit('c', solution.cellData);
    var rows = solutionSplit('r', solution.cellData);
    var size = cols.length;
    var rowDone = [];
    var colDone = [];

    for (var i = 0; i < size; i++){
        if (occurrence(cols[i], solutionYes, 'val') == solution.clueData['c'][i].sum){
            colDone.push(i);
        }
        else if (occurrence(cols[i], solutionYes, 'val') > solution.clueData['c'][i].sum){
            console.log('Col ' + i + ' has been solved incorrectly!!');
        }


        if (occurrence(rows[i], solutionYes, 'val') == solution.clueData['r'][i].sum){
            rowDone.push(i);
        }
        else if (occurrence(rows[i], solutionYes, 'val') > solution.clueData['r'][i].sum){
            console.log('Row ' + i + ' has been solved incorrectly!!');
        }
    }
    if (colDone.length == size && rowDone.length == size){
        return true;
    }
    else {
        console.log('Cols Done: ' + colDone.length + '/' + size);
        console.log('Cols Done: ' + colDone.join(','));

        console.log('Rows Done: ' + rowDone.length + '/' + size);
        console.log('Rows Done: ' + rowDone.join(','));
    }
    return false;
}
function mergeLines(newA, oldA){
    if(!Array.isArray(newA) || !Array.isArray(oldA) || newA.length != oldA.length)
        debugger;
    
    for (var i = 0; i < oldA.length; i++) {
        if (newA[i] == solutionYes || newA[i] == solutionNo) {
            if (oldA[i] ==  solutionDunno){
                oldA[i] = newA[i]
            }
            else {
                if (oldA[i] != newA[i]){
                    debugger;
                }
                else {
                    oldA[i] = newA[i]
                }
            }
        }
    }
    return oldA;
}

function solutionSplit(direction, solution){
    if (!solution)
        solution = initializeSolution(getClues(),'ordered');
    if (!direction || (direction != 'r' && direction != 'c'))
        debugger;
    var size = Math.sqrt(solution.length);

    if (direction == 'r') {
        var rowSolution = [];
        var pointer = 0;
        for (var i = 0; i < size; i++){
            rowSolution.push(solution.slice(pointer, pointer += size));
        }
        return rowSolution;
    }
    else if (direction == 'c') {
        var colSolution = [];
        for (var i = 0; i < size; i++){
            var xTemp = [];
            for (var j = 0; j < size; j++){
                xTemp.push(solution[i + j * 8]);
            }
            colSolution.push(xTemp);
        }
        return colSolution;
    }
}
function solutionMerge(direction, lineSolution, solutionCellData){
    if (!lineSolution)
        lineSolution = solutionSplit(direction, initializeSolution(getClues(),'ordered'));
    if (!direction || (direction != 'r' && direction != 'c'))
        debugger;

    var size = lineSolution.length;

    for (var i = 0; i < size; i++){
        for (var j = 0; j < size; j++){
            if (direction == 'r')
                solutionCellData[i * 8 + j].val = lineSolution[i][j];
            else if (direction == 'c') {
                solutionCellData[i * 8 + j].val = lineSolution[j][i];
            }
        }
    }
    return solutionCellData;
}
function showMessage(msg){
    if (Array.isArray(msg)){
        msg = msg.join(breakString);
    }
    $('#userMessage p').first().html(msg);
}
function occurrence(arr, compare, key) {
    var counter = 0;
    arr.forEach(function(item){
        // console.log(item);
        if (key){
            if (item[key] == compare)
            counter++;        
        }
        else {
            if (item[key] == compare)
            counter++;        
        }
    });
    return counter;
}
function initializeSolution(valueObject){
    var solutionObject = {cellData: [], clueData: getClues()};
    var size = solutionObject.clueData['c'].length;
    if (!POSSIBLESIZE.includes(size)) {
        debugger;
        return;
    }
    if (!valueObject)
        debugger;

    var useRandom = false;
    var useOrdered = false;
    var useSingleValue = false;

    if (typeof valueObject == 'string'){
        if (valueObject == 'random')
            useRandom = true;
        else if (valueObject == 'ordered')
            useOrdered = true;            
        else if (valueObject == 'blank'){
            useSingleValue = true;
            valueObject = solutionDunno;
        }
        else 
            debugger;
    }
    else if (typeof valueObject == 'number'){
        useSingleValue = true;
    }

    for (var i = 0; i < size * size; i++){
        var xVal = -1;
        if (useRandom)
            xVal = parseInt(Math.random() * (Math.max(solutionYes,solutionNo,solutionDunno)+1));
        else if (useOrdered)
            xVal = i;
        else if (useSingleValue)
            xVal = valueObject;
            solutionObject.cellData.push({val: xVal});
    }
    xxSLN = solutionObject.cellData;
    xxCLUE = solutionObject.clueData;
    return solutionObject;
}