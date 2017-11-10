var doc = fl.getDocumentDOM();
var lib = doc.library;
var myItems = lib.items;
var asArr = [];
var n;
clearUnuse();
function clearUnuse(){
	//把所有有绑定类的放到舞台上
	n = 0;
	for(var i = 0;i < myItems.length;i++){
		if(myItems[i].linkageClassName && myItems[i].linkageExportForAS){
			n++;
			asArr.push(myItems[i]);
			//fl.trace(myItems[i].name + " (" + myItems[i].itemType + ")      linkName:" + myItems[i].linkageClassName);
			lib.addItemToDocument({x:0, y:0}, myItems[i].name);
		}
	}
}