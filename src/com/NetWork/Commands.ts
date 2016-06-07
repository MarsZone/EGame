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
            // this.CMDHashMap.put(Types.Messages.SPAWN, this.receiveSpawn);
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
        receiveWelcome(data) {
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
            
            Main.debugView.addLog("Calling receiveWelcome");
        }
    }
}

