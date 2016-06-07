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
        
        public constructor() {
            super();
            this.commands = new NetWork.Commands;
        }
        connection;
        commands;
        Init(): void {
            var self = this;
            this.connection = io('http://127.0.0.1:8000/');
            this.connection.on('news', function (data) {
                Main.debugView.addLog("receive message: " + data);
            });
            this.connection.on('connection', function() {
                Main.debugView.addLog("Connected to server");
            });

            this.connection.on('message', function(e) {
                if(e === 'go') {
                    //Starting client/server handshake
                    var user=new Model.User();
                    user.setData("Demo","123456");
                    Model.ModelBase.instance.user = user;
                    self.sendMessage([Types.Messages.LOGIN,user.name,user.pw]);
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
            this.connection.on('error', function(e) {
                Main.debugView.addLog(""+e);
            });

            this.connection.on('disconnect', function() {
                Main.debugView.addLog("Connection closed");
            });
            //this.socket.emit("message", msg);
            // this.webSocket.addEventListener( egret.ProgressEvent.SOCKET_DATA, this.onReceiveMessage, this );
            // this.webSocket.addEventListener( egret.Event.CONNECT, this.onSocketOpen, this );
            // this.webSocket.connect("localhost", 9003);
            //this.webSocket.connect("119.29.66.119", 8001);
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
              Main.debugView.addLog("data: " + message);
              
              if(data instanceof Array) {
                    if(data[0] instanceof Array) {
                        // Multiple actions received
                        this.receiveActionBatch(data);
                    } else {
                        // Only one action received
                        this.receiveAction(data);
                    }
                }
            }
        }
        receiveAction(data) {
            var action = data[0];
            if(this.handlers[action] && _.isFunction(this.handlers[action])) {
                this.handlers[action].call(this, data);
            }
            else {
                Main.debugView.addLog("Unknown action : " + action);
            }
        }

        receiveActionBatch(actions) {
            var self = this;

            _.each(actions, function(action) {
                self.receiveAction(action);
            });
        }
        sendMessage(json) {
            var data;
            if(this.connection.connected === true) {
               data = JSON.stringify(json);
               this.connection.send(data);
            }
        }
    }
}
    