# project1-checkers

## Link to Site:
https://chris-jburke.github.io/project1-checkers/

## Wireframe:
![wireframe](images/wireframe.pdf)

## Initial planning:
1. Set up the game board in HTML and get basic CSS styling
2. Create a Javascript representation of the game board using constructor functions
3. Set up pieces in HTML
4. Create a Javascript representation of the pieces
5. Implement the logic:
	- to move regular pieces and create king pieces
	- to jump over a piece and remove it from the board
	- to move king pieces and to allow kings to jump
6. Add win conditions:
	- when a player has no more pieces
	- when a player has no more legal moves left
	- when 50 plays have elapsed without a piece being taken
7. Improve CSS and add HTML elements to keep track of important user information
	- add a graveyard for taken pieces
	- add a display for each users score
	- add a text box to display who's turn it is
8. Add a forced double jump feature (happens automatically)
9. Increase overall project polish through addition of animations and colors

## MVP:
- 8 x 8 board with black and red pieces
- Only allow the users to make legal moves
- Detect if a player cannot make anymore legal moves and if so declare them the loser
- If a player has no more pieces declare them the loser
- Allow players to pick up a piece and move it to a legal location
- When a player take another's piece display the piece in a graveyard area
- If a piece becomes a king, change piece display to indicate new status
- Display a text area that tells users(s) who's turn it is

## Gameplay:
To create the game I utilized vinalla JS, CSS, and HTML. I made the board by creating divs in HTML and used DOM manipulation to move pieces between divs. All logic operations for this game are done by iterating through a 2D array of objects whos game state mirros the state of the HTML board.

## Obstacles:
- creating animations to make pieces slide between divs proved to be to compilated to do with how my game board was set up
- writing code that was not DRY and then needing to go back and refactor in order to reduce the number of lines

## Features:
- animations when a piece is taken and when the game ends
- automatic double jump pieces
- hovering over pieces turn the background a different color depending on the users turn
- all rules of American checkers are correctly implemented
- only allows for two player play

## Technologies Used:
- vanilla JS
- HTML
- CSS

## Sources:
- https://stackoverflow.com/questions/13528512/modify-a-css-rule-object-with-javascript
