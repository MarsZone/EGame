module Tools {
	export class EntityFactory {
		public constructor() {

			this.builders[Types.Entities.WARRIOR] = function(id, name?) {
        		return new Role.Warrior(id, name);
    		};

			this.builders[Types.Entities.RAT] = function(id, name?) {
        		return new Mobs.Rat(id);
    		};

			this.builders[Types.Entities.SKELETON] = function(id, name?) {
      		  return new Mobs.Skeleton(id);
    		};

			this.builders[Types.Entities.SKELETON2] = function(id, name?) {
				return new Mobs.Skeleton2(id);
			};

			this.builders[Types.Entities.SPECTRE] = function(id, name?) {
				return new Mobs.Spectre(id);
			};

			this.builders[Types.Entities.DEATHKNIGHT] = function(id, name?) {
				return new Mobs.Deathknight(id);
			};

			this.builders[Types.Entities.GOBLIN] = function(id, name?) {
				return new Mobs.Goblin(id);
			};

			this.builders[Types.Entities.OGRE] = function(id, name?) {
				return new Mobs.Ogre(id);
			};

			this.builders[Types.Entities.CRAB] = function(id, name?) {
				return new Mobs.Crab(id);
			};

			this.builders[Types.Entities.SNAKE] = function(id, name?) {
				return new Mobs.Snake(id);
			};

			this.builders[Types.Entities.EYE] = function(id, name?) {
				return new Mobs.Eye(id);
			};

			this.builders[Types.Entities.BAT] = function(id, name?) {
				return new Mobs.Bat(id);
			};

			this.builders[Types.Entities.WIZARD] = function(id, name?) {
				return new Mobs.Wizard(id);
			};

			this.builders[Types.Entities.BOSS] = function(id, name?) {
				return new Mobs.Boss(id);
			};
			
			 //===== items ======

			this.builders[Types.Entities.SWORD2] = function(id, name?) {
				return new Items.Sword2(id);
			};

			this.builders[Types.Entities.AXE] = function(id, name?) {
				return new Items.Axe(id);
			};

			this.builders[Types.Entities.REDSWORD] = function(id, name?) {
				return new Items.RedSword(id);
			};

			this.builders[Types.Entities.BLUESWORD] = function(id, name?) {
				return new Items.BlueSword(id);
			};

			this.builders[Types.Entities.GOLDENSWORD] = function(id, name?) {
				return new Items.GoldenSword(id);
			};

			this.builders[Types.Entities.MORNINGSTAR] = function(id, name?) {
				return new Items.MorningStar(id);
			};

			this.builders[Types.Entities.MAILARMOR] = function(id, name?) {
				return new Items.MailArmor(id);
			};

			this.builders[Types.Entities.LEATHERARMOR] = function(id, name?) {
				return new Items.LeatherArmor(id);
			};

			this.builders[Types.Entities.PLATEARMOR] = function(id, name?) {
				return new Items.PlateArmor(id);
			};

			this.builders[Types.Entities.REDARMOR] = function(id, name?) {
				return new Items.RedArmor(id);
			};

			this.builders[Types.Entities.GOLDENARMOR] = function(id, name?) {
				return new Items.GoldenArmor(id);
			};

			this.builders[Types.Entities.FLASK] = function(id, name?) {
				return new Items.Flask(id);
			};

			this.builders[Types.Entities.FIREPOTION] = function(id, name?) {
				return new Items.FirePotion(id);
			};

			this.builders[Types.Entities.BURGER] = function(id, name?) {
				return new Items.Burger(id);
			};

			this.builders[Types.Entities.CAKE] = function(id, name?) {
				return new Items.Cake(id);
			};

			this.builders[Types.Entities.CHEST] = function(id, name?) {
				return new Common.Chest(id);
			};

			//====== NPCs ======
			this.builders[Types.Entities.GUARD] = function(id, name?) {
				return new NPCs.Guard(id);
			};

			this.builders[Types.Entities.KING] = function(id, name?) {
				return new NPCs.King(id);
			};

			this.builders[Types.Entities.VILLAGEGIRL] = function(id, name?) {
				return new NPCs.VillageGirl(id);
			};

			this.builders[Types.Entities.VILLAGER] = function(id, name?) {
				return new NPCs.Villager(id);
			};

			this.builders[Types.Entities.CODER] = function(id, name?) {
				return new NPCs.Coder(id);
			};

			this.builders[Types.Entities.AGENT] = function(id, name?) {
				return new NPCs.Agent(id);
			};

			this.builders[Types.Entities.RICK] = function(id, name?) {
				return new NPCs.Rick(id);
			};

			this.builders[Types.Entities.SCIENTIST] = function(id, name?) {
				return new NPCs.Scientist(id);
			};

			this.builders[Types.Entities.NYAN] = function(id, name?) {
				return new NPCs.Nyan(id);
			};

			this.builders[Types.Entities.PRIEST] = function(id, name?) {
				return new NPCs.Priest(id);
			};

			this.builders[Types.Entities.SORCERER] = function(id, name?) {
				return new NPCs.Sorcerer(id);
			};

			this.builders[Types.Entities.OCTOCAT] = function(id, name?) {
				return new NPCs.Octocat(id);
			};

			this.builders[Types.Entities.BEACHNPC] = function(id, name?) {
				return new NPCs.BeachNpc(id);
			};

			this.builders[Types.Entities.FORESTNPC] = function(id, name?) {
				return new NPCs.ForestNpc(id);
			};

			this.builders[Types.Entities.DESERTNPC] = function(id, name?) {
				return new NPCs.DesertNpc(id);
			};

			this.builders[Types.Entities.LAVANPC] = function(id, name?) {
				return new NPCs.LavaNpc(id);
			};
			
		}
		builders=[];
		createEntity(kind, id, name?){
			if(!kind) {
				Main.debugView.log("kind is undefined","EntityFactory");
				return;
			}
			if(!_.isFunction(this.builders[kind])) {
				throw Error(kind + " is not a valid Entity type");
			}
			return this.builders[kind](id, name);			
		}

	}
}