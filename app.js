function Piece(color,isKing){
	this.color = color;
	this.isKing = isKing;
}
function Space(spaceColor, isOpen, currPiece){
	this.spaceColor = spaceColor;
	this.isOpen = isOpen;
	this.currPiece = currPiece;
}
let gameBoard = [];
for(let i = 0; i < 8; i++){
	let newRow = [];
	for(let j = 0; j < 8; j++){
		let startColor = "";
		if(i % 2 === 0){
			startColor = "white";
			let currColor = "";
			if(startColor === "white"){
				if(j % 2 === 0){
					currColor = "white";
				} else {
					currColor = "black";
				}	
			}
			let isOpen = false;
			if(i > 2 && i < 5){
				isOpen = true;
			}
			let newSpace = new Space(currColor,isOpen,null);
			newRow.push(newSpace);
			//startColor = "black";
		} else {
			startColor = "black";
			let currColor = "";
			if(startColor === "black"){
				if(j % 2 === 0) {
					currColor = "black";
				} else {
					currColor = "white";
				}
			}
			let isOpen = false;
			if(i > 2 && i < 6){
				isOpen = true;
			}
			let newSpace = new Space(currColor,isOpen,null);
			newRow.push(newSpace);
		}
	}
	//console.log(newRow);
	gameBoard.push(newRow);
}

let pieceToMove = "";
let targetLocation = "";
let clickCount = 0;
let pieceToMoveColor = "";
let whiteScore = 0;
let blackScore = 0;
let currentTurn = "black";
let gameOver = false;
let moveSinceTaken = 0;

let gameInit = function(){
	for(let x = 0; x < 3; x++){
		for(let y = 0; y < 8; y++){
			if(gameBoard[x][y].spaceColor === "black"){
				gameBoard[x][y].currPiece = new Piece("white",false);
				gameBoard[x][y].isOpen = false;
			}
		}
	}
	for(let i = 5; i < 8; i++){
		for(let j = 0; j < 8; j++){
			if(gameBoard[i][j].spaceColor === "black"){
				gameBoard[i][j].currPiece = new Piece("black",false);
				gameBoard[i][j].isOpen = false;
			}
		}
	}

}

let checkLegalMove = function(pieceColor, pieceX, pieceY, targetX, targetY) {

	if(gameBoard[targetX][targetY].spaceColor === "white"){
		console.log("Cannot Move");
		return;
	} else if(pieceColor !== currentTurn) {
		console.log("Not your turn");
		return;
	}
	let colorAccess = gameBoard[pieceX][pieceY].currPiece.color;
	let kingAccess = gameBoard[pieceX][pieceY].currPiece.isKing;
	if(colorAccess === "white" && !kingAccess){
		if(targetX === (pieceX + 1) && (targetY === (pieceY + 1) || targetY === (pieceY - 1))){
			regularMoveHandler(pieceColor, pieceX, pieceY, targetX, targetY);
		} else if(targetX === (pieceX + 2) && (targetY === (pieceY + 2))){
			let jumpX = targetX - 1;
			let jumpY = targetY - 1;
			jumpMoveHandler(pieceColor, pieceX, pieceY, targetX, targetY, jumpX, jumpY);
		} else if(targetX === (pieceX + 2) && (targetY === (pieceY - 2))){
			let jumpX = targetX-1;
			let jumpY = targetY+1;
			jumpMoveHandler(pieceColor, pieceX, pieceY, targetX, targetY, jumpX, jumpY);
		}
	} else if(colorAccess === "black" && !kingAccess){
		if(targetX === (pieceX - 1) && (targetY === (pieceY + 1) || targetY === (pieceY - 1))){
			regularMoveHandler(pieceColor, pieceX, pieceY, targetX, targetY);
		} else if(targetX === (pieceX - 2) && targetY === (pieceY - 2)) {
			let jumpX = targetX+1;
			let jumpY = targetY+1;
			jumpMoveHandler(pieceColor, pieceX, pieceY, targetX, targetY, jumpX, jumpY);
		} else if(targetX === (pieceX - 2) && targetY === (pieceY + 2)) { 
			let jumpX = targetX+1;
			let jumpY = targetY-1;
			jumpMoveHandler(pieceColor, pieceX, pieceY, targetX, targetY, jumpX, jumpY);
		}
	} else {
		checkLegalKingMove(pieceColor,pieceX,pieceY,targetX,targetY);
	}	
}
let regularMoveHandler = function(pieceColor, pieceX, pieceY, targetX, targetY){
	if(gameBoard[targetX][targetY].isOpen){
		gameBoard[targetX][targetY].currPiece = gameBoard[pieceX][pieceY].currPiece;
		gameBoard[targetX][targetY].isOpen = false;
		gameBoard[pieceX][pieceY].currPiece = null;
		gameBoard[pieceX][pieceY].isOpen = true;
		let selectPiece = `#row${pieceX}-box${pieceY}`;
		let selectSpace = `#row${targetX}-box${targetY}`;
		let selectOldSpace = `#row${pieceX}-box${pieceY}`;
		let domOldSpace = document.querySelector(selectOldSpace);
		if(pieceColor === "black") {
			domOldSpace.classList.remove("black-user");
		} else {
			domOldSpace.classList.remove("white-user");
		}
		let domPiece = document.querySelectorAll(selectPiece)[1];
		let domSpace = document.querySelector(selectSpace);
		if(pieceColor === "black") {
			domSpace.classList.add("black-user");
		} else {
			domSpace.classList.add("white-user");
		}
		domPiece.id = `row${targetX}-box${targetY}`;
		if(targetX ===  0 && pieceColor === "black"){
			gameBoard[targetX][targetY].currPiece.isKing = true;
			domPiece.src = "images/black-king.png";
		} else if(targetX === 7 && pieceColor === "white"){
			gameBoard[targetX][targetY].currPiece.isKing = true;
			domPiece.src = "images/white-king.png";
		}
				//console.log(domPiece);
		domSpace.appendChild(domPiece);
		updateCurrentTurn(pieceColor);
	}
	moveSinceTaken++;

}
let regularMoveHandlerKing = function(pieceX, pieceY, targetX, targetY){
	if(gameBoard[targetX][targetY].isOpen){
		let pieceColor = gameBoard[pieceX][pieceY].currPiece.color;
		gameBoard[targetX][targetY].currPiece = gameBoard[pieceX][pieceY].currPiece;
		gameBoard[targetX][targetY].isOpen = false;
		gameBoard[pieceX][pieceY].currPiece = null;
		gameBoard[pieceX][pieceY].isOpen = true;
		let selectPiece = `#row${pieceX}-box${pieceY}`;
		let selectSpace = `#row${targetX}-box${targetY}`;
		let domPiece = document.querySelectorAll(selectPiece)[1];
		let domSpace = document.querySelector(selectSpace);
		let domOldSpace = document.querySelector(selectPiece);
		if(pieceColor === "white"){
			domOldSpace.classList.remove("white-user");
			domSpace.classList.add("white-user");
		} else {
			domOldSpace.classList.remove("black-user");
			domSpace.classList.add("black-user");
		}
		domPiece.id = `row${targetX}-box${targetY}`;
		domSpace.appendChild(domPiece);
		updateCurrentTurn(gameBoard[targetX][targetY].currPiece.color);
	}
	moveSinceTaken++;
}

let jumpMoveHandler = function(pieceColor, pieceX, pieceY, targetX, targetY, jumpX, jumpY) {
	let jumpColor = "";
	if(pieceColor === "white"){
		jumpColor = "black";
	} else {
		jumpColor = "white";
	}
	if(gameBoard[targetX][targetY].isOpen) {
		if(!gameBoard[jumpX][jumpY].isOpen && 
			gameBoard[jumpX][jumpY].currPiece.color === jumpColor) {
					//valid jump condition
			gameBoard[targetX][targetY].currPiece = gameBoard[pieceX][pieceY].currPiece;
			gameBoard[targetX][targetY].isOpen = false;
			gameBoard[pieceX][pieceY].currPiece = null;
			gameBoard[pieceX][pieceY].isOpen = true;
			let selectPiece = `#row${pieceX}-box${pieceY}`;
			let selectSpace = `#row${targetX}-box${targetY}`;
			let domPiece = document.querySelectorAll(selectPiece)[1];
			let domSpace = document.querySelector(selectSpace);
			let domOldSpace = document.querySelector(selectPiece);
			domPiece.id = `row${targetX}-box${targetY}`;
			if(pieceColor === "white"){
				domOldSpace.classList.remove("white-user");
				domSpace.classList.add("white-user");
				if(targetX === 7 && !gameBoard[targetX][targetY].isKing) {
					gameBoard[targetX][targetY].currPiece.isKing = true;
					domPiece.src = "images/white-king.png";
				}
			} else {
				domOldSpace.classList.remove("black-user");
				domSpace.classList.add("black-user");
				if(targetX === 0 && !gameBoard[targetX][targetY].isKing) {
					gameBoard[targetX][targetY].currPiece.isKing = true;
					domPiece.src = "images/black-king.png"
				}
			}
			domSpace.appendChild(domPiece);
			let selectRemove = `#row${jumpX}-box${jumpY}`;
			gameBoard[jumpX][jumpY].currPiece = null;
			gameBoard[jumpX][jumpY].isOpen = true;
			let domRemoveParent = document.querySelectorAll(selectRemove)[0];
			let domRemoveChild = document.querySelectorAll(selectRemove)[1];
			domRemoveChild.classList.add("dead-piece");
			if(pieceColor === "white"){
				domRemoveParent.classList.remove("black-user");
			} else {
				domRemoveParent.classList.remove("white-user");
			}
			updateGraveyard(jumpColor);
			updateCurrentTurn(pieceColor);
			updateScore(pieceColor);
			setTimeout(function(){
				domRemoveParent.removeChild(domRemoveChild);
				/*
				updateGraveyard(jumpColor);
				updateCurrentTurn(pieceColor);
				updateScore(pieceColor);
				*/
			}, 1000)
			moveSinceTaken = 0;
			if(checkDoubleJump(pieceColor, targetX, targetY)){
				console.log("is double jump");
			}
			/*
			domRemoveParent.removeChild(domRemoveChild);
			updateGraveyard(jumpColor);
			updateCurrentTurn(pieceColor);
			updateScore(pieceColor);
			*/
		}
	}
}

let updateGraveyard = function(color) {
	if(color === "white") {
		let domGraveyard = document.querySelector(".black-graveyard");
		let domGraveImage = document.createElement("div");
		domGraveImage.classList.add("grave-image");
		let domImage = document.createElement("img");
		domImage.src = "images/white-piece.png";
		domImage.classList.add("graveyard-piece");
		domGraveImage.appendChild(domImage);
		domGraveyard.appendChild(domGraveImage);
	} else {
		let domGraveyard = document.querySelector(".white-graveyard");
		let domGraveImage = document.createElement("div");
		domGraveImage.classList.add("grave-image");
		let domImage = document.createElement("img");
		domImage.src = "images/black-piece.png";
		domImage.classList.add("graveyard-piece");
		domGraveImage.appendChild(domImage);
		domGraveyard.appendChild(domGraveImage);
	}
}

let checkLegalKingMove = function(pieceColor, pieceX, pieceY, targetX, targetY) {
	if(targetX === pieceX - 1 && targetY === pieceY - 1){
		regularMoveHandlerKing(pieceX, pieceY, targetX, targetY);
	} else if(targetX === pieceX + 1 && targetY === pieceY +1){
		regularMoveHandlerKing(pieceX, pieceY, targetX, targetY);
	} else if(targetX === pieceX - 1 && targetY === pieceY + 1){
		regularMoveHandlerKing(pieceX, pieceY, targetX, targetY);
	} else if(targetX === pieceX + 1 && targetY === pieceY - 1){
		regularMoveHandlerKing(pieceX, pieceY, targetX, targetY);
	} else if(targetX === (pieceX - 2) && targetY === (pieceY - 2)){
		if(gameBoard[targetX][targetY].isOpen){
			let jumpX = targetX+1;
			let jumpY = targetY+1;
			jumpMoveHandler(pieceColor, pieceX, pieceY, targetX, targetY, jumpX, jumpY);
		}
		//console.log("jump attempt");
	} else if(targetX === (pieceX - 2) && targetY === (pieceY + 2)){
		let jumpX = targetX+1;
		let jumpY = targetY-1;
		jumpMoveHandler(pieceColor, pieceX, pieceY, targetX, targetY, jumpX, jumpY);
		//console.log("jump 2")
	} else if(targetX === (pieceX + 2) && targetY === (pieceY + 2)){
		let jumpX = targetX-1;
		let jumpY = targetY-1;
		jumpMoveHandler(pieceColor, pieceX, pieceY, targetX, targetY, jumpX, jumpY);

	} else if(targetX === (pieceX + 2) && targetY === (pieceY - 2)){
		//console.log("here");
		let jumpX = targetX-1;
		let jumpY = targetY+1;
		jumpMoveHandler(pieceColor, pieceX, pieceY, targetX, targetY, jumpX, jumpY);
	}
}
//https://stackoverflow.com/questions/13528512/modify-a-css-rule-object-with-javascript
let updateCurrentTurn = function(pieceColor) {
	let domUserTurn = document.querySelector("#current-turn");
	if(pieceColor === "white"){
		let sheet = document.styleSheets[0];
		let rules = sheet.cssRules || sheet.rules;
		console.log(rules);
		rules[13].style.background = "#5fd15a";
		rules[14].style.background = "rgb(36, 42, 48)"
		rules[15].style.background = "#5fd15a";
		domUserTurn.innerText = "black";
		currentTurn = "black";
		domUserTurn.classList.remove("current-turn-white")
		domUserTurn.classList.add("current-turn-black");
	} else {
		let sheet = document.styleSheets[0];
		let rules = sheet.cssRules || sheet.rules;
		rules[13].style.background = "#3a5cf2";
		rules[14].style.background = "#3a5cf2";
		rules[15].style.background = "rgb(36, 42, 48)"
		console.log(sheet);
		domUserTurn.innerText = "white";
		currentTurn = "white";
		domUserTurn.classList.remove("current-turn-black")
		domUserTurn.classList.add("current-turn-white");
	}
}

let updateScore = function(pieceColor) {
	if(pieceColor === "white"){
		whiteScore++;
		let domWhiteScore = document.querySelector("#white-score");
		domWhiteScore.innerText = whiteScore;
	} else {
		blackScore++;
		let domBlackScore = document.querySelector("#black-score");
		domBlackScore.innerText = blackScore;
	}
}

let clickEventHandler = function(e) {
	if(e.target.classList[0] === "row-box" && clickCount % 2 === 0){
		//console.log("return");
		return;
	}
	if (clickCount % 2 === 0){
		pieceToMove = e.target.id;
		pieceToMoveColor = e.target.classList[0];
		clickCount++;
	} else {
		targetLocation = e.target.id;
		clickCount++;
	}
	if(clickCount % 2 === 0 && clickCount > 1){
		let pieceSplit = pieceToMove.split("-");
		let pieceRow = parseInt(pieceSplit[0].slice(3), 10);
		let pieceColumn = parseInt(pieceSplit[1].slice(3), 10);
		let locSplit = targetLocation.split("-");
		let locRow = parseInt(locSplit[0].slice(3), 10);
		let locColumn = parseInt(locSplit[1].slice(3),10);
		checkLegalMove(pieceToMoveColor,pieceRow,pieceColumn,locRow,locColumn);
		pieceToMove = "";
		targetLocation = "";

	}
	let isWhiteMove = checkIfWhiteHasMove();
	//let isBlackMove = true;
	let isBlackMove = checkIfBlackHasMove();
	//let isKingMove = checkIfKingMove();
	if(!isWhiteMove){
		let isKingMove = checkIfKingMove("white");
		if(!isKingMove) {
			//console.log("Black wins");
			gameOver = true;
			gameOverHandler("black");
		}
	} else if(!isBlackMove){
		let isKingMove = checkIfKingMove("black");
		if(!isKingMove){
			//console.log("White wins");
			gameOver = true;
			gameOverHandler("white");
		}
	}
	if(gameOver === false){
		checkGameOver(); 
	}
	console.log(moveSinceTaken);
}
let checkGameOver = function(){
	if(whiteScore === 12) {
		gameOver = true;
		console.log("GAME OVER");
		gameOverHandler("white");
	} else if(blackScore === 12) {
		gameOver = true;
		gameOverHandler("black");
	}
	if(moveSinceTaken === 50){
		gameOver = true;
		gameOverHandler("tie")
	}
}

let checkIfKingMove = function(pieceColor){
	console.log("in check king move");
	let existMove = false;
	i = 0;
	while(!existMove && i < 8){
		let j = 0;
		while(!existMove && j < 8){
			if(gameBoard[i][j].currPiece != null){
				if(gameBoard[i][j].currPiece.isKing && gameBoard[i][j].currPiece.color === pieceColor){
					//console.log("current king: i: " + i + " j: " + j);
					let testX = 0;
					let testY = 0;
					if(i+1 < 8) {
						testX = i+1;
						if(j+1 < 8){
							testY = j+1
							existMove = checkMove(testX, testY);
						}
					}
					if(existMove){
						/*
						console.log("first check success");
						console.log("i: " + i);
						console.log("j: " + j);
						*/
						return existMove;
					}
					if(i+1 < 8) {
						testX = i+1;
						if(j-1 >= 0) {
							testY = j-1;
							existMove = checkMove(testX, testY);
						}
					}
					if(existMove){
						//console.log("second check success");
						return existMove;
					}
					if(i-1 >= 0) {
						testX = i-1;
						if(j-1 >= 0){
							testY = j-1;
							existMove = checkMove(testX, testY);
						}
					}
					existMove = checkMove(testX, testY);
					if(existMove){
						/*
						console.log("third check success");
						console.log("i: " + i);
						console.log("j: " + j);
						*/
						return existMove;
					}
					if(i-1 >= 0) {
						testX = i -1;
						if(j+1 < 8) {
							testY = j+1;
							existMove = checkMove(testX, testY);
						}
					}
					if(existMove){
						/*
						console.log("i: " + i);
						console.log("j: " + j);
						console.log("4th check success");
						*/
						return existMove;
					}
					let jumpX = 0;
					let jumpY = 0;
					if(i-2 >= 0) {
						testX = i-2;
						jumpX = testX+1;
						if(j-2 >= 0) {
							testY = j-2;
							jumpY = testY+1;
							existMove = checkJump(gameBoard[i][j].currPiece.color, testX, testY, jumpX, jumpY);
						}
					}
					if(existMove){
						//console.log("tarX: " + testX);
						//console.log("tarY: " + testY);
						return existMove;
					}
					if(i-2 >= 0){
						testX = i-2;
						jumpX = testX+1;
						if(j+2 < 8){
							testY = j+2;
							jumpY = testY-1;
							existMove = checkJump(gameBoard[i][j].currPiece.color, testX, testY, jumpX, jumpY);
						}
					}
					if(existMove){
						/*
						console.log("tarX " + testX);
						console.log("tarY " + testY);
						*/
						return existMove;
					}
					if(i+2 < 8) {
						testX = i+2;
						jumpX = testX - 1;
						if(j+2 < 8) {
							testY = j+2;
							jumpY = testY - 1;
							existMove = checkJump(gameBoard[i][j].currPiece.color, testX, testY, jumpX, jumpY);
						}
					}
					if(existMove){
						return existMove;
						//console.log("tarX: " + testX);
						//console.log("tarY: " + testY);
					}
					if(i+2 < 8){
						testX = i+2;
						jumpX = testX-1;
						if(j-2 >= 0) {
							testY = j-2;
							jumpY = testY+1;
							existMove = checkJump(gameBoard[i][j].currPiece.color, testX, testY, jumpX, jumpY);
						}
					}
					if(existMove){
						//console.log("tarX: " + testX);
						//console.log("tarY: " + testY);
						return existMove;
					}
				}
			}
			j++;
		}
		i++;
	}
	return existMove;
}

let checkIfWhiteHasMove = function(){
	let existMove = false;
	let i = 0;
	while(!existMove && i < 8){
		let j = 0;
		while(!existMove && j < 8) {
			if(gameBoard[i][j].currPiece != null){
				if(gameBoard[i][j].currPiece.color === "white" && !gameBoard[i][j].currPiece.isKing){
					let testX = 0;
					let testY = 0;
					if(i+1 < 8) {
						testX = i+1;
						if(j+1 < 8){
							testY = j+1
							existMove = checkMove(testX, testY);
						}
					}
					//console.log("first test i: " + i);
					//console.log("first test j: " + j);
					//existMove = checkMove(testX, testY);
					if(existMove){
						//console.log("first check success");
						//console.log("testX: " + testX);
						//console.log("testY " + testY);
						return existMove;
					}
					if(i+1 < 8) {
						testX = i+1;
						if(j-1 >= 0) {
							testY = j-1;
							existMove = checkMove(testX, testY);
						}
					}
					if(existMove){
						//console.log("second check success");
						return existMove;
					}
					let jumpX = 0;
					let jumpY = 0;
					if(i+2 < 8) {
						testX = i+2;
						jumpX = testX - 1;
						if(j+2 < 8) {
							testY = j+2;
							jumpY = testY - 1;
							existMove = checkJump(gameBoard[i][j].currPiece.color, testX, testY, jumpX, jumpY);
						}
					}
					//existMove = checkJump(gameBoard[i][j].currPiece.color, testX, testY, jumpX, jumpY);
					//console.log("i: " + i);
					//console.log("j: " + j);
					if(existMove){
						//console.log("tarX: " + testX);
						//console.log("tarY: " + testY);
						return existMove;
					}
					if(i+2 < 8){
						testX = i+2;
						jumpX = testX-1;
						if(j-2 >= 0){
							testY = j-2;
							jumpY = testY+1;
							existMove = checkJump(gameBoard[i][j].currPiece.color, testX, testY, jumpX, jumpY);
						}
					}
				}
			}
			j++;
		}
		i++
	}
	console.log(existMove);
	return existMove;
}

let checkDoubleJump = function(pieceColor, currX, currY) {
	if(pieceColor === "black"){
		if(gameBoard[currX][currY].currPiece != null){
			if(!gameBoard[currX][currY].currPiece.isKing){
				if(currX-2 >= 0) {
					let testX = currX-2;
					let jumpX = testX+1;
					if(currY-2 >= 0) {
						let testY = currY-2;
						let jumpY = testY+1;
						let existMove = checkJump(gameBoard[currX][currY].currPiece.color, testX, testY, jumpX, jumpY);
						if(existMove){
							jumpMoveHandler(pieceColor, currX, currY, testX, testY, jumpX, jumpY);
							console.log("force jump");
							return existMove;
						}
					}
				}
				if(currX-2 >= 0){
					let testX = currX-2;
					let jumpX = testX+1;
					if(currY+2 < 8){
						let testY = currY+2;
						let jumpY = testY-1;
						let existMove = checkJump(gameBoard[currX][currY].currPiece.color, testX, testY, jumpX, jumpY);
						if(existMove){
							console.log("force jump");
							jumpMoveHandler(pieceColor, currX, currY, testX, testY, jumpX, jumpY);
							return existMove;
						}
					}
				}
			}
		}
	} else {
		if(gameBoard[currX][currY].currPiece != null){
			if(!gameBoard[currX][currY].currPiece.isKing){
				if(currX+2 < 8) {
					let testX = currX+2;
					let jumpX = testX-1;
					if(currY+2 < 8) {
						let testY = currY+2;
						let jumpY = testY-1;
						let existMove = checkJump(gameBoard[currX][currY].currPiece.color, testX, testY, jumpX, jumpY);
						if(existMove){
							console.log("force jump");
							jumpMoveHandler(pieceColor, currX, currY, testX, testY, jumpX, jumpY);
							return existMove;
						}
					}
				}
				if(currX+2 < 8){
					let testX = currX+2;
					let jumpX = testX-1;
					if(currY-2 >= 0){
						let testY = currY-2;
						let jumpY = testY+1;
						let existMove = checkJump(gameBoard[currX][currY].currPiece.color, testX, testY, jumpX, jumpY);
						if(existMove){
							console.log("force jump");
							jumpMoveHandler(pieceColor, currX, currY, testX, testY, jumpX, jumpY);
							return existMove;
						}
					}
				}
			}
		}
	}
	if(gameBoard[currX][currY].currPiece != null){
		if(gameBoard[currX][currY].currPiece.isKing) {
			checkKingDoubleJump(pieceColor, currX, currY);
		}
	}
	return false;
}

let checkKingDoubleJump = function(pieceColor, currX, currY) {
	if(currX+2 < 8) {
		let testX = currX+2;
		let jumpX = testX-1;
		if(currY+2 < 8) {
			let testY = currY+2;
			let jumpY = testY-1;
			let existMove = checkJump(gameBoard[currX][currY].currPiece.color, testX, testY, jumpX, jumpY);
			if(existMove){
				console.log("force jump");
				jumpMoveHandler(pieceColor, currX, currY, testX, testY, jumpX, jumpY);
				return existMove;
			}
		}
	}
	if(currX+2 < 8){
		let testX = currX+2;
		let jumpX = testX-1;
		if(currY-2 >= 0){
			let testY = currY-2;
			let jumpY = testY+1;
			let existMove = checkJump(gameBoard[currX][currY].currPiece.color, testX, testY, jumpX, jumpY);
			if(existMove){
				console.log("force jump");
				jumpMoveHandler(pieceColor, currX, currY, testX, testY, jumpX, jumpY);
				return existMove;
			}
		}
	}
	if(currX-2 >= 0){
		let testX = currX-2;
		let jumpX = testX+1;
		if(currY+2 < 8){
			let testY = currY+2;
			let jumpY = testY-1;
			let existMove = checkJump(gameBoard[currX][currY].currPiece.color, testX, testY, jumpX, jumpY);
			if(existMove){
				console.log("force jump");
				jumpMoveHandler(pieceColor, currX, currY, testX, testY, jumpX, jumpY);
				return existMove;
			}
		}
	}
	if(currX-2 >= 0) {
		let testX = currX-2;
		let jumpX = testX+1;
		if(currY-2 >= 0) {
			let testY = currY-2;
			let jumpY = testY+1;
			let existMove = checkJump(gameBoard[currX][currY].currPiece.color, testX, testY, jumpX, jumpY);
			if(existMove){
				jumpMoveHandler(pieceColor, currX, currY, testX, testY, jumpX, jumpY);
				console.log("force jump");
				return existMove;
			}
		}
	}
	return false;
}

let checkIfBlackHasMove = function(){
	let existMove = false;
	let i = 0;
	while(!existMove && i < 8){
		let j = 0;
		while(!existMove && j < 8) {
			if(gameBoard[i][j].currPiece != null){
				if(gameBoard[i][j].currPiece.color === "black" && !gameBoard[i][j].currPiece.isKing){
					let testX = 0;
					let testY = 0;
					if(i-1 >= 0) {
						testX = i-1;
						if(j-1 >= 0){
							testY = j-1;
							existMove = checkMove(testX, testY);
						}
					}
					if(existMove){
						//console.log("first check success");
						//console.log("i: " + i);
						//console.log("j: " + j);
						return existMove;
					}
					if(i - 1 >= 0) {
						testX = i-1;
						if(j+1 < 8) {
							testY = j+1;
							existMove = checkMove(testX, testY);
						}
					}
					if(existMove){
						//console.log("i: " + i);
						//console.log("j: " + j);
						//console.log("second check success");
						return existMove;
					}
					let jumpX = 0;
					let jumpY = 0;
					if(i-2 >= 0) {
						testX = i-2;
						jumpX = testX+1;
						if(j-2 >= 0) {
							testY = j-2;
							jumpY = testY+1;
							existMove = checkJump(gameBoard[i][j].currPiece.color, testX, testY, jumpX, jumpY);
						}
					}
					if(existMove){
						//console.log("tarX: " + testX);
						//console.log("tarY: " + testY);
						return existMove;
					}
					if(i-2 >= 0){
						testX = i-2;
						jumpX = testX+1;
						if(j+2 < 8){
							testY = j+2;
							jumpY = testY-1;
							existMove = checkJump(gameBoard[i][j].currPiece.color, testX, testY, jumpX, jumpY);
						}
					}
					if(existMove){
						//console.log("tarX " + testX);
						//console.log("tarY " + testY);
						return existMove;
					}
				}
			}
			j++;
		}
		i++
	}
	console.log(existMove);
	return existMove;
}

let checkMove = function(testX, testY) {
	if(gameBoard[testX][testY].spaceColor === "black") {
		if(gameBoard[testX][testY].isOpen === true){
			return true;
		}
	}
	return false;
}
let checkJump = function(pieceColor, targetX, targetY, jumpX, jumpY) {

	let jumpColor = "";
	if(pieceColor === "white"){
		jumpColor = "black";
	} else {
		jumpColor = "white";
	}
	if(gameBoard[targetX][targetY].isOpen) {
		if(gameBoard[jumpX][jumpY].currPiece != null) {
			if(!gameBoard[jumpX][jumpY].isOpen && 
				gameBoard[jumpX][jumpY].currPiece.color === jumpColor) {
				return true;
			}
		}
	}
	return false;
}

let gameOverHandler = function(winnerColor) {
	//console.log("here");
	let domBoard = document.querySelector("#game-space");
	domBoard.classList.add("do-not-show");
	console.log(domBoard.classList);
	let domGameOver = document.querySelector("#game-over");
	domGameOver.classList.remove("do-not-show");
	domGameOver.classList.add("show");
	if(winnerColor === "tie"){}
	let winner = document.createElement("span");
	let winnerString = ""
	if(winnerColor === "tie"){
		winnerString = "The game is a tie!"
	} else {
		winnerString = "The winner is the: " + winnerColor.toUpperCase() + " player";
	}
	winner.innerText = winnerString;
	let domUserInfoList = document.querySelectorAll(".user-info");
	for(let i = 0; i < domUserInfoList.length; i++){
		domUserInfoList[i].classList.add("game-over-fade");
	}
	setTimeout(function(){
		for(let i = 0; i < domUserInfoList.length; i++){
			domUserInfoList[i].classList.remove("game-over-fade");
			domUserInfoList[i].classList.add("do-not-show");
		}
		domGameOver.classList.add("show");
		domGameOver.appendChild(winner);
	}, 2000);
}

document.addEventListener("DOMContentLoaded", function() {
	gameInit();
	document.querySelector("#game-space").addEventListener("click", clickEventHandler);
})