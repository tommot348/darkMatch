function addRooms(map) {
  let rooms = [];
  let growth = Math.floor(Math.sqrt(map.length * map[0].length));
  let numberOfRooms = Math.floor(Math.random() * growth + growth / 10);
  for (let i = 0; i < numberOfRooms; ++i) {
    let [rwidth, rheight] = [Math.floor(Math.random() * growth / 5 + growth / 100), Math.floor(Math.random() * growth / 5 + growth / 100)];
    let [x, y] = [Math.floor(Math.random() * map.length - rwidth), Math.floor(Math.random() * map[0].length - rheight)];
    if (x < 0) {
      x = 0;
    }
    if (y < 0) {
      y = 0;
    }
    rooms.push({
      x: x,
      y: y,
      width: rwidth,
      height: rheight
    });
    for (let j = x; j < x + rwidth; ++j) {
      //console.log(rwidth, rheight, x, y);
      //map[j].fill("x", y, y + height - 1);
      for (let k = y; k < y + rheight; ++k) {
        ((map[j])[k]) = "x"
      }
    }
  //printMap(map);
  }
  return [map, rooms];
}
function addStart(map, rooms) {
  let room = rooms[Math.floor(Math.random() * (rooms.length - 1))];
  let [x, y] = [Math.floor((room.x * 2 + room.width) / 2), Math.floor((room.y * 2 + room.height) / 2)];
  map[x][y] = "o";
  return map;
}
function addConnections(map, rooms) {
  while (rooms.length > 0) {
    currentRoom = rooms.pop();
    let [middlex, middley] = [Math.floor((currentRoom.x + currentRoom.x + currentRoom.width) / 2), Math.floor((currentRoom.y + currentRoom.y + currentRoom.height) / 2)];
    let numCons = Math.floor(Math.random() * 4 + 2);
    while (numCons > 0 && rooms.length > 0) {
      let room = rooms.pop();
      let [omiddlex, omiddley] = [Math.floor((room.x + room.x + room.width) / 2), Math.floor((room.y + room.y + room.height) / 2)];

      let [distx, disty] = [omiddlex - middlex, omiddley - middley];
      let [incx, incy] = [distx / Math.abs(distx), disty / Math.abs(disty)];
      for (let i = middlex; i != omiddlex; i += incx) {
        if(!map[i][middley]){
          map[i][middley] = "x";
        }
      }
      for (let j = middley; j != omiddley; j += incy) {
        if(!map[omiddlex][j]){
           map[omiddlex][j] = "x";
        }
      }
      console.log("ttt");
      --numCons;
    }
  }

  return map;
}
function printMap(map) {
  let mapStr = " ";
  for (let i = 0; i < map.length; ++i) {
    mapStr += i % 10;
  }
  mapStr += "\n";
  for (let i = 0; i < map.length; ++i) {
    mapStr += i % 10;
    for (let j = 0; j < map[i].length; ++j) {
      if (map[j][i]) {
        mapStr += map[j][i];
      } else {
        mapStr += " ";
      }
    }
    mapStr += "\n";
  }
  console.log(mapStr);
}
function makeMap(width, height) {
  let map = new Array(width);
  for (let i = 0; i < map.length; ++i) {
    map[i] = new Array(height);
  }
  let rooms = null;
  (
  [map, rooms] = addRooms(map));
  map = addStart(map, rooms);
  map = addConnections(map, rooms);
  return map;
}
