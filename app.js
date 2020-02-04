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
			if(i > 2 && i < 6){
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

let gameInit = function(){
	for(let x = 0; x < 3; x++){
		for(let y = 0; y < 8; y++){
			if(gameBoard[x][y].spaceColor === "black"){
				gameBoard[x][y].currPiece = new Piece("white",false);
			}
		}
	}
	for(let i = 5; i < 8; i++){
		for(let j = 0; j < 8; j++){
			if(gameBoard[i][j].spaceColor === "black"){
				gameBoard[i][j].currPiece = new Piece("black",false);
			}
		}
	}

}

let checkLegalMove = function(pieceColor, pieceX, pieceY, targetX, targetY) {

	if(gameBoard[targetX][targetY].spaceColor === "white"){
		console.log("Cannot Move");
	}
	
	let colorAccess = gameBoard[pieceX][pieceY].currPiece.color;
	let kingAccess = gameBoard[pieceX][pieceY].currPiece.isKing;
	if(colorAccess === "white" && !kingAccess){
		if(targetX === (pieceX + 1) && (targetY === (pieceY + 1) || targetY === (pieceY - 1))){
			regularMoveHandler(pieceColor, pieceX, pieceY, targetX, targetY);
		} else if(targetX === (pieceX + 2) && (targetY === (pieceY + 2))){
			if(gameBoard[targetX][targetY].isOpen){
				if(!gameBoard[targetX-1][targetY-1].isOpen && 
					gameBoard[targetX-1][targetY-1].currPiece.color === "black") {
					//valid jump condition
					gameBoard[targetX][targetY].currPiece = gameBoard[pieceX][pieceY].currPiece;
					gameBoard[targetX][targetY].isOpen = false;
					if(targetX ===  7){
						gameBoard[targetX][targetY].currPiece.isKing = true;
					}
					gameBoard[pieceX][pieceY].currPiece = null;
					gameBoard[pieceX][pieceY].isOpen = true;
					let selectPiece = `#row${pieceX}-box${pieceY}`;
					let selectSpace = `#row${targetX}-box${targetY}`;
					let domPiece = document.querySelectorAll(selectPiece)[1];
					let domSpace = document.querySelector(selectSpace);
					domPiece.id = `row${targetX}-box${targetY}`;
					if(targetX === 7) {
						gameBoard[targetX][targetY].currPiece.isKing = true;
						domPiece.src = "images/white-king.png";
					}
				//console.log(domPiece);
					domSpace.appendChild(domPiece);
					console.log("jump move");
					let selectRemove = `#row${targetX-1}-box${targetY-1}`;
					gameBoard[targetX-1][targetY-1].currPiece = null;
					gameBoard[targetX-1][targetY-1].isOpen = true;
					let domRemoveParent = document.querySelectorAll(selectRemove)[0];
					let domRemoveChild = document.querySelectorAll(selectRemove)[1];
					domRemoveParent.removeChild(domRemoveChild);
				}
			}
		} else if(targetX === (pieceX + 2) && (targetY === (pieceY - 2))){
			if(gameBoard[targetX][targetY].isOpen){
				if(!gameBoard[targetX-1][targetY+1].isOpen &&
					gameBoard[targetX-1][targetY+1].currPiece.color === "black"){
					gameBoard[targetX][targetY].currPiece = gameBoard[pieceX][pieceY].currPiece;
					gameBoard[targetX][targetY].isOpen = false;
					gameBoard[pieceX][pieceY].currPiece = null;
					gameBoard[pieceX][pieceY].isOpen = true;
					let selectPiece = `#row${pieceX}-box${pieceY}`;
					let selectSpace = `#row${targetX}-box${targetY}`;
					let domPiece = document.querySelectorAll(selectPiece)[1];
					let domSpace = document.querySelector(selectSpace);
					if(targetX === 7) {
						gameBoard[targetX][targetY].currPiece.isKing = true;
						domPiece.src = "images/white-king.png";
					}
					domPiece.id = `row${targetX}-box${targetY}`;
				//console.log(domPiece);
					domSpace.appendChild(domPiece);
					console.log("jump move");
					let selectRemove = `#row${targetX-1}-box${targetY+1}`;
					gameBoard[targetX-1][targetY+1].currPiece = null;
					gameBoard[targetX-1][targetY+1].isOpen = true;
					let domRemoveParent = document.querySelectorAll(selectRemove)[0];
					let domRemoveChild = document.querySelectorAll(selectRemove)[1];
					domRemoveParent.removeChild(domRemoveChild);					

				}
				console.log("jump move");
			}
		}
	} else if(colorAccess === "black" && !kingAccess){
		if(targetX === (pieceX - 1) && (targetY === (pieceY + 1) || targetY === (pieceY - 1))){
			regularMoveHandler(pieceColor, pieceX, pieceY, targetX, targetY);
		} else if(targetX === (pieceX - 2) && targetY === (pieceY - 2)) {
			if(gameBoard[targetX][targetY].isOpen){
				if(!gameBoard[targetX+1][targetY+1].isOpen &&
					gameBoard[targetX+1][targetY+1].currPiece.color === "white"){
					gameBoard[targetX][targetY].currPiece = gameBoard[pieceX][pieceY].currPiece;
					gameBoard[targetX][targetY].isOpen = false;
					gameBoard[pieceX][pieceY].currPiece = null;
					gameBoard[pieceX][pieceY].isOpen = true;
					let selectPiece = `#row${pieceX}-box${pieceY}`;
					let selectSpace = `#row${targetX}-box${targetY}`;
					let domPiece = document.querySelectorAll(selectPiece)[1];
					let domSpace = document.querySelector(selectSpace);
					domPiece.id = `row${targetX}-box${targetY}`;
				//console.log(domPiece);
					if(targetX === 0){
						gameBoard[targetX][targetY].currPiece.isKing = true;
						domPiece.src = "images/black-king.png";
					}
					domSpace.appendChild(domPiece);
					console.log("jump move");
					let selectRemove = `#row${targetX+1}-box${targetY+1}`;
					gameBoard[targetX+1][targetY+1].currPiece = null;
					gameBoard[targetX+1][targetY+1].isOpen = true;
					let domRemoveParent = document.querySelectorAll(selectRemove)[0];
					let domRemoveChild = document.querySelectorAll(selectRemove)[1];
					domRemoveParent.removeChild(domRemoveChild);
				}
			}
		} else if(targetX === (pieceX - 2) && targetY === (pieceY + 2)) { 
			if(gameBoard[targetX][targetY].isOpen){
				if(!gameBoard[targetX+1][targetY-1].isOpen &&
					gameBoard[targetX+1][targetY-1].currPiece.color === "white"){
					gameBoard[targetX][targetY].currPiece = gameBoard[pieceX][pieceY].currPiece;
					gameBoard[targetX][targetY].isOpen = false;
					gameBoard[pieceX][pieceY].currPiece = null;
					gameBoard[pieceX][pieceY].isOpen = true;
					let selectPiece = `#row${pieceX}-box${pieceY}`;
					let selectSpace = `#row${targetX}-box${targetY}`;
					let domPiece = document.querySelectorAll(selectPiece)[1];
					let domSpace = document.querySelector(selectSpace);
					domPiece.id = `row${targetX}-box${targetY}`;
				//console.log(domPiece);
					if(targetX === 0){
						gameBoard[targetX][targetY].currPiece.isKing = true;
						domPiece.src = "images/black-king.png";
					}
					domSpace.appendChild(domPiece);
					console.log("jump move");
					let selectRemove = `#row${targetX+1}-box${targetY-1}`;
					gameBoard[targetX+1][targetY-1].currPiece = null;
					gameBoard[targetX+1][targetY-1].isOpen = true;
					let domRemoveParent = document.querySelectorAll(selectRemove)[0];
					let domRemoveChild = document.querySelectorAll(selectRemove)[1];
					domRemoveParent.removeChild(domRemoveChild);
				}
			}

		}
	} else {
		checkLegalKingMove(pieceColor,pieceX,pieceY,targetX,targetY);
	}	
	//console.log(colorAccess);
	//console.log("HERE")
}
let regularMoveHandler = function(pieceColor, pieceX, pieceY, targetX, targetY){
	if(gameBoard[targetX][targetY].isOpen){
		console.log("allow black move");
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
	}
}
/*
let jumpMoveHandler = function(){

}
*/
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
			if(pieceColor === "black"){
				if(!gameBoard[targetX+1][targetY+1].isOpen &&
					gameBoard[targetX+1][targetY+1].currPiece.color === "white"){
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
					console.log("jump move");
					let selectRemove = `#row${targetX+1}-box${targetY+1}`;
					gameBoard[targetX+1][targetY+1].currPiece = null;
					gameBoard[targetX+1][targetY+1].isOpen = true;
					let domRemoveParent = document.querySelectorAll(selectRemove)[0];
					let domRemoveChild = document.querySelectorAll(selectRemove)[1];
					domRemoveParent.removeChild(domRemoveChild);
				}
			} else {
				if(!gameBoard[targetX+1][targetY+1].isOpen &&
					gameBoard[targetX+1][targetY+1].currPiece.color === "black"){
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
					console.log("jump move");
					let selectRemove = `#row${targetX+1}-box${targetY+1}`;
					gameBoard[targetX+1][targetY+1].currPiece = null;
					gameBoard[targetX+1][targetY+1].isOpen = true;
					let domRemoveParent = document.querySelectorAll(selectRemove)[0];
					let domRemoveChild = document.querySelectorAll(selectRemove)[1];
					domRemoveParent.removeChild(domRemoveChild);
				}
			}
		}
		//console.log("jump attempt");
	} else if(targetX === (pieceX - 2) && targetY === (pieceY + 2)){
		console.log("jump 2")
		if(pieceColor === "black"){
			if(gameBoard[targetX][targetY].isOpen){
				if(!gameBoard[targetX+1][targetY-1].isOpen &&
					gameBoard[targetX+1][targetY-1].currPiece.color === "white"){
					gameBoard[targetX][targetY].currPiece = gameBoard[pieceX][pieceY].currPiece;
					gameBoard[targetX][targetY].isOpen = false;
					gameBoard[pieceX][pieceY].currPiece = null;
					gameBoard[pieceX][pieceY].isOpen = true;
					let selectPiece = `#row${pieceX}-box${pieceY}`;
					let selectSpace = `#row${targetX}-box${targetY}`;
					let domPiece = document.querySelectorAll(selectPiece)[1];
					let domSpace = document.querySelector(selectSpace);
					domPiece.id = `row${targetX}-box${targetY}`;
				//console.log(domPiece);
					domSpace.appendChild(domPiece);
					console.log("jump move");
					let selectRemove = `#row${targetX+1}-box${targetY-1}`;
					gameBoard[targetX+1][targetY-1].currPiece = null;
					gameBoard[targetX+1][targetY-1].isOpen = true;
					let domRemoveParent = document.querySelectorAll(selectRemove)[0];
					let domRemoveChild = document.querySelectorAll(selectRemove)[1];
					domRemoveParent.removeChild(domRemoveChild);
				}
			}
		} else {
			if(gameBoard[targetX][targetY].isOpen){
				if(!gameBoard[targetX+1][targetY-1].isOpen &&
					gameBoard[targetX+1][targetY-1].currPiece.color === "black"){
					gameBoard[targetX][targetY].currPiece = gameBoard[pieceX][pieceY].currPiece;
					gameBoard[targetX][targetY].isOpen = false;
					gameBoard[pieceX][pieceY].currPiece = null;
					gameBoard[pieceX][pieceY].isOpen = true;
					let selectPiece = `#row${pieceX}-box${pieceY}`;
					let selectSpace = `#row${targetX}-box${targetY}`;
					let domPiece = document.querySelectorAll(selectPiece)[1];
					let domSpace = document.querySelector(selectSpace);
					domPiece.id = `row${targetX}-box${targetY}`;
				//console.log(domPiece);
					domSpace.appendChild(domPiece);
					let selectRemove = `#row${targetX+1}-box${targetY-1}`;
					gameBoard[targetX+1][targetY-1].currPiece = null;
					gameBoard[targetX+1][targetY-1].isOpen = true;
					let domRemoveParent = document.querySelectorAll(selectRemove)[0];
					let domRemoveChild = document.querySelectorAll(selectRemove)[1];
					domRemoveParent.removeChild(domRemoveChild);
				}
			}
		}
	} else if(targetX === (pieceX + 2) && targetY === (pieceY + 2)){
		if(pieceColor === "black"){
			if(gameBoard[targetX][targetY].isOpen){
				if(!gameBoard[targetX-1][targetY-1].isOpen && 
					gameBoard[targetX-1][targetY-1].currPiece.color === "white") {
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
				//console.log(domPiece);
					domSpace.appendChild(domPiece);
					console.log("jump move");
					let selectRemove = `#row${targetX-1}-box${targetY-1}`;
					gameBoard[targetX-1][targetY-1].currPiece = null;
					gameBoard[targetX-1][targetY-1].isOpen = true;
					let domRemoveParent = document.querySelectorAll(selectRemove)[0];
					let domRemoveChild = document.querySelectorAll(selectRemove)[1];
					domRemoveParent.removeChild(domRemoveChild);
				}
			}
		} else {
			if(gameBoard[targetX][targetY].isOpen){
				if(!gameBoard[targetX-1][targetY-1].isOpen && 
					gameBoard[targetX-1][targetY-1].currPiece.color === "black") {
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
				//console.log(domPiece);
					domSpace.appendChild(domPiece);
					console.log("jump move");
					let selectRemove = `#row${targetX-1}-box${targetY-1}`;
					gameBoard[targetX-1][targetY-1].currPiece = null;
					gameBoard[targetX-1][targetY-1].isOpen = true;
					let domRemoveParent = document.querySelectorAll(selectRemove)[0];
					let domRemoveChild = document.querySelectorAll(selectRemove)[1];
					domRemoveParent.removeChild(domRemoveChild);
				}
			}
		}
	} else if(targetX === (pieceX + 2) && targetY === (pieceY - 2)){
		if(pieceColor === "black"){
			if(gameBoard[targetX][targetY].isOpen){
				if(!gameBoard[targetX-1][targetY+1].isOpen &&
					gameBoard[targetX-1][targetY+1].currPiece.color === "white"){
					gameBoard[targetX][targetY].currPiece = gameBoard[pieceX][pieceY].currPiece;
					gameBoard[targetX][targetY].isOpen = false;
					gameBoard[pieceX][pieceY].currPiece = null;
					gameBoard[pieceX][pieceY].isOpen = true;
					let selectPiece = `#row${pieceX}-box${pieceY}`;
					let selectSpace = `#row${targetX}-box${targetY}`;
					let domPiece = document.querySelectorAll(selectPiece)[1];
					let domSpace = document.querySelector(selectSpace);
					domPiece.id = `row${targetX}-box${targetY}`;
				//console.log(domPiece);
					domSpace.appendChild(domPiece);
					console.log("jump move");
					let selectRemove = `#row${targetX-1}-box${targetY+1}`;
					gameBoard[targetX-1][targetY+1].currPiece = null;
					gameBoard[targetX-1][targetY+1].isOpen = true;
					let domRemoveParent = document.querySelectorAll(selectRemove)[0];
					let domRemoveChild = document.querySelectorAll(selectRemove)[1];
					domRemoveParent.removeChild(domRemoveChild);					
				}
				console.log("jump move");
			}
		} else {
			if(gameBoard[targetX][targetY].isOpen){
				if(!gameBoard[targetX-1][targetY+1].isOpen &&
					gameBoard[targetX-1][targetY+1].currPiece.color === "black"){
					gameBoard[targetX][targetY].currPiece = gameBoard[pieceX][pieceY].currPiece;
					gameBoard[targetX][targetY].isOpen = false;
					gameBoard[pieceX][pieceY].currPiece = null;
					gameBoard[pieceX][pieceY].isOpen = true;
					let selectPiece = `#row${pieceX}-box${pieceY}`;
					let selectSpace = `#row${targetX}-box${targetY}`;
					let domPiece = document.querySelectorAll(selectPiece)[1];
					let domSpace = document.querySelector(selectSpace);
					domPiece.id = `row${targetX}-box${targetY}`;
				//console.log(domPiece);
					domSpace.appendChild(domPiece);
					console.log("jump move");
					let selectRemove = `#row${targetX-1}-box${targetY+1}`;
					gameBoard[targetX-1][targetY+1].currPiece = null;
					gameBoard[targetX-1][targetY+1].isOpen = true;
					let domRemoveParent = document.querySelectorAll(selectRemove)[0];
					let domRemoveChild = document.querySelectorAll(selectRemove)[1];
					domRemoveParent.removeChild(domRemoveChild);					
				}
				console.log("jump move");
			}

		}
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
	//console.log(pieceToMove);
	//console.log(targetLocation);
	if(clickCount % 2 === 0 && clickCount > 1){
		//console.log(pieceToMove);
		//console.log(targetLocation);
		let pieceSplit = pieceToMove.split("-");
		let pieceRow = parseInt(pieceSplit[0].slice(3), 10);
		let pieceColumn = parseInt(pieceSplit[1].slice(3), 10);
		//console.log(pieceRow);
		//console.log(pieceColumn);
		let locSplit = targetLocation.split("-");
		let locRow = parseInt(locSplit[0].slice(3), 10);
		let locColumn = parseInt(locSplit[1].slice(3),10);
		//console.log(locColumn);
		checkLegalMove(pieceToMoveColor,pieceRow,pieceColumn,locRow,locColumn);
		pieceToMove = "";
		targetLocation = "";
	}
}




document.addEventListener("DOMContentLoaded", function() {
	gameInit();
	document.querySelector("#game-space").addEventListener("click", clickEventHandler);
})