// REPO
// https://github.com/PabbleDabble/puzzleCross/blob/master/index.html
// RUN HTML - Local - work computer
// file:///C:/Users/pv0005/Documents/puzzleCross/index.html
// RUN HTML - Local - maggie laptop
// file:///C:/Users/Owner/Desktop/ptvScripting/puzzleCross/index.html
// RUN HTML - Live
// https://rawgit.com/PabbleDabble/puzzleCross/master/index.html

 
 var puzzleID = 'PUZZ_r8c6';
 // var puzzleID = 'PUZZ_r8c6_tweaked';
var breakString = '<br/>';
var MAXSIZE = 15;
var POSSIBLESIZE = [];
var solutionDunno = 0;
var solutionYes = 1;
var solutionNo = 2;
// Console globals - Read only to console / debugging

var zzSln = [];
var zzCells = [];
var zzClues = []

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

function solvePuzzle(){
    // This is the first thing you do to solve the puzzle
    var solutionObject = initializeSolution('blank');
    var clues = solutionObject.clueData;
    var size = clues['c'].length;
    var doCounter = 1;

    // [1,2].concat([3,4]); = [1,2,3,4]
    // [1,2,3,4].slice(2) = [3,4]   // 2 ending values
    // [1,2,3,4].slice(2,3) = [3,4]   // 2=begin, 3=end (not included)
    // [1,2,3,4,5].splice(1,3) = [2,3,4] // 2=begin,3=how many
    // var test =[1,2,3,4,5]; test.unshift(9,8); // test then is [9.8.1.2.3.4.5] // pre-pend

    // XX - Start solve loop
    solutionObject = initialFullLine('r', solutionObject);
    solutionObject = initialFullLine('c', solutionObject);
    solutionObject = singleValueMoreThanHalf('r', solutionObject);
    solutionObject = singleValueMoreThanHalf('c', solutionObject);
    
    do {
        solutionObject.isUpdated = false;
        console.log('Beginning solve loop: ' + doCounter);
        doCounter++;
        if (doCounter < 10){
            solutionObject = lineComplete('r', solutionObject);
            solutionObject = lineComplete('c', solutionObject);
            solutionObject = edgeOfPuzzleIsYes('r', solutionObject);
            solutionObject = edgeOfPuzzleIsYes('c', solutionObject);
        }
        else {
            debugger;
        }
        displaySolution(solutionObject);
    } while (solutionObject.isUpdated);
}



