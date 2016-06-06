/**
 *
 * @author 
 *
 */
module NetWork{
    export class Net extends egret.EventDispatcher{
        webSocket:egret.WebSocket = new egret.WebSocket();
        netPackageHandler:NetPackageHandler=new NetPackageHandler();
        public static NetSrcName: string = "Net";
        public constructor() {
            super();
        }
        Init(): void {
            Main.debugView.addLog("");
            // this.webSocket.addEventListener( egret.ProgressEvent.SOCKET_DATA, this.onReceiveMessage, this );
            // this.webSocket.addEventListener( egret.Event.CONNECT, this.onSocketOpen, this );
            // this.webSocket.connect("localhost", 9003);
            //this.webSocket.connect("119.29.66.119", 8001);
        }
        //网络包的设定
        //交互流程，
        //服务端完成对象的创建
        //服务器要计算碰撞和更新位置
        //接收客户端发送的触摸点
        onSocketOpen():void {
            //var cmd = "Hello Egret WebSocket";
            //console.log("连接成功，发送数据(Text)：" + cmd);
            //webSocket.writeUTF(cmd);
            //webSocket.flush();
            // this.webSocket.type = egret.WebSocket.TYPE_BINARY;
            // var bytes:egret.ByteArray=new egret.ByteArray();
            // bytes.writeUTFBytes(data);
            // this.webSocket.writeBytes(bytes);
            // this.webSocket.flush();
            //this.netPackageHandler.sendByteArray(this.webSocket,NetPackageHandler.PosDataID,100,300);
        }
        onReceiveMessage(e:egret.Event):void {
            //if(this.webSocket.type == egret.WebSocket.TYPE_STRING) {
                //var msg = this.webSocket.readUTF();
                //console.log("收到数据：" + msg);
                //var user = JSON.parse(msg);
                //this.userData =new Array();
                //this.userData.push(user);
                //console.log("UData:"+this.userData[0].password);
            //} else {
                // var bmsg: egret.ByteArray = new egret.ByteArray;
                // this.webSocket.readBytes(bmsg,0,0);
                // //读字符串 ->JSON 解析数据
                // var str:string = bmsg.readUTFBytes(bmsg.bytesAvailable);
                // Main.debugView.addLog("读str "+str,Net.NetSrcName);
                // var user:ModelVO.UserVO = JSON.parse(str);
                // Main.debugView.addLog("Get Object To String:"+user.ToString(),Net.NetSrcName);
                // //读int
                //var num:number=bmsg.readUnsignedShort();
                //Main.debugView.addLog("读Num"+num);
                //this.Readbytes(bmsg);
                //读bytes
                //console.log("收到数据长度"+bmsg.length);
                //var bit: number = bmsg.readByte();
                //console.log("读一个byte "+bit+" 转化为字符:"+ String.fromCharCode(bit));
                //console.log("读取后位置" + bmsg.bytesAvailable);
                //while(bmsg.bytesAvailable>0)
                //{
                //    var bit: number = bmsg.readByte();
                //    console.log("读一个byte "+bit+"  读取后位置" + bmsg.bytesAvailable);
                //    console.log();
                //}
            }
        }
    //     Readbytes(bytes:egret.ByteArray):void{
    //         var bytesArr: Array<number> = new Array<number>();
    //         for(var i: number = 0;i < bytes.length;i++){
    //             var byte: number = bytes.readByte();
    //             //Main.debugView.addLog("bytes[" + i + "]" + byte,Net.NetSrcName);
    //             bytesArr.push(byte);
    //         }
    //         this.BinaryToInt(bytesArr);
    //     }
    //     SendMessage(): void { 
    //         //var bytes: egret.ByteArray = new egret.ByteArray();
    //         //bytes.writeByte(2);
    //         //this.webSocket.writeBytes(bytes);
    //         //this.webSocket.flush();
    //     }
    //     BinaryToInt(bytes:Array<number>){
    //         var intNum: number = (bytes[0] & 0xFF) << 24 | (bytes[1] & 0xFF) << 16 | (bytes[2] & 0xFF) << 8 | (bytes[3] & 0xFF);
    //         Main.debugView.addLog("After cal:"+intNum,Net.NetSrcName);
    //     }
        
    //     ToUTF8Array(str) {
    //     var utf8 = [];
    //     for (var i=0; i < str.length; i++) {
    //         var charcode = str.charCodeAt(i);
    //         if (charcode < 0x80) utf8.push(charcode);
    //         else if (charcode < 0x800) {
    //             utf8.push(0xc0 | (charcode >> 6),
    //                 0x80 | (charcode & 0x3f));
    //         }
    //         else if (charcode < 0xd800 || charcode >= 0xe000) {
    //             utf8.push(0xe0 | (charcode >> 12),
    //                 0x80 | ((charcode>>6) & 0x3f),
    //                 0x80 | (charcode & 0x3f));
    //         }
    //         // surrogate pair
    //         else {
    //             i++;
    //             // UTF-16 encodes 0x10000-0x10FFFF by
    //             // subtracting 0x10000 and splitting the
    //             // 20 bits of 0x0-0xFFFFF into two halves
    //             charcode = 0x10000 + (((charcode & 0x3ff)<<10)
    //             | (str.charCodeAt(i) & 0x3ff));
    //             utf8.push(0xf0 | (charcode >>18),
    //                 0x80 | ((charcode>>12) & 0x3f),
    //                 0x80 | ((charcode>>6) & 0x3f),
    //                 0x80 | (charcode & 0x3f));
    //         }
    //         }
    //         return utf8;
    //     }
    // }

    //PHP
    //        var urlloader:egret.URLLoader;
    //        urlloader = new egret.URLLoader();
    //        var urlReq:egret.URLRequest = new egret.URLRequest();
    //        urlReq.url = " http://localhost/demo/s.php";
    //        urlloader.dataFormat = egret.URLLoaderDataFormat.VARIABLES;
    //        urlReq.method = egret.URLRequestMethod.POST;
    //        urlReq.data = new egret.URLVariables("test=ok");
    //        urlloader.load(urlReq);
    //        urlloader.addEventListener(egret.Event.COMPLETE,onComplete,this);
    //        function onComplete(event:egret.Event):void
    //        {
    //            console.log("Receive");
    //            var loader:egret.URLLoader = <egret.URLLoader> event.target;
    //            var data:egret.URLVariables = loader.data;
    //            console.log( data.toString() );
    //            console.log( urlloader.data );
    //        }
}
    