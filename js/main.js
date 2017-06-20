// H/t Jim Vallandingham tutorial: http://vallandingham.me/stepper_steps.html

var LAYERS = {
        "all": ["water_system", "road",
              "pylon_plazas", "alley", "river", "bridge", "road_lines", "rails", "train", "crosswalks",
              "power_systems", "various_topical_items", "park", "trucks", "bridge_front", "cars", "FREEWAY_pylon",
              "FREEWAY", "buildings_behind", "buldings_in_front", "cars_on_freeway", "garbage_truck", "people_layer",
              "ecommerce"],
        "transport": ["cars_on_freeway", "FREEWAY", "FREEWAY_pylon", "cars", "bridge_front", "trucks", "crosswalks",
                      "train", "rails", "road_lines", "bridge", "pylon_plazas", "road", "city_base", "subterranean"],
        "utils": ["garbage_truck", "power_systems", "water_system"],
        "city-svc": ["park", "power_systems", "ecommerce"],
        "data-collection": ["data-collection-icons"]
}

var STEPPER_CLICKED = false;

$(document).ready(function() {
  $("a.step-link").click(function(e) {
    var clickedStep = $(this).attr("id");
    STEPPER_CLICKED = true;
    switchStep(clickedStep);
    switchAnnotation(clickedStep);
    switchOpacity(clickedStep);
    stepSpecificTweaks(clickedStep);
    return false;
  });
  $("#all").click(function(evt){
    reposition("#train", "matrix(1,0,0,1,-20.9651,-11.4712)");//get that train off the tracks!
    STEPPER_CLICKED = false;
  })
});

function switchStep(newStep){
  $(".step-link").toggleClass("active", false);
  $("#" + newStep).toggleClass("active", true);
}

function switchAnnotation(newStep){
  $(".annotation-step").hide();
  $("#" + newStep + "-annotation").fadeIn(500);
}

function switchOpacity(newStep){
  //data-collection has to be invisible rather than dimmed, so I do it separately
  $("#data-collection-icons").css({opacity: 0});

  LAYERS["all"].forEach(function(layerToDim){
    $("#" + layerToDim).css({ opacity: 0.3 });
  })
  LAYERS[newStep].forEach(function(layerToShow){
    $("#" + layerToShow).css({ opacity: 1 });
  })
}

function stepSpecificTweaks(newStep){
  reposition("#train", "matrix(1,0,0,1,250,145)");
  reposition("#garbage_truck", "matrix(1,0,0,1,-75,45)");
  reposition("#drone1", "matrix(1,0,0,1,-5.8941,-73.3067)");
  reposition("#drone2", "matrix(1,0,0,1,238.6912,-23.3047)")

  if ( newStep === "utils" ){
    $("#streetlight").fadeIn();//turn on the lights
  } else {
    $("#streetlight").hide();
  }
}

//SVG animation
//h/t http://icanbecreative.com/article/animate-element-along-svg-path/

var map = Snap("#city"),
    train = map.select("#train"),
    drone1 = map.select("#drone1"),
    drone2 = map.select("#drone2"),
    truck = map.select("#garbage_truck");

var trainTrack = map.path("M944.9,553 680.3,400.2 585.9,345.7 454.8,270 410.5,244.4 347.2,207.9 266,161    ");
var trainTrackLength = Snap.path.getTotalLength(trainTrack);

var drone1Path = map.path("M494.1,326.7c8-9.2,27.9-29.5,60-38c50.2-13.3,90.9,12.6,99.3,18c4.7,3,75.4,49.6,63.3,121.3c-6,35.5-30.4,66.2-62,80.7c-57.2,26.3-129.9-4.2-132-28.7c-2.2-25.3,71.4-36.2,73.3-70c1.7-28.9-50.1-56.1-100-76");
var drone1PathLength = Snap.path.getTotalLength(drone1Path);

var drone2Path = map.path("M438.7,176.7c-48.2-25.5-103-4.4-118.7,32.7c-20.1,47.6,30.9,105.6,66,106.7c21.5,0.7,28.5-20.2,50.7-18c27.6,2.8,55.1,39,52.7,73.3c-2.3,33.3-32.1,53.5-44.7,62c-57.1,38.7-156.4,41.5-186.7-9.3c-14.2-23.8-15.1-62.8,4.7-90.7c48.5-68.4,185.1-19.2,209.3-70.7c5.8-12.4,7.3-35.3-24.7-79.3");
var drone2PathLength = Snap.path.getTotalLength(drone2Path);

var garbagePath = map.path("M272.6,360.8C222,392.5,171.3,425.2,120.4,459c-7,4.7-14,9.3-21,14");
var garbagePathLength = Snap.path.getTotalLength(garbagePath);

drone1Path.attr("fill", "none") //Snap generated path defaults to black fill, so fix it
drone2Path.attr("fill", "none")
garbagePath.attr("fill", "none")

function reposition(element, matrix){
  return document.querySelector(element).setAttribute("transform", matrix)
}

                        //start & finish sometimes inverted depending on direction of travel
                        //so I figure length above instead of inside function to be flex
function moveIt(element, start, finish, path, magicX, magicY, duration){
  Snap.animate(finish, start, function(step){
    if (STEPPER_CLICKED){
      return;
    } else {
      moveToPoint = Snap.path.getPointAtLength(path, step);
      x = moveToPoint.x - magicX; //magic numbers, can't yet figure how they're related to element height, viewBox
      y = moveToPoint.y - magicY;
      element.transform("translate(" + x + "," + y + ")");
    }
  }, duration);
}

moveIt(train, 0, trainTrackLength, trainTrack, 300, 180, 5000);
setInterval( function(){ moveIt(train, 0, trainTrackLength, trainTrack, 300, 180, 5000);}, 9000);

moveIt(drone1, 0, drone1PathLength, drone1Path, 500, 400, 6000);
setInterval( function(){ moveIt(drone1, 0, drone1PathLength, drone1Path, 500, 400, 6000);}, 6000)

moveIt(drone2, 0, drone2PathLength, drone2Path, 200, 200, 6000);
setInterval( function(){ moveIt(drone2, 0, drone2PathLength, drone2Path, 200, 200, 6000);}, 6000)

//garbage truck just drives off, no repeat
moveIt(truck, garbagePathLength, 0, garbagePath, 300, 340, 6000);



