/**
 *
 * @author 
 *
 */

module NetWork{
    export class Net extends egret.EventDispatcher{
        //webSocket:egret.WebSocket = new egret.WebSocket();
        //netPackageHandler:NetPackageHandler=new NetPackageHandler();
        public static NetSrcName: string = "Net";
        public entityFactory:Tools.EntityFactory;
        public constructor() {
            super();
            this.entityFactory=new Tools.EntityFactory();
            this.commands = new NetWork.Commands();
        }
        connection;
        commands:NetWork.Commands;
        fail_callback=null;
        spawn_callback = null;
        movement_callback = null;
        connect(host,port): void {
            var self = this;
            Main.debugView.log("Connect:"+Main.host,"Net",true);
            try {
                this.connection =  io(Main.host,{forceNew: true, reconnection: false});
            } catch (error) {
                Main.debugView.log("Connect Error:"+error,"Net",true);
            }
            //self.connection =  io.connect(Main.host);
            
            this.connection.on('news', function (data) {
                Main.debugView.log("receive message: " + data,Net.NetSrcName);
            });
            self.connection.on('connection', function() {
                Main.debugView.log("Connected to server",Net.NetSrcName);
            });

            self.connection.on('message', function(e) {
                if(e === 'go') {
                    //Starting client/server handshake
                    if(self.connected_callback) {
                            self.connected_callback();
                    }
                    return;
                }
                if(e === 'timeout') {
                    return;
                }
                if(e === 'invalidlogin' || e === 'userexists' || e === 'loggedin' || e === 'invalidusername'){
                    return;
                }

                self.receiveMessage(e);
            });
            self.connection.on('error', function(e) {
                Main.debugView.log(""+e,Net.NetSrcName,true);
            });

            self.connection.on('disconnect', function() {
                Main.debugView.log("Connection closed",Net.NetSrcName,true);
            });
            self.enable();
        }
        isListening:boolean=true;
        enable():void {
            this.isListening = true;
        }

        disable():void {
            this.isListening = false;
        }
        receiveMessage(message):void {
            var data, action;
            if(this.isListening) {
              data = JSON.parse(message);

              if(data instanceof Array) {
                    if(data[0] instanceof Array) {
                        // Multiple actions received
                        this.receiveActionBatch(data);
                    } else {
                        // Only one action received
                        this.receiveAction(data);
                    }
                }
                Main.debugView.log("data: " + message,Net.NetSrcName);
            }
        }
        receiveAction(data) {
            var action = data[0];
            if(this.commands.CommandMap.get(action) &&typeof(this.commands.CommandMap.get(action))=="function")
            {
                var fun = this.commands.CommandMap.get(action);
                new fun(data,this);
                //Main.debugView.log("Handle Action : " + action,Net.NetSrcName); 
            }else{
                Main.debugView.log("Unknown action : " + action,Net.NetSrcName); 
            }
        }

        receiveActionBatch(actions) {
            var self = this;
            for(var action of actions)
            {
                self.receiveAction(action);
            }
        }
        dispatched_callback;
        onDispatched(callback) {
            this.dispatched_callback = callback;
        }

        spawn_character_callback;
        onSpawnCharacter(callback) {
            this.spawn_character_callback = callback;
        }

        spawn_item_callback;
        onSpawnItem(callback) {
            this.spawn_item_callback = callback;
        }

        spawn_chest_callback;
        onSpawnChest(callback) {
            this.spawn_chest_callback = callback;
        }

        despawn_callback;
        onDespawnEntity(callback) {
            this.despawn_callback = callback;
        }

        move_callback;
        onEntityMove(callback) {
            this.move_callback = callback;
        }

        attack_callback;
        onEntityAttack(callback) {
            this.attack_callback = callback;
        }

        health_callback;
        onPlayerChangeHealth(callback) {
            this.health_callback = callback;
        }

        equip_callback;
        onPlayerEquipItem(callback) {
            this.equip_callback = callback;
        }

        lootmove_callback;
        onPlayerMoveToItem(callback) {
            this.lootmove_callback = callback;
        }

        teleport_callback;
        onPlayerTeleport(callback) {
            this.teleport_callback = callback;
        }

        chat_callback;
        onChatMessage(callback) {
            this.chat_callback = callback;
        }

        drop_callback;
        onDropItem(callback) {
            this.drop_callback = callback;
        }

        dmg_callback;
        onPlayerDamageMob(callback) {
            this.dmg_callback = callback;
        }

        kill_callback;
        onPlayerKillMob(callback) {
            this.kill_callback = callback;
        }

        population_callback;
        onPopulationChange(callback) {
            this.population_callback = callback;
        }

        destroy_callback;
        onEntityDestroy(callback) {
            this.destroy_callback = callback;
        }

        hp_callback;
        onPlayerChangeMaxHitPoints(callback) {
            this.hp_callback = callback;
        }

        blink_callback;
        onItemBlink(callback) {
            this.blink_callback = callback;
        }

        pvp_callback;
        onPVPChange(callback){
            this.pvp_callback = callback;
        }
        
        guildmemberconnect_callback;
		onMemberConnect(callback) {
			this.guildmemberconnect_callback = callback;
		}
		
        guildmemberdisconnect_callback;
		onMemberDisconnect(callback) {
			this.guildmemberdisconnect_callback = callback;
		}
		
        guildonlinemembers_callback;
		onReceiveGuildMembers(callback) {
			this.guildonlinemembers_callback = callback;
		}
		
        guildpopulation_callback;
		onGuildPopulation(callback) {
			this.guildpopulation_callback = callback;
		}

        sendMessage(json) {
            var data;
            if(this.connection.connected === true) {
               data = JSON.stringify(json);
               Main.debugView.log("Send Message:"+data,"Net");
               this.connection.send(data);
            }
        }

        sendLogin() {
            var user=new Model.User();
            user.setData("mars","123456");
            Model.ModelBase.instance.user = user;
            this.sendMessage([Types.Messages.LOGIN,user.name,user.pw]);
        }
        connected_callback = null;
        onConnected(callback) {
            this.connected_callback = callback;
        }
        disconnected_callback;
        onDisconnected(callback) {
            this.disconnected_callback = callback;
        }
        list_callback;
        onEntityList(callback) {
            this.list_callback = callback;
        }
        welcome_callback;
        onWelcome(callback) {
            this.welcome_callback = callback;
        }

        sendMove(x, y) {
            this.sendMessage([Types.Messages.MOVE,
                              x,
                              y]);
        }

        sendLootMove(item, x, y) {
            this.sendMessage([Types.Messages.LOOTMOVE,
                              x,
                              y,
                              item.id]);
        }

        sendAggro(mob) {
            this.sendMessage([Types.Messages.AGGRO,
                              mob.id]);
        }

        sendAttack(mob) {
            this.sendMessage([Types.Messages.ATTACK,
                              mob.id]);
        }

        sendHit(mob) {
            this.sendMessage([Types.Messages.HIT,
                              mob.id]);
        }

        sendHurt(mob) {
            this.sendMessage([Types.Messages.HURT,
                              mob.id]);
        }

        sendChat(text) {
            this.sendMessage([Types.Messages.CHAT,
                              text]);
        }

        sendLoot(item) {
            this.sendMessage([Types.Messages.LOOT,
                              item.id]);
        }

        sendTeleport(x, y) {
            this.sendMessage([Types.Messages.TELEPORT,
                              x,
                              y]);
        }

        sendZone() {
            this.sendMessage([Types.Messages.ZONE]);
        }

        sendOpen(chest) {
            this.sendMessage([Types.Messages.OPEN,
                              chest.id]);
        }

        sendCheck(id) {
            this.sendMessage([Types.Messages.CHECK,
                              id]);
        }
        
        sendWho(ids) {
            ids.unshift(Types.Messages.WHO);
            this.sendMessage(ids);
        }
        
    }
}
    