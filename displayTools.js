function showMessage(msg){
    if (Array.isArray(msg)){
        msg = msg.join(breakString);
    }
    $('#userMessage p').first().html(msg);
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
        
        if (i == 0){
            // Blank starter top row just for the visual index
            puzzleHTML += '<tr>';
            puzzleHTML += '<td>';
            puzzleHTML += '';  // This is the invisible top left box
            puzzleHTML += '</td>';
            puzzleHTML += '<td>';
            puzzleHTML += '';  // This is the cell above the origin box
            puzzleHTML += '</td>';
            for (var k = 0; k < size; k++){
                puzzleHTML += '<td class="visualIndex visualColIndex">';
                puzzleHTML += parseInt(k);
                puzzleHTML += '</td>';
            }
            puzzleHTML += '</tr>';
        }
        // This starts the row for the whole puzzle        
        puzzleHTML += '<tr>';

        for (var j = 0; j <= size; j++){

            // This puts the visual index in its place
            if (j == 0){
                if (i == 0){
                    puzzleHTML += '<td>';
                    puzzleHTML += '';  // This is the cell to the left of the origin box
                    puzzleHTML += '</td>';
                }
                else {
                    puzzleHTML += '<td class="visualIndex visualRowIndex" ';
                    puzzleHTML += 'data-visual-index=' + parseInt(i);
                    puzzleHTML += '>';
                    puzzleHTML += parseInt(i-1);
                    puzzleHTML += '</td>';
                }
            }

            // Put in the clues
            if (j > 0 && i == 0){
                puzzleHTML += '<td id="col' + (j-1).toString() + '"';
                puzzleHTML += ' class="clueCell colClue"';
                puzzleHTML += ' data-direction="c" ';
                puzzleHTML += ' data-clue-index=' + parseInt(j-1);
                puzzleHTML += '>';
                // First row = column clues
                puzzleHTML += clues['c'][j-1].vals.join(breakString);
            }
            else if (i > 0 && j == 0) {
                puzzleHTML += '<td id="row' + (i-1).toString() + '"';
                puzzleHTML += ' class="clueCell rowClue"';
                puzzleHTML += ' data-direction="r" ';
                puzzleHTML += ' data-clue-index=' + parseInt(i-1);
                puzzleHTML += '>';
                // First column = row clues
                puzzleHTML += clues['r'][i-1].vals.join(' ');
            }
            else {
                if (i > 0 && j > 0){
                    puzzleHTML += '<td id="r' + (i-1).toString() + 'c' + (j-1).toString() + '" ';
                    puzzleHTML += ' data-rowIndex='+ parseInt(i-1);
                    puzzleHTML += ' data-colIndex='+ parseInt(j-1);
                    puzzleHTML += ' class="pixel"';
                    puzzleHTML += '>';                    
                }
                else if (i == 0 && j == 0){
                    puzzleHTML += '<td ';
                    puzzleHTML += 'class="origin"';
                    puzzleHTML += '>';
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
    $('td.clueCell').on('click',function(event){
        clickClue(event);
    });
    $('td.origin').on('click',function(event){
        clickOrigin(event);
    });
}
function displaySolution(solution){
    zzSln = solution;
    zzCells = solution.cellData;
    zzClues = solution.clueData;

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