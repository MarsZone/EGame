module Common {
	export class Updater {
		public constructor(game) {
			this.game = game;
		}
		game;

		update() {
            // this.updateZoning();
            // this.updateCharacters();
            // this.updatePlayerAggro();
            // this.updateTransitions();
            // this.updateAnimations();
            // this.updateAnimatedTiles();
            // this.updateChatBubbles();
            // this.updateInfos();
            // this.updateKeyboardMovement();
        }

		updateCharacters() {
            // var self = this;

            // this.game.forEachEntity(function(entity) {
            //     var isCharacter = entity instanceof Character;

            //     if(entity.isLoaded) {
            //         if(isCharacter) {
            //             self.updateCharacter(entity);
            //             self.game.onCharacterUpdate(entity);
            //         }
            //         self.updateEntityFading(entity);
            //     }
            // });
        }
	}
}