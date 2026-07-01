console.log($("h1").css("font-size"));
$("h1").addClass("big-title");
//you can add multiple classes  $("h1").addClass("big-title gradient-background")
setTimeout(function() {
   $("h1").removeClass("big-title"); 
}, 900);

$("h1").text("Bye");
$("h1").html("<em>Bye</em>");
// you can use the $("a").attr("href","https///www.yahoo.com"); to set an attribute which counld be a image source or link etc.
// a class is also an attribute and if you want to set or get a class

//adding an event listener is even easier in jquery(see below)
$("h1").click(function(event) {
    $("h1").css("font-size","10rem");
    console.log(event);
});
//for (var i = 0; i < 5; i++){
 //   document.querySelectorAll("button")[i].addEventListener("click",function(){
   //     document.querySelector("h1").style.color = "purple";
//    }
 //   );
//}
//this is how you add an event listener using jquery (below)
$("button").click(function(){
    $("h1").css("color","purple");
}
);
// you do not bother with a for loop on jquery for adding event listeners because the $("")looks for all the selectors and sets them all with an event listener
$(document).keydown(function(event){
console.log($("h1").text(event.key));
});
//you can use also $(document).on("mouse-over"function(){})


//you can also add or remove elements using jQuery
$("h1").before("<button>New</button>")
//This creates a button before the H1. you can slo use $("h1").after("<button>New</button>") to create a button after the h1

//You can also use prepend (before the content) of h1 and append (after the content) of h1. In this case it would be juste before Bye and just after bye respectively.
$("button").on("click", function(){
    $("input").toggle("click");
});
//instead of toggle you can also use fad in and fade out, slideUp, slideDown, or .animate({opacity: 0.5}). you cannot add things without a numeric value in the curly braces of animate. 
//You can chain your animations $("h1").slideUp().slideDown().animate({opacity:0.3});