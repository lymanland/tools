// 元件分放文件夹，有导出类的放到dev没有的放到art
var lib = fl.getDocumentDOM().library;
lib.newFolder("dev");
lib.newFolder("art");
var itemArr = lib.items;
for(var i in itemArr) {
	var item = itemArr[i];
	if(item.itemType == "folder") {
		continue;
	}
	if(item.linkageExportForAS) {
		lib.moveToFolder("dev", item.name);
	} else {
		lib.moveToFolder("art", item.name);
	}
}