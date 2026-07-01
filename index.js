
var diceContainer = ["dice1", "dice2", "dice3", "dice4", "dice5", "dice6"];
var randomNumber1 = Math.random();
randomNumber1 = Math.floor(randomNumber1 * 6 );
var diceSelector1  = diceContainer[randomNumber1];
document.querySelector(".img1").setAttribute("src", "./images/" + diceSelector1 + ".png");

var randomNumber2 = Math.random();
randomNumber2 = Math.floor(randomNumber2 * 6 );
var diceSelector2 = diceContainer[randomNumber2];
document.querySelector(".img2").setAttribute("src", "./images/" + diceSelector2 + ".png");
if (diceSelector1 > diceSelector2){
    document.querySelector("h1").textContent = "Player 1 Wins!";
} else if (diceSelector1 < diceSelector2){
 document.querySelector("h1").textContent = "Player 2 Wins!";   
} else {
     document.querySelector("h1").textContent = "DRAW"; 
}