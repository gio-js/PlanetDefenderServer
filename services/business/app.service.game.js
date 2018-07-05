const uuidv1 = require('uuid/v1');
const DalConst = require('../../const/app.const.dal');
const UserStatisticsService = require('../../services/business/app.service.userStatistics');
const PlanetDefenderCore = require('planet-defender-core');

class GameService {

    constructor() {
        this.service = new UserStatisticsService.Class();
    }

    /**
     * Checks wheter the command is valid or not
     */
    isCommandValid(gameArena, command) {
        switch(command.CommandType) {
            case PlanetDefenderCore.CommandType.Attack:
                const attackerElement = gameArena.GetMapElementById(command.RelatedElementId);
                const targetElement = gameArena.GetMapElementById(command.TargetElementId);

                if (
                    (
                        (attackerElement.Location.X === targetElement.Location.X + 1) ||
                        (attackerElement.Location.X === targetElement.Location.X - 1)
                    ) &&
                    (attackerElement.Location.Y === targetElement.Location.Y)
                ) {
                    return true;
                }

                if (
                    (
                        (attackerElement.Location.Y === targetElement.Location.Y + 1) ||
                        (attackerElement.Location.Y === targetElement.Location.Y - 1)
                    ) &&
                    (attackerElement.Location.X === targetElement.Location.X)
                ) {
                    return true;
                }

                break;
            case PlanetDefenderCore.CommandType.Move:
                const targetLocation = command.TargetLocation;
                const tileMoveTarget = gameArena.Map.getTileAt(targetLocation.X, targetLocation.Y);

                if (!tileMoveTarget.Element) {
                    return true;
                }

                break;
        }

        return false;
    }

    /**
     * Applies the command changes on the game arena
     */
    applyCommand(gameArena, command) {
        switch(command.CommandType) {
            case PlanetDefenderCore.CommandType.Attack:
                const targetElement = gameArena.GetMapElementById(command.TargetElementId);

                targetElement.Lives--;
                if (targetElement.Lives <= 0) {
                    // remove from attacker or defender
                    let index = gameArena.Defender.Buildings.findIndex(b => b.Uid === targetElement.Uid);
                    if (index >= 0) {
                        gameArena.Defender.Buildings.splice(index, 1);
                        return;
                    }

                    index = gameArena.Defender.Tanks.findIndex(b => b.Uid === targetElement.Uid);
                    if (index >= 0) {
                        gameArena.Tanks.Buildings.splice(index, 1);
                        return;
                    }

                    index = gameArena.Attacker.Tanks.findIndex(b => b.Uid === targetElement.Uid);
                    if (index >= 0) {
                        gameArena.Attacker.Tanks.splice(index, 1);
                        return;
                    }
                }

                break;
            case PlanetDefenderCore.CommandType.Move:
                const movingElement = gameArena.GetMapElementById(command.RelatedElementId);
                const targetLocation = command.TargetLocation;
                const tileMoveOrigin = gameArena.Map.getTileAt(movingElement.Location.X, movingElement.Location.Y);
                const tileMoveTarget = gameArena.Map.getTileAt(targetLocation.X, targetLocation.Y);

                movingElement.Location.X = targetLocation.X;
                movingElement.Location.Y = targetLocation.Y;
                tileMoveOrigin.Element = null;
                tileMoveTarget.Element = movingElement;
                break;
        }
    }

    /**
     * Checks for the last game command (ends of buildings for the defender or ends of tanks for the attacker)
     */
    isGameEnded(gameArena) {
        if (!gameArena.Attacker) 
            return false;

        return (
            gameArena.Defender.Buildings.length === 0 || 
            gameArena.Attacker.Tanks.length === 0);
    }

    /**
     * Checks if the defender is the winner
     */
    isDefenderWinner(gameArena) {
        if (!gameArena.Attacker) 
            return false;

        return (gameArena.Defender.Buildings.length === 0);
    }

    /**
     * Update users statistics
     */
    updateStatistics(gameArena) {
        return this.service
                .getStatistics(gameArena.Defender.UserId)
                .then(function (stats) {
                    const isDefenderWinner = this.isDefenderWinner(gameArena);

                    // create stats
                    if (!stats) {
                        stats = new PlanetDefenderCore.UserStatistics();
                    }
                    stats.BuildingLosts += (PlanetDefenderCore.BUILDINGS_INITIAL_COUNT - gameArena.Defender.Buildings.length);
                    stats.DefeatsCount += (isDefenderWinner === true ? 0 : 1);
                    stats.VictoriesCount += (isDefenderWinner === true ? 1 : 0);
                    stats.UnitsLosts += (PlanetDefenderCore.TANKS_INITIAL_COUNT - gameArena.Defender.Tanks.length);
                    stats.UserId += gameArena.Defender.UserId;
                    //stats.UserEmail += gameArena.Defender.UserEmail;

                    // insert to database
                    this.service.insertOrUpdate(stats);

                    return stats;

                });
                
        return this.service
                .getStatistics(gameArena.Attacker.UserId)
                .then(function (stats) {
                    const isDefenderWinner = this.isDefenderWinner(gameArena);

                    // create stats
                    if (!stats) {
                        stats = new PlanetDefenderCore.UserStatistics();
                    }
                    stats.BuildingLosts += 0;
                    stats.DefeatsCount += (!isDefenderWinner === true ? 0 : 1);
                    stats.VictoriesCount += (!isDefenderWinner === true ? 1 : 0);
                    stats.UnitsLosts += (PlanetDefenderCore.TANKS_INITIAL_COUNT - gameArena.Attacker.Tanks.length);
                    stats.UserId += gameArena.Attacker.UserId;
                    //stats.UserEmail += gameArena.Defender.UserEmail;

                    // insert to database
                    this.service.insertOrUpdate(stats);

                    return stats;

                });
    }

    /**
     * Manages the requested command and updates statistics
     */
    manageCommand(gameArena, command) {
        let commandIsValid = this.isCommandValid(gameArena, command);

        if (commandIsValid) {
            this.applyCommand(gameArena, command);
        }

        if (this.isGameEnded(gameArena)) {
            this.updateStatistics(gameArena);
        }

        return commandIsValid;
    }

    /**
     * Dispose function, removes any internal resource pointer
     */
    dispose() {
        if (this.service) {
            this.service.dispose();
            this.service = null;
        }
    }

}

exports.Class = GameService;