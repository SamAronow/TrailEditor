//adds a new layer with parametized conditions to the layer array
function createLayerClass(coords,map,name,color){
    return {
        "id": name,
        "type": "line",
        "source": {
            "type": "geojson",
            "data": {
                "type": "Feature",
                "properties": {},
                "geometry": {
                    "type": "LineString",
                    "coordinates": coords
                }
            }
        },

        "layout": {
            "line-join": "round",
            "line-cap": "round"
        },
        "paint": {
            "line-color": color,
            "line-width": 3
        }
    }
}

//given an id it returns an array of distance threshold, angle threshold etc..
function getInfo(name){
    var info = new Array(7);
    info[1] = name.substring(0,name.indexOf("_d"));
    info[2] = name.substring(name.indexOf("_d")+2,name.indexOf("_a"));
    info[3] = name.substring(name.indexOf("_a")+2,name.indexOf("_tx"));
    info[4] = name.substring(name.indexOf("_tx")+3,name.indexOf("_ty"))+"/"+name.substring(name.indexOf("_ty")+3,name.indexOf("_c"));
    info[5] = name.substring(name.indexOf("_c")+2);
    var dropdown = document.getElementById("file");
    Array.from(dropdown.options).forEach(function(element) {
        if (element.textContent == info[1]){
            try{
            info[6] = JSON.parse(element.value);
            }
            catch(error){}
        }
      });
    info[0] = window.round((window.layers[window.layers.length-1].source.data.geometry.coordinates.length*100.0)/(info[6].features[0].geometry.coordinates[0].length),2)+"%";
    return info;
}

function addDataToTable(name){
    var table = document.getElementById("datatable");
    var newRow = table.insertRow();

    var buttons = new Array(3);
    for (var i =0; i<3; i++){
        buttons[i] = document.createElement("button");
    }

    buttons[0].id = name+"tog";
    buttons[0].textContent = "Hide";
    buttons[0].addEventListener("click",toggle);

    buttons[1].id = name+"rem";
    buttons[1].textContent = "Remove";
    buttons[1].addEventListener("click",remove);

    buttons[2].id = name+"edit";
    buttons[2].textContent = "Edit";
    buttons[2].addEventListener("click",promptChange);

    var info = getInfo(name);
    for (var i = 0; i < 8; i++) {
        newRow.insertCell();
        if (i<5){
            newRow.cells[i].innerHTML = info[i];
            newRow.cells[i].style.color = info[5];
        }
        else{
            newRow.cells[i].appendChild(buttons[i-5]);
            buttons[i-5].style.color = info[5];
        }
      }
 }



//adds a layer to the map by adding it to the layer array then to the map
//then adds the toggle button to the toggle array
function addlay(coords,map,name,color){
    window.layers.push(createLayerClass(coords,map,name,color));
    addDataToTable(name);
    map.addLayer(window.layers[window.layers.length-1]);
}

//adds all the trails to the map and the arrays
function setUpTrails(map){
    addlay(window.keezer.features[0].geometry.coordinates[0],map,"keezer_d--_a--_tx--_ty--_c#00f","#00f");
    //addlay(window.twine.features[0].geometry.coordinates[0],map,"twine_d--_a--_tx--_ty--_c#00f","#00f");

}