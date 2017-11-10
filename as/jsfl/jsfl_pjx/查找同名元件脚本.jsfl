var fileUrl1 = fl.browseForFileURL("open", "选择对比文件1"); 
var doc1 = fl.openDocument(fileUrl1);

var fileUrl2 = fl.browseForFileURL("open", "选择对比文件2"); 
var doc2 = fl.openDocument(fileUrl2);

var lib1 = doc1.library;
var lib2 = doc2.library;

var items1 = lib1.items;
var items2 = lib2.items;

var nameMap = [];
for each (var item1 in items1) {
	nameMap.push(item1.name);
}

for each (var item2 in items2) {
	if (nameMap.indexOf(item2.name) != -1) {
		fl.trace("具有相同名字的元件名：" + item2.name);
	}
}

fl.trace("检查完毕");