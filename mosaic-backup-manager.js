const fs = require("fs");

// join rooms (on same floor) into first with new name

// path to backup.json
// INDOOR->FIRST
// FIRST->PARENTS, FIRST->CHILDREN

const joinRooms = (path, destRoomName, rooms) => {
    const config = fs.readFileSync(path);

    if (!config) console.log("There is no mosaic backup in path " + path);
    else {
        const json = JSON.parse(config);
        const {floors} = json;

        const findRoom = (roomPath) => {
            const [floorTitle, roomTitle] = roomPath.split("->");
            const floor = floors.find(f => f.title == floorTitle);
            const room = floor.rooms.find(f => f.title == roomTitle);
            return room;
        };
        
        const deleteRoom = (roomPath) => {
            const [floorTitle, roomTitle] = roomPath.split("->");
            const floor = floors.find(f => f.title == floorTitle);
            const roomIndex = floor.rooms.findIndex(f => f.title == roomTitle);
            floor.rooms.splice(roomIndex, 1);
        };

        const destRoom = findRoom(destRoomName);
        if (!destRoom) return console.log("There is no such destRoom");

        let movedWidgets = 0;
        let deletedRooms = 0;

        rooms.forEach((r, i) => {
            const room = findRoom(r);
            room.widgets.forEach(w => {
                destRoom.widgets.push(w);
                movedWidgets++;
            });

            // delete copied widgets
            deleteRoom(r);
            deletedRooms++;
        });

        // delete empty floors
        let deletedFloors = 0;
        json.floors = floors.filter((f, i) => {
            const empty = !f.rooms.length;
            if (empty) deletedFloors++;
            return !empty;
        });

        // save new file
        fs.writeFileSync(path.split(".json")[0] + "_changed.json", JSON.stringify(json));
        console.log(`Moved ${movedWidgets} widgets from ${deletedRooms} rooms. Removed ${deletedFloors} empty floors`);
    };
};

module.exports = {joinRooms};
