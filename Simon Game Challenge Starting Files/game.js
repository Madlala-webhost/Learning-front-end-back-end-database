buttonColours = ["red","blue","green","yellow"];
gamePattern = [];
userClickedPattern = [];
level = 0;
started = false;

function nextSequence(){
    userClickedPattern = [];
    level++;
    $("h1").text("level "+level);
    var randomNumber = Math.floor((Math.random() * 4));
    var randomChosenColour = buttonColours[randomNumber];
    gamePattern.push(randomChosenColour);
    console.log(gamePattern);
    $(".btn"+"."+randomChosenColour).fadeOut(100).fadeIn(100);
    playSound(randomChosenColour);
    animatePress(randomChosenColour);
    
};

$("div.btn").on("click",function(){
  var userChosenColour = $(this).attr("id");
  userClickedPattern.push(userChosenColour);
    console.log(userChosenColour);
    playSound(userChosenColour);
    animatePress(userChosenColour);
    checkAnswer(userClickedPattern.length - 1);
    
});

function playSound(name){
var audio = new Audio("./sounds/"+name+".mp3");
    audio.play();
};

function animatePress(currentColour){
$("#"+currentColour).addClass('pressed');
setTimeout(function() {
    $("#"+currentColour).removeClass('pressed');
}, 200);
};

$(document).on("keydown",function(event){
    if(!started){
nextSequence();
started = true;
}});

function checkAnswer (currentLevel) {
    if(userClickedPattern[currentLevel] === gamePattern[currentLevel]){
              console.log("success");
        if(userClickedPattern.length === gamePattern.length){
            setTimeout(function() {
                nextSequence();
            }, 1000);
        }
  
    } else{
        playSound("wrong");
        $("body").addClass("game-over");
        setTimeout(function() {
         $("body").removeClass("game-over");   
        }, 200);
        $("h1").text("Game Over, Press Any Key to Restart");
        console.log("wrong");
        startOver();
    }
}

function startOver (){
    level = 0;
    gamePattern = [];
    started = false;
}