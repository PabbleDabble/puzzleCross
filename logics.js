/* -------------------- LOGICS -------------------- */
function functionTemplate(direction,solution){
    if (!direction || (direction != 'r' && direction != 'c'))
        debugger;
    var tempSplitSolution = solutionSplit(direction, solution);
    var tempClues = solution.clueData[direction];
    var size = tempClues.length;
    for (var i = 0; i < size; i++){
        if (!tempClues[i].isComplete) {
            // -----------------------------------------------------
            // TEMPLATE TEMPLATE TEMPLATE TEMPLATE TEMPLATE TEMPLATE 
            // -----------------------------------------------------




        }
    } 

    // -----------------------------------------------------
    // TEMPLATE TEMPLATE TEMPLATE TEMPLATE TEMPLATE TEMPLATE 
    // -----------------------------------------------------
    solution.cellData = solutionMerge(direction, tempSplitSolution);
    if (solution.isUpdated) {
        displaySolution(solution);
    }
    return solution;
}





// LOGIC 1
// Line is entirely full from the Beginning
function initialFullLine(direction, solution){
    if (!direction || (direction != 'r' && direction != 'c'))
        debugger;
    var tempSplitSolution = solutionSplit(direction, solution);
    var tempClues = solution.clueData[direction];
    var size = tempClues.length;
    for (var i = 0; i < size; i++){
        if (!tempClues[i].isComplete) {
            // -----------------------------------------------------
            // TEMPLATE TEMPLATE TEMPLATE TEMPLATE TEMPLATE TEMPLATE 
            // -----------------------------------------------------    

            var xSum = tempClues[i].sum;
            // If every value in the clue is accounted for, fill in the solution with the rest no values
            if (xSum + tempClues[i].vals.length - 1 == size){
                solution.clueData[direction][i].isComplete = true;
                solution.isUpdated = true;
                var thisLine = [];
                for (var j = 0; j < tempClues[i].vals.length; j++){            
                    // Push as many YES values to the line
                    thisLine = thisLine.concat(Array.apply(null, Array(tempClues[i].vals[j])).map(Number.prototype.valueOf,solutionYes));
                    // Then push one separator NO value
                    thisLine.push(solutionNo);
                }
                // Remove the last item that was 
                thisLine = thisLine.splice(0,thisLine.length - 1);
                tempSplitSolution[i] = combineArrayAndStruct(thisLine, tempSplitSolution[i], 'val');
            }
        }
    }

    // -----------------------------------------------------
    // TEMPLATE TEMPLATE TEMPLATE TEMPLATE TEMPLATE TEMPLATE 
    // -----------------------------------------------------
    solution.cellData = solutionMerge(direction, tempSplitSolution);
    if (solution.isUpdated) {
        displaySolution(solution);
    }
    return solution;
}
//LOGIC 2
// Line with a single clue for it with more than have the size
function singleValueMoreThanHalf(direction, solution){
    if (!direction || (direction != 'r' && direction != 'c'))
        debugger;
    var tempSplitSolution = solutionSplit(direction, solution);
    var tempClues = solution.clueData[direction];
    var size = tempClues.length;
    for (var i = 0; i < size; i++){
        if (!tempClues[i].isComplete) {
            // -----------------------------------------------------
            // TEMPLATE TEMPLATE TEMPLATE TEMPLATE TEMPLATE TEMPLATE 
            // -----------------------------------------------------
            
            if (tempClues[i].vals.length == 1 && tempClues[i].vals[0] > (size/2)){
                solution.isUpdated = true;
                var middleChunk = tempClues[i].vals[0];
                var endCapSize = size - middleChunk;
                var middleSize = size - endCapSize * 2;
                var endCaps = Array.apply(null, Array(endCapSize)).map(Number.prototype.valueOf,solutionDunno);
                var middle = Array.apply(null, Array(middleSize)).map(Number.prototype.valueOf,solutionYes);
                var newLine = endCaps.concat(middle.concat(endCaps));
                
                // tempSplitSolution[i] = mergeLines(newLine, tempSplitSolution[i]);
                tempSplitSolution[i] = combineArrayAndStruct(newLine, tempSplitSolution[i], 'val');
            }
        }
    }

    // -----------------------------------------------------
    // TEMPLATE TEMPLATE TEMPLATE TEMPLATE TEMPLATE TEMPLATE 
    // -----------------------------------------------------
    solution.cellData = solutionMerge(direction, tempSplitSolution);
    if (solution.isUpdated) {
        displaySolution(solution);
    }
    return solution;
}
// LOGIC 3
// If there are as many yes's in the line as equal to the clue sum for that line
function lineComplete(direction, solution){
    if (!direction || (direction != 'r' && direction != 'c'))
        debugger;
    var tempSplitSolution = solutionSplit(direction, solution);
    var tempClues = solution.clueData[direction];
    var size = tempClues.length;
    for (var i = 0; i < size; i++){
        if (!tempClues[i].isComplete) {
            // -----------------------------------------------------
            // TEMPLATE TEMPLATE TEMPLATE TEMPLATE TEMPLATE TEMPLATE 
            // -----------------------------------------------------
            var clueSum = tempClues[i].sum;
            var solutionYesCount = occurrence(tempSplitSolution[i], solutionYes, 'val');
            if (clueSum == solutionYesCount){
                solution.isUpdated = true;
                solution.clueData[direction][i].isComplete = true;

                tempSplitSolution[i].forEach(function(item, j) {
                    if (item.val == solutionDunno)
                        tempSplitSolution[i][j].val = solutionNo;
                });
            }
        }        
    }

    // -----------------------------------------------------
    // TEMPLATE TEMPLATE TEMPLATE TEMPLATE TEMPLATE TEMPLATE 
    // -----------------------------------------------------
    solution.cellData = solutionMerge(direction, tempSplitSolution);
    if (solution.isUpdated) {
        displaySolution(solution);
    }
    return solution;
}
//LOGIC 4
// If there is a yes on an edge of a line (top, bot, left, right), 
// then you know that clue is confirmed, walk backwards then add a NO
function edgeOfPuzzleIsYes(direction, solution){
    if (!direction || (direction != 'r' && direction != 'c'))
        debugger;
    var tempSplitSolution = solutionSplit(direction, solution);
    var tempClues = solution.clueData[direction];
    var size = tempClues.length;
    for (var i = 0; i < size; i++){
        if (!tempClues[i].isComplete) {
            // -----------------------------------------------------
            // TEMPLATE TEMPLATE TEMPLATE TEMPLATE TEMPLATE TEMPLATE 
            // -----------------------------------------------------

            var clueVals = tempClues[i].vals;
            // First edge
            var clueIndex = 0;
            if(tempSplitSolution[i][0].val == solutionYes){
                solution.isUpdated = true;
                
                var yesChunkSize = clueVals[clueIndex];
                var yesChunk = Array.apply(null, Array(yesChunkSize)).map(Number.prototype.valueOf,solutionYes);

                // Start with the yes chunk
                var newLine = yesChunk;
                // Add a no
                newLine.push(solutionNo);

                // Finish it with dunnos
                var dunnoChunkSize = size - newLine.length;
                var dunnoChunk = Array.apply(null, Array(dunnoChunkSize)).map(Number.prototype.valueOf,solutionDunno);

                // New + Dunno
                newLine = newLine.concat(dunnoChunk);

                tempSplitSolution[i] = combineArrayAndStruct(newLine, tempSplitSolution[i], 'val');
            } 
            // Ending edge
            var clueIndex = clueVals.length - 1;
            if(tempSplitSolution[i][size - 1].val == solutionYes) {
                solution.isUpdated = true;

                // Begin the yes chunk
                var yesChunkSize = clueVals[clueIndex];
                var yesChunk = Array.apply(null, Array(yesChunkSize)).map(Number.prototype.valueOf,solutionYes);

                // Start with a no...
                var newLine = [solutionNo];
                // Add the yes's to the end of it
                newLine = newLine.concat(yesChunk);

                // The dunnos will be the full size minus what we just made
                var dunnoChunkSize = size - newLine.length;
                var dunnoChunk = Array.apply(null, Array(dunnoChunkSize)).map(Number.prototype.valueOf,solutionDunno);
                // Put dunnos in front of it
                newLine = dunnoChunk.concat(newLine);

                tempSplitSolution[i] = combineArrayAndStruct(newLine, tempSplitSolution[i], 'val');
            }
        }    
    }

    // -----------------------------------------------------
    // TEMPLATE TEMPLATE TEMPLATE TEMPLATE TEMPLATE TEMPLATE 
    // -----------------------------------------------------
    solution.cellData = solutionMerge(direction, tempSplitSolution);
    if (solution.isUpdated) {
        displaySolution(solution);
    }
    return solution;
}