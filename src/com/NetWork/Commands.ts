/**
 *
 * @author 
 *
 */
module NetWork{
    export class Commands extends egret.EventDispatcher{
        CMDHashMap:Tools.Map;
        public constructor() {
            super();
            this.CMDHashMap = new Tools.Map();
            this.CMDHashMap.put(Types.Messages.WELCOME,this.receiveWelcome);
            // this.CMDHashMap.put(Types.Messages.MOVE, this.receiveMove);
            // this.CMDHashMap.put(Types.Messages.LOOTMOVE, this.receiveLootMove);
            // this.CMDHashMap.put(Types.Messages.ATTACK, this.receiveAttack);
            this.CMDHashMap.put(Types.Messages.SPAWN, this.receiveSpawn);
            // this.CMDHashMap.put(Types.Messages.DESPAWN, this.receiveDespawn);
            // this.CMDHashMap.put(Types.Messages.SPAWN_BATCH, this.receiveSpawnBatch);
            // this.CMDHashMap.put(Types.Messages.HEALTH, this.receiveHealth);
            // this.CMDHashMap.put(Types.Messages.CHAT, this.receiveChat);
            // this.CMDHashMap.put(Types.Messages.EQUIP, this.receiveEquipItem);
            // this.CMDHashMap.put(Types.Messages.DROP, this.receiveDrop);
            // this.CMDHashMap.put(Types.Messages.TELEPORT, this.receiveTeleport);
            // this.CMDHashMap.put(Types.Messages.DAMAGE, this.receiveDamage);
            // this.CMDHashMap.put(Types.Messages.POPULATION, this.receivePopulation);
            // this.CMDHashMap.put(Types.Messages.LIST, this.receiveList);
            // this.CMDHashMap.put(Types.Messages.DESTROY, this.receiveDestroy);
            // this.CMDHashMap.put(Types.Messages.KILL, this.receiveKill);
            // this.CMDHashMap.put(Types.Messages.HP, this.receiveHitPoints);
            // this.CMDHashMap.put(Types.Messages.BLINK, this.receiveBlink;
            // this.CMDHashMap.put(Types.Messages.GUILDERROR, this.receiveGuildError);
            // this.CMDHashMap.put(Types.Messages.GUILD, this.receiveGuild);
            // this.CMDHashMap.put(Types.Messages.PVP, this.receivePVP);
        }
        public get CommandMap():Tools.Map{
            return this.CMDHashMap;
        }
        receiveWelcome(data,net:NetWork.Net) {
             var id = data[1],
                name = data[2],
                x = data[3],
                y = data[4],
                hp = data[5],
                armor = data[6],
                weapon = data[7],
                avatar = data[8],
                weaponAvatar = data[9],
                experience = data[10];
            
            if(net.welcome_callback)
            {
                net.welcome_callback(id, name, x, y, hp, armor, weapon, avatar, weaponAvatar, experience);
            }
            Main.debugView.log("Calling receiveWelcome");
        }

        receiveSpawn(data,net:NetWork.Net) {
            var id = data[1],
                kind = data[2],
                x = data[3],
                y = data[4];

            if(Types.isItem(kind)) {
                var item = Tools.EntityFactory.createEntity(kind, id);

                if(net.spawn_item_callback) {
                    net.spawn_item_callback(item, x, y);
                }
            } else if(Types.isChest(kind)) {
                var item = Tools.EntityFactory.createEntity(kind, id);

                if(net.spawn_chest_callback) {
                    net.spawn_chest_callback(item, x, y);
                }
            } else {
                var name, orientation, target, weapon, armor, level;

                if(Types.isPlayer(kind)) {
                    name = data[5];
                    orientation = data[6];
                    armor = data[7];
                    weapon = data[8];
                    if(data.length > 9) {
                        target = data[9];
                    }
                }
                else if(Types.isMob(kind)) {
                    orientation = data[5];
                    if(data.length > 6) {
                        target = data[6];
                    }
                }

                var character = Tools.EntityFactory.createEntity(kind, id, name);

                if(character instanceof Content.Player) {
                    character.weaponName = Types.getKindAsString(weapon);
                    character.spriteName = Types.getKindAsString(armor);
                }

                if(net.spawn_character_callback) {
                    net.spawn_character_callback(character, x, y, orientation, target);
                }
            }
        }
    }
}

