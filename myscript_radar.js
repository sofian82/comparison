const bwidth  = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
const bheight = window.innerHeight|| document.documentElement.clientHeight|| document.body.clientHeight;
const offset = 10;

function equalfhour(){
 var hashT = window.location.hash.substr(1);
 var splHash = hashT.split("/");
 var py = splHash[0],
     pm = splHash[1],
     pd = splHash[2],
     ph = splHash[3],
     fh = splHash[4];

 var ptar = new Date(parseInt(py),parseInt(pm)-1,parseInt(pd),parseInt(ph))
// console.log(ptar)

 var ftar = new Date(ptar);
 ftar.setHours (ftar.getHours() + parseInt(fh));

 var ctar = getSelectionVal().tarikh;
// console.log(ctar)

 var cfh;
 if (ftar > ctar) {
  cfh = Math.abs(ftar - ctar)/36e5;
 } else { cfh = 0; }

// console.log(cfh)
  return cfh;
}

function mula(step){

 var tar = getSelectionVal().tarikh;
 var hri = tar.getDate() < 10 ? "0" + tar.getDate() : tar.getDate();
 var bln = tar.getMonth() < 9 ? "0" + (tar.getMonth()+1) : (tar.getMonth()+1);
 var thn = tar.getFullYear();
 var zul = tar.getHours() < 10 ? "0" + tar.getHours() + "Z" : tar.getHours() + "Z";
 var dom = getSelectionVal().domain; 
 var param = getSelectionVal().param;
 var tinggi = getSelectionVal().level;
 var overlay1 = getSelectionVal().overlay1;
 var overlay2 = getSelectionVal().overlay2;
 var overlay3 = getSelectionVal().overlay3;
 var hourly = getSelectionVal().hourly;
 var timeStep;
 if ( hourly === "1h" ){ timeStep = 1; }
 if ( hourly === "3h" ){ timeStep = 3; }
 if ( hourly === "6h" ){ timeStep = 6; }
 if ( hourly === "12h" ){ timeStep = 12; }
 if ( hourly === "24h" ){ timeStep = 24; }
 var forHour = nextFor(timeStep*step);

 var verify = getSelectionVal().verify;
 var pic1 = "GFS";
 var pic2 = "UKMO"
 if ( verify === "gfs-radar" ) { pic1 = "GFS"; pic2 = "RADAR" }
 if ( verify === "gfs-radarain" ) { pic1 = "GFS"; pic2 = "RADAR-RAIN" }
 if ( verify === "ukmo-radar" ) { pic1 = "UKMO"; pic2 = "RADAR" }
 if ( verify === "ukmo-radarain" ) { pic1 = "UKMO"; pic2 = "RADAR-RAIN" }
 
//get hash (previous setting) to compare with selection (current setting)
 var hashDom = getHashVal().dom;
 var hashParam = getHashVal().param;
 var hashLev = getHashVal().lev;
 var hashForHour = getHashVal().forHour;
 var hashOverlay1 = getHashVal().overlay1;
 var hashOverlay2 = getHashVal().overlay2;
 var hashOverlay3 = getHashVal().overlay3;
 var hashDate = getHashVal().tarikh;
 var hashHourly = getHashVal().hourly;

//reset page when refresh (firefox)
 var refreshPage = "false"
 if ( dom == hashDom && param == hashParam && tinggi == hashLev && overlay1 == hashOverlay1 && overlay2 == hashOverlay2 && overlay3 == hashOverlay3 && forHour == hashForHour && hourly == hashHourly ){
    refreshPage = "true";
 }

//reset page when refresh (chrome)
 if ( dom == "domain" && param == "parameter" && tinggi == "level" && overlay1 == "overlay-no" && overlay2 == "overlay-no" && overlay3 == "overlay-no" && forHour == hashForHour && hourly == "hourly" ){
   if ( window.location.hash != "" ){
       dom = hashDom;
       param = hashParam;
       tinggi = hashLev;
       overlay = hashOverlay;
       forHour = hashForHour;
       hourly = hashHourly;
       refreshPage = "true";
       document.getElementById("domain").value = hashDom;
       document.getElementById("parameter").value = hashParam;
       document.getElementById("height").value = hashLev;
       document.getElementById("overlay1").value = hashOverlay1;
       document.getElementById("overlay2").value = hashOverlay2;
       document.getElementById("overlay3").value = hashOverlay3;
       document.getElementById("tarikh").value = hashDate.getFullYear() + "-" + hashDate.getMonth(        ) + "-" + hashDate.getDate() + "-" + hashDate.getHours();
       document.getElementById("skip").value = hashHourly;
   }
 }

//all precipitation related output
var precipout="no";
if ( param === "precipitation" || param === "precipt" || param === "lagens050" || param === "lagens100" || param === "lagens150" || param === "lagens200" || param === "lagens250" || param === "lagens7d050" || param === "lagens7d100" || param === "lagens7d150" || param === "lagens7d200" || param === "lagens7d250" ){
 precipout="yes";
}

//disable level option if precipitation selected.
if ( precipout === "yes" ){
  disableSelect("height",true);
  tinggi = "surface";
  document.getElementById("height").value = "level";
} else if ( param === "maxtemp" || param === "heatwave" ) { 
  disableSelect("height",true);
  tinggi = "surface";
  document.getElementById("height").value = "level";
} else { 
  disableSelect("height",false);
};

if ( precipout === "yes" ){
  disableSelect("radar",false);
} else {
  disableSelect("radar",true);
}

//show images only when all 4 parameters selected
if ( dom !== "domain" && param !== "parameter" && tinggi !== "level" && hourly !== "hourly" ){

//update hash value to current setting
 window.location.hash = thn + "/" + bln + "/" + hri + "/" +
 zul + "/" + forHour + "/" + dom + "/" + param + "/" + hourly + "/" + tinggi + "/" + overlay1 + "/" + overlay2 + "/" + overlay3;

 var imageGfs = new Image();
 imageGfs.crossOrigin = "anonymous";
// imageGfs.src = ""';
 if ( pic1 !== "RADAR" && pic1 !== "RADAR-RAIN"){
  if ( ( precipout === "yes" ) && hourly !== "1h" ){
     imageGfs.src = pic1 + "/" + thn + "/" + bln + "/" + hri + "/" +
      zul + "/" + forHour + "_" + dom +  "_" + param + "_" + hourly + "_" + tinggi + ".png"; }
  else {
     imageGfs.src = pic1 + "/" + thn + "/" + bln + "/" + hri + "/" +
      zul + "/" + forHour + "_" + dom +  "_" + param + "_" + tinggi + ".png"; }
 } else if ( pic1 === "RADAR-RAIN" ){ 
  if ( hourly !== "1h" ){
     imageGfs.src = pic1 + "/" + thn + "/" + bln + "/" + hri + "/" +
      zul + "/" + forHour + "_" + dom +  "_dbzr_" + hourly + "_" + tinggi + ".png"; }
  else {
     imageGfs.src = pic1 + "/" + thn + "/" + bln + "/" + hri + "/" +
      zul + "/" + forHour + "_" + dom +  "_dbzr_" + tinggi + ".png"; }
 } else {
  if ( hourly !== "1h" ){
     imageGfs.src = pic1 + "/" + thn + "/" + bln + "/" + hri + "/" +
      zul + "/" + forHour + "_" + dom +  "_dbz_" + hourly + "_" + tinggi + ".png"; }
  else {
     imageGfs.src = pic1 + "/" + thn + "/" + bln + "/" + hri + "/" +
      zul + "/" + forHour + "_" + dom +  "_dbz_" + tinggi + ".png"; }
 }

 while (gfsImg.firstChild) { gfsImg.removeChild(gfsImg.firstChild); }

 imageGfs.onload = imageOnloadGfs;
 imageGfs.onerror = function() { imageGfs.src = "no_data_available_" + dom + ".png"; 
                                 imageOnloadGfs; }

 var imageUkm = new Image();
 imageUkm.crossOrigin = "anonymous";
 if ( pic2 !== "RADAR" && pic2 !== "RADAR-RAIN"){
  if ( ( precipout === "yes" ) && hourly !== "1h" ){
     imageUkm.src = pic2 + "/" + thn + "/" + bln + "/" + hri + "/" +
     zul + "/" + forHour + "_" + dom +  "_" + param + "_" + hourly + "_" + tinggi + ".png"; }
  else {
     imageUkm.src = pic2 + "/" + thn + "/" + bln + "/" + hri + "/" +
     zul + "/" + forHour + "_" + dom +  "_" + param + "_" + tinggi + ".png"; }
 } else if ( pic2 === "RADAR-RAIN" ){
  if ( hourly !== "1h" ){
     imageUkm.src = pic2 + "/" + thn + "/" + bln + "/" + hri + "/" +
      zul + "/" + forHour + "_" + dom +  "_dbzr_" + hourly + "_" + tinggi + ".png"; }
  else {
     imageUkm.src = pic2 + "/" + thn + "/" + bln + "/" + hri + "/" +
      zul + "/" + forHour + "_" + dom +  "_dbzr_" + tinggi + ".png"; }
 }  else {
  if ( hourly !== "1h" ){
     imageUkm.src = pic2 + "/" + thn + "/" + bln + "/" + hri + "/" +
     zul + "/" + forHour + "_" + dom +  "_dbz_" + hourly + "_" + tinggi + ".png"; }
  else {
     imageUkm.src = pic2 + "/" + thn + "/" + bln + "/" + hri + "/" +
     zul + "/" + forHour + "_" + dom +  "_dbz_" + tinggi + ".png"; }
 }

 while (ukmImg.firstChild) { ukmImg.removeChild(ukmImg.firstChild); }
 
 imageUkm.onload = imageOnloadUkm;
 imageUkm.onerror = function() { imageUkm.src = "no_data_available_" + dom + ".png"; 
                                 imageOnloadUkm; }

//change time display--------------------------------------------
 var spanInitial = document.getElementById("desc-initial");
 spanInitial.textContent = "Initial: " + tar.getFullYear() + "-" + (tar.getMonth()+1) +
 "-" + tar.getDate() + " " + tar.getHours() + "Z";

 var timeDisplay = new Date(tar);
 timeDisplay.setHours(timeDisplay.getHours() + parseInt(forHour));

 var localTime = new Date(timeDisplay);
 localTime.setHours(localTime.getHours() + 8);

 var spanValid = document.getElementById("desc-valid");
 spanValid.textContent = "Valid: " + timeDisplay.getFullYear() + "-" + (timeDisplay.getMonth()+1) +
 "-" + timeDisplay.getDate() + " " + timeDisplay.getHours() + "Z " +
    "(" + localTime.getFullYear() + "-" + (localTime.getMonth()+1) + "-" + localTime.getDate() + " "         +
 localTime.getHours() + "MYT)";

 var spanHours = document.getElementById("desc-hours");
 spanHours.textContent = "Forecast Hours: " + forHour;

 paramDisplay(param, tinggi);
//----------------------------------------------------------------

}

if ( overlay1 !== "overlay-no" ){

 window.location.hash = thn + "/" + bln + "/" + hri + "/" +
 zul + "/" + forHour + "/" + dom + "/" + param + "/" + hourly + "/" + tinggi + "/" + overlay1 + "/" + overlay2 + "/" + overlay3; 

 var overlayGfs1 = new Image();
 overlayGfs1.crossOrigin = "anonymous";
 overlayGfs1.src = pic1 + "/" + thn + "/" + bln + "/" + hri + "/" +
   zul + "/" + forHour + "_" + dom +  "_" + overlay1.split("-")[1] + "_" + overlay1.split("-")[2] + ".png";

 overlayGfs1.onload = overlayImgOnloadGfs;
 overlayGfs1.onerror = function() { overlayGfs1.src = "no_data_available_" + dom + ".png";
                                      overlayImgOnloadGfs; }

 var overlayUkm1 = new Image();
 overlayUkm1.crossOrigin = "anonymous";
 overlayUkm1.src = pic2 + "/" + thn + "/" + bln + "/" + hri + "/" +
 zul + "/" + forHour + "_" + dom +  "_" + overlay1.split("-")[1] + "_" + overlay1.split("-")[2] + ".png";

 overlayUkm1.onload = overlayImgOnloadUkm;
 overlayUkm1.onerror = function() { overlayUkm1.src = "no_data_available_" + dom + ".png";
                                      overlayImgOnloadUkm; }

}

if ( overlay2 !== "overlay-no" ){

 window.location.hash = thn + "/" + bln + "/" + hri + "/" + zul + "/" + forHour + "/" + dom + "/" + param + "/" + hourly + "/" + tinggi + "/" + overlay1 + "/" + overlay2 + "/" + overlay3;

 var overlayGfs2 = new Image();
 overlayGfs2.crossOrigin = "anonymous";
 overlayGfs2.src = pic1 + "/" + thn + "/" + bln + "/" + hri + "/" + zul + "/" + forHour + "_" + dom +  "_" + overlay2.split("-")[1] + "_" + overlay2.split("-")[2] + ".png";

 overlayGfs2.onload = overlay2ImgOnloadGfs;

 var overlayUkm2 = new Image();
 overlayUkm2.crossOrigin = "anonymous";
 overlayUkm2.src = pic2 + "/" + thn + "/" + bln + "/" + hri + "/" + zul + "/" + forHour + "_" + dom +  "_" + overlay2.split("-")[1] + "_" + overlay2.split("-")[2] + ".png";

 overlayUkm2.onload = overlay2ImgOnloadUkm;

}

//main function end 
}

function paramDisplay(param, tinggi){
  
 var display = "";
  
 if ( param === "precipitation" ){
     display = "Precipitation (mm)";
 } else if ( param === "wind" ) {
     display = "Wind (knot)";
 } else if ( param === "temperature" ){
     display = "Temperature (°C)"
 } else if ( param === "rh" ){
     display = "Relative Humidity (%)"
 } else if ( param === "precipt" ){
     display = "Precipitation Thresholds"
 }

 if ( tinggi === "surface" ){
  if ( param === "precipitation" ){
     display = "Precipitation (mm)";
  } else if ( param === "wind" ) {
     display = "10m Wind (knot)";
  } else if ( param === "temperature" ){
     display = "2m Temperature (°C)"
  } else if ( param === "rh" ){
     display = "2m Relative Humidity (%)"
  } else if ( param === "precipt" ){
     display = "Precipitation Thresholds"
  }
 }

 var displayContainer = document.getElementById("desc-param");
 displayContainer.textContent = display;
 displayContainer.textContent;

}

function addTransparent(data,val){

 for (var i = 0; i < data.length; i += 4) {
//  var red = data[i + 0];
//  var green = data[i + 1];
//  var blue = data[i + 2];
  var alpha = data[i + 3];
  if ( alpha > 0 ) { data[i + 3] = val; }
 }  
 
// return data; 

}

function showGreen(data){
 for (var i = 0; i < data.length; i += 4) {
   data[i + 0] = data[i + 0] > 0? 0 : data[i + 0];
   data[i + 2] = data[i + 2] > 0? 0 : data[i + 2];
 }
}

function overlayImgOnloadGfs(){

//set canvas width half of browser width
 var width = bwidth/2 - offset;
 var height = bheight - offset; 

 var canvas = document.createElement('canvas');
 canvas.width = width;
 canvas.height = height;
 gfsImg.appendChild(canvas);

 var ctx = canvas.getContext("2d");
 canvas.style.position = "absolute";
 canvas.style.zIndex = "1";
 canvas.classList.add("overlayLayer");
 ctx.drawImage(this, 0, 0,this.width,this.height,0,0,width,height);

 var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
 var data = imgData.data;
 var opacRat = (opacityControlOver.value)/11*255; 
 addTransparent(data,opacRat);
 ctx.putImageData(imgData,0,0);

}

function overlay2ImgOnloadGfs(){

 var width = bwidth/2 - offset;
 var height = bheight - offset;

 var canvas = document.createElement('canvas');
 canvas.width = width;
 canvas.height = height;
 gfsImg.appendChild(canvas);
 
 var ctx = canvas.getContext("2d");
 canvas.style.position = "absolute";
 canvas.style.zIndex = "2";
 canvas.classList.add("overlayLayer");
 ctx.drawImage(this, 0, 0,this.width,this.height,0,0,width,height);

 var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
 var data = imgData.data;
 var opacRat = (opacityControlOver.value)/11*255;
 addTransparent(data,opacRat);
 showGreen(data);
 ctx.putImageData(imgData,0,0); 

}

function overlayImgOnloadUkm(){

//set 
 var width = bwidth/2 - offset;
 var height = bheight - offset;

 var canvas = document.createElement('canvas');
 canvas.width = width;
 canvas.height = height;
 ukmImg.appendChild(canvas);

 var ctx = canvas.getContext("2d");
 canvas.style.position = "absolute";
 canvas.style.zIndex = "1";
 canvas.classList.add("overlayLayer");
 ctx.drawImage(this, 0, 0,this.width,this.height,0,0,width,height);

 var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
 var data = imgData.data;
 var opacRat = (opacityControlOver.value)/11*255;
 addTransparent(data,opacRat);
 ctx.putImageData(imgData,0,0);

}

function overlay2ImgOnloadUkm(){

 var width = bwidth/2 - offset;
 var height = bheight - offset;
 
 var canvas = document.createElement('canvas');
 canvas.width = width;
 canvas.height = height;
 ukmImg.appendChild(canvas);

 var ctx = canvas.getContext("2d");
 canvas.style.position = "absolute";
 canvas.style.zIndex = "2";
 canvas.classList.add("overlayLayer");
 ctx.drawImage(this, 0, 0,this.width,this.height,0,0,width,height);

 var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
 var data = imgData.data;
 var opacRat = (opacityControlOver.value)/11*255;
 addTransparent(data,opacRat);
 showGreen(data);
 ctx.putImageData(imgData,0,0);
 
}

function imageOnloadGfs(){

// while (gfsImg.firstChild) { gfsImg.removeChild(gfsImg.firstChild); }

// var width = this.width;
// var height = this.height;
 var width = bwidth/2 - offset;
 var height = bheight - offset;

 var canvas = document.createElement('canvas');
 canvas.width = width;
 canvas.height = height;
 canvas.style.position = "absolute";
 canvas.style.zIndex = "0";
 canvas.classList.add("mainLayer");
 gfsImg.appendChild(canvas);
 
 var ctx = canvas.getContext("2d");
 ctx.drawImage(this, 0, 0,this.width,this.height,0,0,width,height);

 var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
 var data = imgData.data;

 var opacRat = (opacityControl.value)/11*255;
 addTransparent(data,opacRat);
 ctx.putImageData(imgData,0,0);

}

function imageOnloadUkm(){

// while (ukmImg.firstChild) { ukmImg.removeChild(ukmImg.firstChild); }

// var width = this.width;
// var height = this.height;

 var width = bwidth/2 - offset;
 var height = bheight - offset;

 var canvas = document.createElement('canvas');
 canvas.width = width;
 canvas.height = height;
 canvas.style.position = "absolute";
 canvas.style.zIndex = "0";
 canvas.classList.add("mainLayer");
 ukmImg.appendChild(canvas);
 
 var ctx = canvas.getContext("2d");
 ctx.drawImage(this, 0, 0,this.width,this.height,0,0,width,height);

 var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
 var data = imgData.data;

 var opacRat = (opacityControl.value)/11*255;
 addTransparent(data,opacRat);
 ctx.putImageData(imgData,0,0);
}

function nextFor(step) {

 var hashT = window.location.hash.substr(1);
 var splHash = hashT.split("/");

 var cfh = equalfhour();

// var jam = splHash.length === 1 ? "000" : splHash[4];
 var jam = splHash.length === 1 ? "000" : cfh;

 var nextjam = parseInt(jam)+step;

 if ( nextjam < 0 ){ nextjam = 168; }          //confirm step always < 0
 else if ( nextjam > 168 ){ nextjam = 0; }

//for go to first or last time stamp button (id first-step & last-step)
 if ( step >= 999 ){ nextjam = 0; }
 else if ( step <= -999 ){ nextjam = 168; }

 if ( nextjam < 10 ){
   nextjam = "00" + nextjam;
 } else if ( nextjam < 100 ) {
   nextjam = "0" + nextjam;
 } else { nextjam = nextjam.toString(); }

 return nextjam;

}

//function for disable select
function disableSelect(id,logik){
 var ele = document.getElementById(id);
 ele.disabled = logik ; //=== 0 ? true : false;
 if (logik === true) { ele.selectedIndex = 0; }
}

function getSelectionVal(){
  
  var tarikh = document.getElementById("tarikh").value ;
  var tarikhArr = tarikh.split("-");
  var hri = tarikhArr[2];
  var bln = tarikhArr[1];
  var thn = tarikhArr[0];
  var zul = tarikhArr[3];
  var tar = new Date(thn, bln, hri, zul);
 
  var dom = document.getElementById("domain").value ;
  var param = document.getElementById("parameter").value ;
  var tinggi = document.getElementById("height").value ;
  var overlay1 = document.getElementById("overlay1").value;
  var overlay2 = document.getElementById("overlay2").value;
  var overlay3 = document.getElementById("overlay3").value;
  var hourly = document.getElementById("skip").value;
  var verify = document.getElementById("radar").value;

  return { tarikh: tar, domain: dom, param: param, level: tinggi, overlay1: overlay1, overlay2: overlay2, overlay3: overlay3, hourly: hourly, verify: verify}        ;
 
}

function getHashVal(){

 var hashT = window.location.hash.substr(1);
 var splHash = hashT.split("/");
 var forHour = splHash[4];
 var dom = splHash[5];
 var param = splHash[6];
 var hourly = splHash[7];
 var lev = splHash[8];
 var overlay1 = splHash[9];
 var overlay2 = splHash[10];
 var overlay3 = splHash[11];

 var year = parseInt(splHash[0]);
 var month = parseInt(splHash[1]);
 var day = parseInt(splHash[2]);
 var hour = splHash[3] !== undefined ? parseInt(splHash[3].replace('Z','')) : null;

 var tar = new Date(year, month-1, day, hour);

 return { forHour: forHour, dom: dom, param: param, lev: lev, overlay1: overlay1, overlay2: overlay2, overlay3: overlay3, tarikh: tar, hourly: hourly }

}

function readInitial(){

 var init = JSON.parse(initial);
 var year = init.year;
 var month = init.month;
 var day = init.day;
 var hour = init.hour;

 return { "year" : year, "month" : month, "day" : day, "hour" : hour };

}

function addOption(){

 var hri = readInitial().day;
 var bln = readInitial().month;
 var thn = readInitial().year;
 var zul = readInitial().hour;
 var tar = new Date(thn, bln, hri, zul);

 var tarArr = [];
 tarArr.push(new Date(tar.setHours(tar.getHours())));
 for (var i = 1; i < 28; i++){
    tarArr.push(new Date(tar.setHours(tar.getHours()-6)));
 }
 
 var dateOpt = document.getElementById("tarikh");
 for (var i = 0; i < tarArr.length; i ++){
    var option = document.createElement("option");  //put inside loop to add many options under select
    option.value = tarArr[i].getFullYear()+"-"+tarArr[i].getMonth()+"-"+tarArr[i].getDate()+"-"+tarArr[i].getHours();
    option.text = tarArr[i].getFullYear()+"/"+(tarArr[i].getMonth()+1)+"/"+tarArr[i].getDate()+"/"+tarArr[i].getHours()+"Z";
    dateOpt.add(option);
 }

}

function playKedepan() {
   mula(1);
   playEvent = setTimeout(playKedepan, 1000);
}

function playKeblkg() {
   mula(-1);
   playEvent = setTimeout(playKeblkg, 1000);
}

//var gfsCanvas = document.getElementById("gfs-canvas"); //div for GFS image
//gfsCanvas.width = window.innerWidth / 2 - 5;
//gfsCanvas.height = window.innerHeight - 5;
//var gfsContex = gfsCanvas.getContext("2d");

var gfsImg = document.getElementById("gfs-img");
var ukmImg = document.getElementById("ukm-img");

var gfsCon = document.getElementById("gfs-con");
gfsCon.style.width = "50%";

var ukmCon = document.getElementById("ukm-con");
ukmCon.style.width = "50%";

var tarSelector = document.getElementById("tarikh");
tarSelector.addEventListener("change", function() {
   mula(0);
});

var domSelector = document.getElementById("domain");
domSelector.addEventListener("change", function() {
   mula(0);
});

var parSelector = document.getElementById("parameter");
parSelector.addEventListener("change", function() {
   mula(0);
});

var skipSelector = document.getElementById("skip");
skipSelector.addEventListener("change", function() {
   mula(0);
});

var heightSelector = document.getElementById("height");
heightSelector.addEventListener("change", function() {
   mula(0);
});

var overlaySelector = document.getElementById("overlay1");
overlaySelector.addEventListener("change", function() {
   mula(0);
});

var overlaySelector2 = document.getElementById("overlay2");
overlaySelector2.addEventListener("change", function() {
   mula(0);
});

var nextKlik = document.getElementById("next");
nextKlik.addEventListener("click", function() {
   mula(1);
});

var prevKlik = document.getElementById("prev");
prevKlik.addEventListener("click", function() {
   mula(-1);
});

var playEvent;
var playForward = document.getElementById("play-forward");
playForward.addEventListener("click", function() {
    clearTimeout(playEvent);
    playKedepan();
});

var playBackward = document.getElementById("play-backward");
playBackward.addEventListener("click", function() {
    clearTimeout(playEvent);
    playKeblkg();
});

var stopPlay = document.getElementById("play-stop");
   stopPlay.addEventListener("click", function() {
   clearTimeout(playEvent);
});

var firstKlik = document.getElementById("first-step");
firstKlik.addEventListener("click", function() {
   mula(999);
});

var lastKlik = document.getElementById("last-step");
lastKlik.addEventListener("click", function() {
   mula(-999);
});

var imageOpac = document.getElementById("divopac1");
imageOpac.addEventListener("mouseover", function() {
    this.getElementsByTagName("span")[0].style.display = "none";
    this.getElementsByTagName("input")[0].style.display = "inline";
});
imageOpac.addEventListener("mouseout", function() {
   this.getElementsByTagName("span")[0].style.display = "inline";
   this.getElementsByTagName("input")[0].style.display = "none";
});

var imageOpacOver = document.getElementById("divopac2");
imageOpacOver.addEventListener("mouseover", function() {
   this.getElementsByTagName("span")[0].style.display = "none";
   this.getElementsByTagName("input")[0].style.display = "inline";
});
imageOpacOver.addEventListener("mouseout", function() {
   this.getElementsByTagName("span")[0].style.display = "inline";
   this.getElementsByTagName("input")[0].style.display = "none";
});

var opacityControl = document.getElementById("opacslide1");
opacityControl.value = 11;
opacityControl.addEventListener("click", function() {
 
//  var gfsCanvas = gfsImg.childNodes[0];
  var gfsCanvas = document.getElementsByClassName("mainLayer")[0];
  var ctx = gfsCanvas.getContext("2d");
//  ctx.drawImage(this, 0, 0);
  
  var imgData = ctx.getImageData(0, 0, gfsCanvas.width, gfsCanvas.height);
  var data = imgData.data;
  
//  var opacRat = (opacityControl.value-1)/10;
  var opacRat = (opacityControl.value)/11*255;
  addTransparent(data,opacRat);
//  showGreen(data);
  ctx.putImageData(imgData,0,0);

//  var ukmCanvas = ukmImg.childNodes[0];
  var ukmCanvas = document.getElementsByClassName("mainLayer")[1];
  var ctx2 = ukmCanvas.getContext("2d");
  
  var imgData2 = ctx2.getImageData(0, 0, ukmCanvas.width, ukmCanvas.height);
  var data2 = imgData2.data;

  addTransparent(data2,opacRat);

  ctx2.putImageData(imgData2,0,0);

});

var opacityControlOver = document.getElementById("opacslide2");
opacityControlOver.value = 6;
opacityControlOver.addEventListener("click", function() {

 var overlay1Canvas = document.getElementsByClassName("overlayLayer");
 if ( overlay1Canvas[0] != null || overlay1Canvas[0] != undefined ){

   var ctx = overlay1Canvas[0].getContext("2d");
   var imgData = ctx.getImageData(0, 0, overlay1Canvas[0].width, overlay1Canvas[0].height);
   var data = imgData.data;
   var opacRat = (opacityControlOver.value)/11*255;
   addTransparent(data,opacRat);
   ctx.putImageData(imgData,0,0);

 }
 if ( overlay1Canvas[1] != null || overlay1Canvas[1] != undefined ){
 
   var ctx2 = overlay1Canvas[1].getContext("2d");
   var imgData2 = ctx2.getImageData(0, 0, overlay1Canvas[1].width, overlay1Canvas[1].height);
   var data2 = imgData2.data;
   var opacRat = (opacityControlOver.value)/11*255;
   addTransparent(data2,opacRat);
   ctx2.putImageData(imgData2,0,0);

 }
// console.log(gfsOverlay1Canvas);
// var gfsOverlay1Canvas = gfsImg.childNodes[2];

});

//addOption();
//mula(0);
