function initializeSolution(valueObject){
    var solutionObject = {
        cellData: [], 
        clueData: getClues(),
        isUpdated: false
    };
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

    zzSln = solutionObject;
    zzCells = solutionObject.cellData;
    zzClues = solutionObject.clueData;
    return solutionObject;
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
function puzzleComplete(solution){
    var cols = solutionSplit('c', solution);
    var rows = solutionSplit('r', solution);
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


