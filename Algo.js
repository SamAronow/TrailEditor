//helper function
function getMagnitude(vector) {
    return Math.sqrt(Math.pow(vector[0],2)+Math.pow(vector[1],2));
 }

 //helper function
 function round(number, precision){
    return Math.round(1.0*number*Math.pow(10,precision))/Math.pow(10,precision);
 }

//function to get updated file
function reduce(coords,angle_threshold,distance_threshold){
    //get coordinates from the geoJSON and then loop through and round to 6th decimal
    //let coords =  file.features[0].geometry.coordinates[0];
    let len = coords.length;
    let newcoords = new Array(len);
    for (let i =0; i<len; i++){
        newcoords[i] = new Array(2);
    }

    for (let i =0; i<len; i++){ 
            newcoords[i][0] = coords[i][0];
            newcoords[i][1] = coords[i][1];
    }

    let backward_vector = new Array(2);
    let forward_vector = new Array(2);
    let theta=0; 


    //always keep the first and last point so don't need to include it 
    //in the loop because loop only serves to eliminate target points
    for (var i = 1; i<newcoords.length-1; i++){
        backward_vector = [(365214.666667 *Math.cos((Math.PI/180)*coords[i][1]))*(newcoords[i-1][0]-newcoords[i][0]),365214.666667 *(newcoords[i-1][1]-newcoords[i][1])];
        forward_vector = [(365214.666667 * Math.cos((Math.PI/180)*coords[i][1]))*(newcoords[i+1][0]-newcoords[i][0]),365214.666667*(newcoords[i+1][1]-newcoords[i][1])];
        //backward_vector = [newcoords[i-1][0]-newcoords[i][0],newcoords[i-1][1]-newcoords[i][1]];
        //forward_vector = [newcoords[i+1][0]-newcoords[i][0],newcoords[i+1][1]-newcoords[i][1]];
        theta = Math.acos(((forward_vector[0]*backward_vector[0])+(forward_vector[1]*backward_vector[1]))/(getMagnitude(forward_vector)*getMagnitude(backward_vector)));
        if (getMagnitude(backward_vector)<distance_threshold && theta>angle_threshold){
            newcoords.splice(i,1);
            i--;
        }
    }
    return newcoords;
}

//function to translate a given coordinate array by x and y lat and long
function translate(x,y,coords){
    var newcoords = new Array(coords.length);
    for (var i =0; i<coords.length; i++){
        newcoords[i] = new Array(2);
        newcoords[i][0]=coords[i][0]+(x/(Math.cos((Math.PI/180)*coords[i][1])*365214.666667));
        newcoords[i][1]=coords[i][1]+(y/365214.666667);
    }
    return roundCoords(newcoords,6);
}

//helper function to get the index of a given id
function search(id){
    for (var i =0; i<layers.length; i++){
        if (layers[i].id == id){
            return i;
        }
    }
    return -1;
}

function roundCoords(coords,precision){
    var newCoords = new Array(0)
    var x;
    var y;
    for (var i=0; i<coords.length; i++){
        x = coords[i][0];
        y= coords[i][1]
        if (needsRounding(x,precision)){
            if (needsRounding(y,precision)){
                newCoords.push([round(x,precision),round(y,precision)])
            }
            else{
                newCoords.push([round(coords[i][0],precision),y])
            }
        }
        else{
            if (needsRounding(y,precision)){
                newCoords.push([x,round(y,precision)])
            }
            else{
                newCoords.push([x,y])
            }
        }
    }
    return newCoords;
}


function needsRounding(number,precision){
    var val = number.toString();
    if (val.indexOf(".")==-1){
        return false;
    }
    val = val.substring(val.indexOf(".")+1)
    if (val.length>precision){
        return true;
    }
    return false;
}

function get2DIndex(array,value){
    for (var i=0; i<array.length; i++){
        if (array[i][0]==value[0] && array[i][1]==value[1]){
            return i;
        }
    }
    return -1;
}



window.round = round;
window.getMagnitude = getMagnitude;