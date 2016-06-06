/**
 *
 * @author 
 *
 */
class NetPackageHandler extends egret.EventDispatcher{
    public static PosDataID:number=10001;
	public constructor() {
        super();
	}
    handlePackage(bmsg:egret.ByteArray):void{
        //ID
        var id:number = bmsg.readUnsignedShort();
        //bmsg.position = bmsg.length-16;
        //console.log("id "+id );
//        NetPackageHandler.funVector.forEach(function (fun) {
//            var funId = fun.GetId();
//            if(id==funId)
//            {
//                fun.Read(bmsg);
//            }
//        });
    }
//    sendByteArray(webSocket:egret.WebSocket,id:number,xPos:number,yPos:number){
//        NetPackageHandler.funVector.forEach(function (fun) {
//            var funId = fun.GetId();
//            if(id==funId)
//            {
//               var bytes:egret.ByteArray = fun.GetSendPackage(xPos,yPos);
//               console.log("bytes"+bytes.toString());
//               webSocket.writeBytes(bytes);
//               webSocket.flush();
//            }
//        });
//    }
}