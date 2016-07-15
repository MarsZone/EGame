module Tools {
	export class EntityFactory {
		public constructor() {

			EntityFactory.builders[Types.Entities.WARRIOR] = function(id, name) {
        		return new Role.Warrior(id, name);
    		};

			EntityFactory.builders[Types.Entities.RAT] = function(id) {
        		return new Mobs.Rat(id);
    		};

			EntityFactory.builders[Types.Entities.SKELETON] = function(id) {
      		  return new Mobs.Skeleton(id);
    		};

			EntityFactory.builders[Types.Entities.SKELETON2] = function(id) {
				return new Mobs.Skeleton2(id);
			};

			EntityFactory.builders[Types.Entities.SPECTRE] = function(id) {
				return new Mobs.Spectre(id);
			};

			EntityFactory.builders[Types.Entities.DEATHKNIGHT] = function(id) {
				return new Mobs.Deathknight(id);
			};

			EntityFactory.builders[Types.Entities.GOBLIN] = function(id) {
				return new Mobs.Goblin(id);
			};

			EntityFactory.builders[Types.Entities.OGRE] = function(id) {
				return new Mobs.Ogre(id);
			};

			EntityFactory.builders[Types.Entities.CRAB] = function(id) {
				return new Mobs.Crab(id);
			};

			EntityFactory.builders[Types.Entities.SNAKE] = function(id) {
				return new Mobs.Snake(id);
			};

			EntityFactory.builders[Types.Entities.EYE] = function(id) {
				return new Mobs.Eye(id);
			};

			EntityFactory.builders[Types.Entities.BAT] = function(id) {
				return new Mobs.Bat(id);
			};

			EntityFactory.builders[Types.Entities.WIZARD] = function(id) {
				return new Mobs.Wizard(id);
			};

			EntityFactory.builders[Types.Entities.BOSS] = function(id) {
				return new Mobs.Boss(id);
			};

			EntityFactory.builders[Types.Entities.SWORD2] = function(id) {
    		    return new Items.Sword2(id);
   			 };
		}

		static createEntity(kind, id, name?){
			if(!kind) {
				Main.debugView.log("kind is undefined","EntityFactory");
				return;
			}

			if(!_.isFunction(EntityFactory.builders[kind])) {
				throw Error(kind + " is not a valid Entity type");
			}

			return EntityFactory.builders[kind](id, name);
		}

		static builders=[];
	}
}