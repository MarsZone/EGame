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
            this.CMDHashMap.put(Types.Messages.MOVE, this.receiveMove);
            this.CMDHashMap.put(Types.Messages.LOOTMOVE, this.receiveLootMove);
            this.CMDHashMap.put(Types.Messages.ATTACK, this.receiveAttack);
            this.CMDHashMap.put(Types.Messages.SPAWN, this.receiveSpawn);
            this.CMDHashMap.put(Types.Messages.DESPAWN, this.receiveDespawn);
            //this.CMDHashMap.put(Types.Messages.SPAWN_BATCH, this.receiveSpawnBatch);
            this.CMDHashMap.put(Types.Messages.HEALTH, this.receiveHealth);
            this.CMDHashMap.put(Types.Messages.CHAT, this.receiveChat);
            this.CMDHashMap.put(Types.Messages.EQUIP, this.receiveEquipItem);
            this.CMDHashMap.put(Types.Messages.DROP, this.receiveDrop);
            this.CMDHashMap.put(Types.Messages.TELEPORT, this.receiveTeleport);
            this.CMDHashMap.put(Types.Messages.DAMAGE, this.receiveDamage);
            this.CMDHashMap.put(Types.Messages.POPULATION, this.receivePopulation);
            this.CMDHashMap.put(Types.Messages.LIST, this.receiveList);
            this.CMDHashMap.put(Types.Messages.DESTROY, this.receiveDestroy);
            this.CMDHashMap.put(Types.Messages.KILL, this.receiveKill);
            this.CMDHashMap.put(Types.Messages.HP, this.receiveHitPoints);
            this.CMDHashMap.put(Types.Messages.BLINK, this.receiveBlink);
            //this.CMDHashMap.put(Types.Messages.GUILDERROR, this.receiveGuildError);
            //this.CMDHashMap.put(Types.Messages.GUILD, this.receiveGuild);
            this.CMDHashMap.put(Types.Messages.PVP, this.receivePVP);
        }
        public get CommandMap():Tools.Map{
            return this.CMDHashMap;
        }
        receiveLootMove(data,net:NetWork.Net) {
            var id = data[1],
                item = data[2];

            if(net.lootmove_callback) {
                net.lootmove_callback(id, item);
            }
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
            Main.debugView.log("Calling receiveWelcome","Commands");
        }
        receiveMove(data,net:NetWork.Net) {
            var id = data[1],
                x = data[2],
                y = data[3];
            if(net.move_callback) {
                net.move_callback(id, x, y);
            }
        }
        receivePopulation(data,net:NetWork.Net) {
            var worldPlayers = data[1],
                totalPlayers = data[2];

            if(net.population_callback) {
                net.population_callback(worldPlayers, totalPlayers);
            }
        }
        receiveAttack(data,net:NetWork.Net) {
            var attacker = data[1],
                target = data[2];

            if(net.attack_callback) {
                net.attack_callback(attacker, target);
            }
        }
        receiveDespawn(data,net:NetWork.Net) {
            var id = data[1];

            if(net.despawn_callback) {
                net.despawn_callback(id);
            }
        }
        receiveList(data,net:NetWork.Net) {
            data.shift();

            if(net.list_callback) {
                net.list_callback(data);
            }
        }
        receiveKill(data,net:NetWork.Net) {
            var mobKind = data[1];
            var level = data[2];
            var exp = data[3];

            if(net.kill_callback) {
                net.kill_callback(mobKind, level, exp);
            }
        }      

        receiveHealth(data,net:NetWork.Net) {
            var points = data[1],
                isRegen = false;

            if(data[2]) {
                isRegen = true;
            }

            if(net.health_callback) {
                net.health_callback(points, isRegen);
            }
        }

        receiveChat(data,net:NetWork.Net) {
            var id = data[1],
                text = data[2];

            if(net.chat_callback) {
                net.chat_callback(id, text);
            }
        }

        receiveEquipItem(data,net:NetWork.Net) {
            var id = data[1],
                itemKind = data[2];

            if(net.equip_callback) {
                net.equip_callback(id, itemKind);
            }
        }

        receiveDrop(data,net:NetWork.Net) {
            var mobId = data[1],
                id = data[2],
                kind = data[3],
                item = net.entityFactory.createEntity(kind, id);

            item.wasDropped = true;
            item.playersInvolved = data[4];

            if(net.drop_callback) {
                net.drop_callback(item, mobId);
            }
        }

        receiveTeleport(data,net:NetWork.Net) {
            var id = data[1],
                x = data[2],
                y = data[3];

            if(net.teleport_callback) {
                net.teleport_callback(id, x, y);
            }
        }
        receiveDamage(data,net:NetWork.Net) {
            var id = data[1];
            var dmg = data[2];
            var hp = parseInt(data[3]);
            var maxHp = parseInt(data[4]);

            if(net.dmg_callback) {
                net.dmg_callback(id, dmg, hp, maxHp);
            }
        }

        receiveSpawn(data,net:NetWork.Net) {
            var id = data[1],
                kind = data[2],
                x = data[3],
                y = data[4];

            if(Types.isItem(kind)) {
                var item = net.entityFactory.createEntity(kind, id);

                if(net.spawn_item_callback) {
                    net.spawn_item_callback(item, x, y);
                }
            } else if(Types.isChest(kind)) {
                // var item = this.entityFactory.createEntity(kind, id);
                
                // if(net.spawn_chest_callback) {
                //     net.spawn_chest_callback(item, x, y);
                // }
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

                var character = net.entityFactory.createEntity(kind, id, name);

                if(character instanceof Content.Player) {
                    character.weaponName = Types.getKindAsString(weapon);
                    character.spriteName = Types.getKindAsString(armor);
                }

                if(net.spawn_character_callback) {
                    net.spawn_character_callback(character, x, y, orientation, target);
                }
            }
        }

        receiveDestroy(data,net:NetWork.Net) {
            var id = data[1];

            if(net.destroy_callback) {
                net.destroy_callback(id);
            }
        }

        receiveHitPoints(data,net:NetWork.Net) {
            var maxHp = data[1];

            if(net.hp_callback) {
                net.hp_callback(maxHp);
            }
        }

        receiveBlink(data,net:NetWork.Net) {
            var id = data[1];

            if(net.blink_callback) {
                net.blink_callback(id);
            }
        }
        receivePVP(data,net:NetWork.Net){
            var pvp = data[1];
            if(net.pvp_callback){
                net.pvp_callback(pvp);
            }
        }
    }
}

