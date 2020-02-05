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
	} /*else if(pieceColor !== currentTurn) {
		console.log("Not your turn");
		return;
	}*/
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
		let domPiece = document.querySelectorAll(selectPiece)[1];
		let domSpace = document.querySelector(selectSpace);
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

}
let regularMoveHandlerKing = function(pieceX, pieceY, targetX, targetY){
	if(gameBoard[targetX][targetY].isOpen){
		gameBoard[targetX][targetY].currPiece = gameBoard[pieceX][pieceY].currPiece;
		gameBoard[targetX][targetY].isOpen = false;
		gameBoard[pieceX][pieceY].currPiece = null;
		gameBoard[pieceX][pieceY].isOpen = true;
		let selectPiece = `#row${pieceX}-box${pieceY}`;
		let selectSpace = `#row${targetX}-box${targetY}`;
		let domPiece = document.querySelectorAll(selectPiece)[1];
		let domSpace = document.querySelector(selectSpace);
		domPiece.id = `row${targetX}-box${targetY}`;
		domSpace.appendChild(domPiece);
		updateCurrentTurn(gameBoard[targetX][targetY].currPiece.color);
	}
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
			domPiece.id = `row${targetX}-box${targetY}`;
			if(pieceColor === "white"){
				if(targetX === 7 && !gameBoard[targetX][targetY].isKing) {
					gameBoard[targetX][targetY].currPiece.isKing = true;
					domPiece.src = "images/white-king.png";
				}
			} else {
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
			domRemoveParent.removeChild(domRemoveChild);
			updateGraveyard(jumpColor);
			updateCurrentTurn(pieceColor);
			updateScore(pieceColor);
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
		domGraveImage.appendChild(domImage);
		domGraveyard.appendChild(domGraveImage);
	} else {
		let domGraveyard = document.querySelector(".white-graveyard");
		let domGraveImage = document.createElement("div");
		domGraveImage.classList.add("grave-image");
		let domImage = document.createElement("img");
		domImage.src = "images/black-piece.png";
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
		console.log("jump 2")
	} else if(targetX === (pieceX + 2) && targetY === (pieceY + 2)){
		let jumpX = targetX-1;
		let jumpY = targetY-1;
		jumpMoveHandler(pieceColor, pieceX, pieceY, targetX, targetY, jumpX, jumpY);

	} else if(targetX === (pieceX + 2) && targetY === (pieceY - 2)){
		console.log("here");
		let jumpX = targetX-1;
		let jumpY = targetY+1;
		jumpMoveHandler(pieceColor, pieceX, pieceY, targetX, targetY, jumpX, jumpY);
	}
}

let updateCurrentTurn = function(pieceColor) {
	let domUserTurn = document.querySelector("#current-turn");
	if(pieceColor === "white"){
		domUserTurn.innerText = "black";
		currentTurn = "black";
	} else {
		domUserTurn.innerText = "white";
		currentTurn = "white";
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
		console.log("return");
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
			console.log("Black wins");
			gameOver = true;
			gameOverHandler("black");
		}
	} else if(!isBlackMove){
		let isKingMove = checkIfKingMove("black");
		if(!isKingMove){
			console.log("White wins");
			gameOver = true;
			gameOverHandler("white");
		}
	}
	if(gameOver === false){
		checkGameOver(); 
	}
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
					console.log("current king: i: " + i + " j: " + j);
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
						console.log("first check success");
						console.log("i: " + i);
						console.log("j: " + j);
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
						console.log("second check success");
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
						console.log("third check success");
						console.log("i: " + i);
						console.log("j: " + j);
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
						console.log("i: " + i);
						console.log("j: " + j);
						console.log("4th check success");
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
						console.log("tarX: " + testX);
						console.log("tarY: " + testY);
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
						console.log("tarX " + testX);
						console.log("tarY " + testY);
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
						console.log("tarX: " + testX);
						console.log("tarY: " + testY);
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
						console.log("tarX: " + testX);
						console.log("tarY: " + testY);
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
					console.log("first test i: " + i);
					console.log("first test j: " + j);
					//existMove = checkMove(testX, testY);
					if(existMove){
						console.log("first check success");
						console.log("testX: " + testX);
						console.log("testY " + testY);
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
						console.log("second check success");
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
					console.log("i: " + i);
					console.log("j: " + j);
					if(existMove){
						console.log("tarX: " + testX);
						console.log("tarY: " + testY);
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
						console.log("first check success");
						console.log("i: " + i);
						console.log("j: " + j);
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
						console.log("i: " + i);
						console.log("j: " + j);
						console.log("second check success");
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
						console.log("tarX: " + testX);
						console.log("tarY: " + testY);
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
						console.log("tarX " + testX);
						console.log("tarY " + testY);
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
	let winner = document.createElement("span");
	let winnerString = "The winner is: " + winnerColor.toUpperCase();
	winner.innerText = winnerString;
	domGameOver.appendChild(winner);
	let domUserInfoList = document.querySelectorAll(".user-info");
	for(let i = 0; i < domUserInfoList.length; i++){
		domUserInfoList[i].classList.add("do-not-show");
	}
}



document.addEventListener("DOMContentLoaded", function() {
	gameInit();
	document.querySelector("#game-space").addEventListener("click", clickEventHandler);
	//gameOverHandler("white");
})