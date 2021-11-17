(function showRadar(){

 addOption();
 mula(0);

 var leftH = document.getElementById("gfs-header")
 var rigtH = document.getElementById("ukm-header")

 var verSelector = document.getElementById("radar");
 verSelector.addEventListener("change", function() {
  if (this.value === "verification"){ var leftTxt = document.createTextNode("WRF-GFS"); 
                                      var righTxt = document.createTextNode("WRF-UKMO"); 
                                      disableSelect("overlay1",false); 
                                      disableSelect("overlay2",false);} 
  if (this.value === "gfs-radar"){ var leftTxt = document.createTextNode("WRF-GFS"); 
                                   var righTxt = document.createTextNode("RADAR"); 
                                   disableSelect("overlay1",true); 
                                   disableSelect("overlay2",true);}
  if (this.value === "ukmo-radar"){ var leftTxt = document.createTextNode("WRF-UKMO"); 
                                    var righTxt = document.createTextNode("RADAR"); 
                                    disableSelect("overlay1",true); 
                                    disableSelect("overlay2",true);} 
  var lspan = document.createElement("SPAN").appendChild(leftTxt);
  var rspan = document.createElement("SPAN").appendChild(righTxt);
  leftH.removeChild(leftH.childNodes[0]);
  leftH.appendChild(lspan);  
  rigtH.removeChild(rigtH.childNodes[0]); 
  rigtH.appendChild(rspan);  
  mula(0);
 });

})();
