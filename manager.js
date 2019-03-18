const {joinRooms} = require("./mosaic-backup-manager");

joinRooms("./mosaic-backup.json", "INDOOR->FIRST", ["FIRST->PARENTS", "FIRST->CHILDREN"]);
