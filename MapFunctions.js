//adds all the trails to the map and the arrays
function setUpTrails(map){
    var coords = window.keezer.features[0].geometry.coordinates[0];
    addlay(roundCoords(coords,6),map,"keezer_d--_a--_tx--_ty--_cblue","blue");
    //addlay(window.twine.features[0].geometry.coordinates[0],map,"twine_d--_a--_tx--_ty--_c#00f","#00f");
    addAllPoints(roundCoords(coords,6),map);
    document.getElementById("datatable").rows[1].cells[9].querySelector("button").textContent = "Unselect";
}

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

//adds a layer to the map by adding it to the layer array then to the map
//then adds the toggle button to the toggle array
function addlay(coords,map,name,color){
    window.layers.push(createLayerClass(coords,map,name,color));
    window.removedPoints.push(new Array(0));
    window.movedPoints.push(new Array(0));
    addDataToTable(name);
    map.addLayer(window.layers[window.layers.length-1]);
}

//coord[0]+","+coord[1]
function addPoint(coord,map,color){
    var pt = {
        id: coord[0]+","+coord[1],
        type: 'circle',
        source: {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [
              {
                type: 'Feature',
                geometry: {
                  type: 'Point',
                  coordinates: coord // Set the coordinates of your point
                },
                properties: {
                  // Add any additional properties for your point
                  name: coord[0]+","+coord[1]
                }
              }
            ]
          }
        },
        paint: {
            'circle-radius': [
              'interpolate',
              ['linear'],
              ['zoom'],
              15, .5, 
              16, 1,
              17.5,2.5
            ],
            'circle-color': color
          },
          interactive: true
      }
      map.addLayer(pt);
    }

    //function to remove a point
function removePoint(point){
    var coords = window.selected.source.data.geometry.coordinates;
    //console.log(point)
    //go through every point in the selected line's array and remove it if it matches the given point
    removedPoints[window.selectedIndex].push(point);
    var i =get2DIndex(coords,point);
          map.removeLayer(coords[i][0]+","+coords[i][1]);
          map.removeSource(coords[i][0]+","+coords[i][1]);
          coords.splice(i,1);
          RestoreLog[selectedIndex].push([time,coords])
          
          //reassing the selected line with the new array without the point
          window.selected.source.data.geometry.coordinates = coords;
          map.removeLayer(window.selected.id);
          map.removeSource(window.selected.id);
          map.addLayer(window.selected);
}

    function addClickPoint(coord,map,color){
        var pt = {
            id: "id",
            type: 'circle',
            source: {
              type: 'geojson',
              data: {
                type: 'FeatureCollection',
                features: [
                  {
                    type: 'Feature',
                    geometry: {
                      type: 'Point',
                      coordinates: coord // Set the coordinates of your point
                    },
                    properties: {
                      // Add any additional properties for your point
                      name: coord[0]+","+coord[1]
                    }
                  }
                ]
              }
            },
            paint: {
                'circle-radius': [
                  'interpolate',
                  ['linear'],
                  ['zoom'],
                  15, .5, 
                  16, 1,
                  17.5,2.5
                ],
                'circle-color': color
              },
              interactive: true
          }
          map.addLayer(pt);
        }


        function addAllPoints(coords,map){
            for(var i=0; i<coords.length;i++){
                addPoint(coords[i],map,"red");
            }
        }
        
        function removeAllPoints(coords,map){
            for (var i =0; i<coords.length; i++){
            map.removeLayer(coords[i][0]+","+coords[i][1]);
            map.removeSource(coords[i][0]+","+coords[i][1]);
            }
        }

function removeAllSelectedPoints(){
    if (window.selectedPoints.length==0){
        printError("No selected Points")
        return
    }
    var coords = window.selected.source.data.geometry.coordinates;
    var point;
    for (var j =0; j<window.selectedPoints.length; j++){
    point = window.selectedPoints[j];
      //go through every point in the selected line's array and remove it if it matches the given point
      removedPoints[window.selectedIndex].push(point);
      var i = get2DIndex(coords,point)
            map.removeLayer(coords[i][0]+","+coords[i][1]);
            map.removeSource(coords[i][0]+","+coords[i][1]);
            coords.splice(i,1);
      window.selectedPoints.splice(j,1);
      j--;
    }
    //reassing the selected line with the new array without the point
    window.selected.source.data.geometry.coordinates = coords;
    map.removeLayer(window.selected.id);
    map.removeSource(window.selected.id);
    map.addLayer(window.selected);
    layers[window.selectedIndex] = selected;
  }


  function findClosestPoint(coords,point){
    var closestPt = coords[0];
    var closestVec =[Math.abs(365214.666667*Math.cos((Math.PI/180)*coords[0][1])*(coords[0][0]-point[0])),Math.abs(365214.666667 *(coords[0][1]-point[1]))];
    var curVec;
    var closestI=0;
    //console.log(coords[0]);
    /*
    console.log(closestVec);
    console.log(window.getMagnitude(closestVec));
    console.log("");*/
    for (var i =1; i<coords.length; i++){
        curVec =[Math.abs(365214.666667*Math.cos((Math.PI/180)*coords[i][1])*(coords[i][0]-point[0])),Math.abs(365214.666667 *(coords[i][1]-point[1]))];
        /*console.log(i);
        console.log(curVec);
        console.log(window.getMagnitude(curVec));*/
        if (window.getMagnitude(curVec)<window.getMagnitude(closestVec)){
            closestVec = curVec;
            closestI=i;
            closestPt = coords[i];
        }
        /*
        console.log(closestVec);
        console.log("");*/
    }
    //console.log(closestI);
    return closestPt;
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

    var buttons = new Array(4);
    for (var i =0; i<5; i++){
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

    buttons[3].id = name+"copy";
    buttons[3].textContent = "Copy";
    buttons[3].addEventListener("click",copy);

    buttons[4].id = name+"sel";
    buttons[4].textContent = "Select";
    buttons[4].addEventListener("click",changeSelected);

    var info = getInfo(name);
    for (var i = 0; i < 10; i++) {
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

 //checks whether this name already exists
 function validEnter(name){
    var curInfo = getInfo(name);
    var tempInfo;
    var valid;
        for (var i =0; i<window.layers.length; i++){
            valid = false;
            tempInfo = getInfo(window.layers[i].id);
            for (var j =0; j<curInfo.length-1; j++){
                if (curInfo[j]!=tempInfo[j]){
                    valid = true;
                }
            }
            if (!valid){
                return false;
            }
        }
        return true;
 }



//function to give an array with the values of the textfields
function gatherFields(){
    //ensure valid entries
    if (document.getElementById("distance").value=="" || isNaN(document.getElementById("distance").value)){
        printError("Distance Threshold: is not valid");
        return new Array(0);
    }
    if (document.getElementById("angle").value=="" || isNaN(document.getElementById("angle").value)){
        printError("Angle Threshold: is not valid");
        return new Array(0);
    }
    if (document.getElementById("translationX").value=="" || isNaN(document.getElementById("translationX").value)){
        printError("translation x: is not valid");
        return new Array(0);
    }
    if (document.getElementById("translationY").value==""  || isNaN(document.getElementById("translationY").value)){
        printError("translation x: is not valid");
        return new Array(0);
    }
    var fields = new Array(6);
    fields[0] = document.getElementById('distance').value;
    fields[1] = document.getElementById('angle').value;
    fields[2] = document.getElementById('translationX').value;
    fields[3] = document.getElementById('translationY').value;
    fields[4] = document.getElementById('color').value;
    fields[5] = document.getElementById("file").value;
    var drop = document.getElementById("file");
    var fileName = drop.options[drop.selectedIndex].textContent;
    fields[6] = fileName+"_d"+fields[0]+"_a"+fields[1]+"_tx"+fields[2]+"_ty"+fields[3]+"_c"+fields[4];
    return fields;
}

function removeShowPoint(map){
    if (window.showPoint!=null){
        map.setPaintProperty(window.showPoint[0]+","+window.showPoint[1], 'circle-radius', [
                      'interpolate',
                      ['linear'],
                      ['zoom'],
                      15, .5, 
                      16, 1,
                      17.5,2.5
                    ]);
        window.showPoint = null;
        document.getElementById('lastPoint').style.display = 'none';
      }
}

function removeMovePoint(map){
    if (window.movePoint!=null){
        map.setPaintProperty(window.movePoint[0]+","+window.movePoint[1], 'circle-radius', [
                      'interpolate',
                      ['linear'],
                      ['zoom'],
                      15, .5, 
                      16, 1,
                      17.5,2.5
                    ]);
        window.movePoint = null;
      }
}

function moveInd(point){
    var array = window.movedPoints[selectedIndex];
    return get2DIndex(window.movedPoints[selectedIndex],point);
}