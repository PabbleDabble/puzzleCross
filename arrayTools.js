function solutionSplit(direction, solution){
    if (!solution)
        solution = initializeSolution('ordered');
    if (!direction || (direction != 'r' && direction != 'c'))
        debugger;
    var size = Math.sqrt(solution.cellData.length);

    if (direction == 'r') {
        var rowSolution = [];
        var pointer = 0;
        for (var i = 0; i < size; i++){
            rowSolution.push(solution.cellData.slice(pointer, pointer += size));
        }
        return rowSolution;
    }
    else if (direction == 'c') {
        var colSolution = [];
        for (var i = 0; i < size; i++){
            var xTemp = [];
            for (var j = 0; j < size; j++){
                xTemp.push(solution.cellData[i + j * 8]);
            }
            colSolution.push(xTemp);
        }
        return colSolution;
    }
}
// This takes a tempSplitSolution (array of structs) and shuffles them back in to the right order
function solutionMerge(direction, lineSolution){
    if (!lineSolution)
        lineSolution = solutionSplit(direction, initializeSolution('ordered'));
    if (!direction || (direction != 'r' && direction != 'c'))
        debugger;

    var size = lineSolution.length;
    var returnArr = [];

    for (var i = 0; i < size; i++){
        for (var j = 0; j < size; j++){
            if (direction == 'r')
                // solutionCellData[i * 8 + j].val = lineSolution[i][j];
                returnArr.push(lineSolution[i][j]);
            else if (direction == 'c') {
                // solutionCellData[i * 8 + j].val = lineSolution[j][i];
                returnArr.push(lineSolution[j][i]);
            }
        }
    }
    return returnArr;
}
// New line (array of values) needs to be added to row of structs key values
function combineArrayAndStruct(newVals, existingArrOfStructs, key){
    if (!newVals || !existingArrOfStructs || 
        !Array.isArray(newVals) || !Array.isArray(existingArrOfStructs) ||
        newVals.length != existingArrOfStructs.length)
        debugger;
    
    if (!key)
        key = 'val';

    // Ensure the object has the key
    if (existingArrOfStructs[0][key] == undefined)
        debugger;

    for (var i = 0; i < newVals.length; i++) {
        if (newVals[i] == solutionYes || newVals[i] == solutionNo) {        
            if (existingArrOfStructs[i][key] ==  solutionDunno){
                existingArrOfStructs[i][key] = newVals[i]
            }
            else if (existingArrOfStructs[i][key] != newVals[i]){
                debugger;
            }
            else {
                // They're the same and we don't care
            }
        }
    }
    return existingArrOfStructs;
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
            debugger;
            // You messed this up
            if (item[key] == compare)
            counter++;        
        }
    });
    return counter;
}