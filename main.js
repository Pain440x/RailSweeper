var twidth = 5;
var theight = 5;
var mineCount = 5;
var tilesCheckedCount = 0;
var bonusTilesFound = 0;
var mineChar = "&#x2260";
var trainChar = "&#x1F682";//"≠";
var gameOver = 0;

resetGame(twidth,theight,mineCount);
//createMyTable();
//addMines(mineCount,twidth,theight);
//updateInputText();
//showData(  );
function resetGame() {
    gameOver = 0;
    tilesCheckedCount = 0;
    bonusTilesFound = 0;
    twidth = parseInt(document.getElementById("inputWidth").value);
    theight = parseInt(document.getElementById("inputHeight").value)
    mineCount = parseInt(document.getElementById("inputMineCount").value);

    createMyTable();
    addMines(mineCount,twidth,theight);
    updateInputText();
}
function options(elem){
  id = document.getElementById("optionsDiv");
  cDisplay = id.style.display;
  if (cDisplay == "none") {
    id.style.display = "block";
    elem.innerHTML = "Hide Options";
  }else {
    id.style.display = "none";
    elem.innerHTML = "Options";
  }
}
function updateInputText(){
    document.getElementById("xWidth").innerHTML = "Width= " +document.getElementById("inputWidth").value;
    document.getElementById("yHeight").innerHTML = "Height= " + document.getElementById("inputHeight").value;
    document.getElementById("inputMineCount").setAttribute("max",(parseInt(document.getElementById("inputWidth").value) +1) *
        (parseInt(document.getElementById("inputHeight").value) + 1) -1);
    document.getElementById("textMineCount").innerHTML = "Mine Count= " +document.getElementById("inputMineCount").value;
}

function userclicked(elem) {
    if (gameOver) {return;}
    var tiledata = elem.getAttribute("data-myvalue");
    if (tiledata == mineChar ) {
        showData();
        gameOver = 1;
        showEndGameAlert();
    }else {
        bonusTilesFound += isBonusTile(elem);
        revealWarningLessTile(elem);
        document.getElementById("scoreHeading").innerHTML = trainChar + trainChar + "Score = "+
            Math.ceil(tilesCheckedCount * calculateScoreMultipliers() +
            bonusTilesFound * calculateScoreMultipliers(1)) +
            trainChar + trainChar;
    }
}
function isBonusTile(elem) {

    var tileindex = elem.id.replace( "tile",""); // tile string is hardcoded in createMyTable()
    tileindex = Number(tileindex );
    var validNeighborsArray = getValidTileNeighbors(tileindex,twidth,theight );
    if (validNeighborsArray.length < 1 ) {return 0;}

    var minesC = 0;
    for (var i = 0; i < validNeighborsArray.length; i++) {
        var workElem = document.getElementById( "tile" + validNeighborsArray[i]);
        var elemdata = workElem.getAttribute("data-myvalue")
        if ( elemdata == 0) {return 0;}
        if ( elemdata == mineChar ) {minesC ++;}

    }
    if (minesC > 8) {minesC = 8; console.log("minesC was greater than 8. How?");}
    return minesC * 0.125;

}
function showEndGameAlert(victory){
    var score = Math.ceil(tilesCheckedCount * calculateScoreMultipliers() + bonusTilesFound * calculateScoreMultipliers(true));
    if (victory) {
        alert("Victory! Rails Cleared \nScore = " + score);
    }else {
        alert("Game Over \n Score = " + score);
    }
}
function calculateScoreMultipliers(dat) {
    // Please don't ask.... just don't.
    // ok, ok, this is my weird calculations to come up with a score.

    // P.S. dat = 1 will return bonusPointsMultiplier. Anything esle will return normalPointsMultiplier
    var totalcells = (twidth + 1) * (theight + 1);
    var minecount = mineCount;
    var minePercentage = minecount / totalcells;
    var pieOver180 = Math.PI / 180;
    var maximumMinePercentage = (totalcells - 1) / totalcells;
    var maximumMinePercentageTo90DegreeRatio = (45 * maximumMinePercentage) + 45;
    var bonusPointsMultiplier = Math.tan(maximumMinePercentageTo90DegreeRatio * pieOver180) * minePercentage;

    var minePercentageTo90DegreeRatio = (45 * minePercentage) + 45;
    var normalPointsMultiplier = Math.tan(minePercentageTo90DegreeRatio * pieOver180) * minePercentage;
    if (dat == 1) {return bonusPointsMultiplier;}else {return normalPointsMultiplier;}

}

function trackCheckedTiles(elem ) {
    elem.setAttribute("class","checked");
    if (elem.getAttribute("data-myvalue") == mineChar) { return ;}
    tilesCheckedCount++
    if (tilesCheckedCount + mineCount >= (twidth + 1) * (theight + 1)) {showEndGameAlert(1);}
}

function revealWarningLessTile(elem) {
    if (elem.getAttribute("class") != "unchecked") {return;}
    trackCheckedTiles(elem);

    if (elem.getAttribute("data-myvalue") != 0) {
        elem.innerHTML = elem.getAttribute("data-myvalue");
        return;
    }
    var tileindex = elem.id.replace( "tile",""); // tile string is hardcoded in createMyTable()
    var tileindex = Number(tileindex );
    var validNeighborsArray = getValidTileNeighbors( tileindex, twidth, theight);
    for ( var i = 0; i < validNeighborsArray.length; i++) {
        var workElem = document.getElementById( "tile" + validNeighborsArray[i]);
        revealWarningLessTile( workElem);
    }
}

function createMineArray(count = 1 ,tablesize) {
    if (count + 2 > tablesize) { count = tablesize - 1;} else if (count < 1) {count = 1;}
    var keepcount = tablesize - count;
    var tempArray = new Array(tablesize);
    for (var i = 0; i < tablesize  ; i++) {tempArray[i]=i;}
    for (i = 0; i < keepcount ; i++) {
        var num = Math.floor(Math.random() * tempArray.length);
        tempArray[num] = tempArray[tempArray.length - 1];
        tempArray.splice(tempArray.length - 1, 1);

    }
    return tempArray;
}
function createMyTable() {
    // Yes I know it would have been so much easlier to assign each tile to an array
    // but I wanted to be difficult. My reason is so that I had to use Document.getElementById()
    // because I'm trying to learn HTML, CSS, JavaScript, PHP, and more.
    if (twidth < 5 ) {twidth = 5;} else if ( twidth > 200 ) {twidth = 200;}
    if (theight < 5 ) {theight = 5;} else if ( theight > 200 ) { theight = 200;}

    var tableText = "";
    for (var i = 0 ; i < theight + 1; i++) {
        tableText += "<tr>";
        for (j = 0; j < twidth + 1; j++) {
            var idNum = (twidth + 1)* i + j;
            tableText += "<td id='tile"+ idNum +"' class='unchecked' onclick='userclicked(this)' data-myvalue='0'>" + " </td>";
        }
        tableText += "</tr>";
    }
    document.getElementById("gameTable").innerHTML = tableText;
}
function getX(index) {
    return index % (twidth + 1);
}
function getY(index) {
    if (twidth > 0) {
        return Math.floor(index / (twidth + 1));
    }
}
function getValidTileNeighbors( mineTileIndex, twidth, theight) {
    var validNeighborsArray = []; // Using a array list so that this function  can be used in recursive functions.
    for (var i = -1; i < 2; i++) {
        for (var j = -1; j < 2; j++) {
            if (j == 0 && i == 0) {continue;} // offset of 0,0 will be the mine.
            if ( i + getX(mineTileIndex) >= 0           // check if x is off the table to the left
            && i + getX(mineTileIndex) <= twidth        // check if x is off the table to the right
            && j + getY(mineTileIndex) >= 0             // check if y is off the table to the top
            && j + getY(mineTileIndex) <= theight) {    // check if y is off the table to the bottom
                var workindex = ((j + getY(mineTileIndex))* (twidth + 1)) + (i + getX(mineTileIndex));
                validNeighborsArray.push(workindex);
                //addMineWarnings( workindex,twidth, theight);
                //console.log("X= "+ getX(mineTileIndex)+ " Y= " + getY(mineTileIndex) + " mineTileIndex= " + mineTileIndex);
            }
        }
    }
    return validNeighborsArray;
}
function addMines(mineCount , twidth, theight) {
    var mineArray = createMineArray(mineCount, (twidth + 1) * (theight + 1));
    //console.log("Mines= {");
    //console.log(mineArray);
    //console.log("}");

    for (var h = 0; h < mineArray.length ; h++) {
        document.getElementById("tile" + mineArray[h]).setAttribute("data-myvalue",mineChar);

        var validNeighborsArray = getValidTileNeighbors(mineArray[h],twidth,theight);
        for ( var i = 0; i < validNeighborsArray.length; i++){
            addMineWarnings(validNeighborsArray[i],twidth,theight);
        }
    }
}

function addMineWarnings(tileindex, twidth, theight) {

    if (tileindex > -1 && tileindex < (twidth + 1) * (theight + 1)) {
        var tiledata = document.getElementById("tile" + tileindex).getAttribute("data-myvalue");
        if (tiledata != mineChar) {
            for (var j = 0 ; j < 9; j++) {
                if (tiledata == j) {
                    var Okay = true;
                    break ;
                }

            }
            if ( Okay ) {
                tiledata++;
                document.getElementById("tile" + tileindex).setAttribute("data-myvalue",tiledata);
                return;
            }
        }
    }
}
function showData() {
var tablesize = (twidth + 1) * (theight + 1);
    for (var i = 0; i < tablesize; i++) {
        elem = document.getElementById("tile" + i);
        var tiledata = elem.getAttribute("data-myvalue");
        if (tiledata != 0) {elem.innerHTML = tiledata;}
    }
}
