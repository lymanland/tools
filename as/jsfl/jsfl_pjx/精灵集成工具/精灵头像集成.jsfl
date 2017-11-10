const DEFAULT_FILE_RUL = "file:///C|/Documents%20and%20Settings/qianjiuquan/%e6%a1%8c%e9%9d%a2/%e7%b2%be%e7%81%b5%e5%9b%be%e6%a0%87";
const DEFAULT_SAVE_RUL = "file:///E|/vstsworkspace/projectX/source/assets/peticon";
var fileURL = fl.browseForFolderURL("open", "selest file");
//var saveURL = fl.browseForFolderURL("open", "SaveURL");
var saveURL = fileURL + "/peticon";
FLfile.createFolder(saveURL);
var errRecord = "";
if(fileURL == null) {
	fileURL = DEFAULT_FILE_RUL;
}
if(saveURL == null) {
	saveURL = DEFAULT_SAVE_RUL;
}

//var folderList = FLfile.listFolder(fileURL, "directories");
var fileMask = "*-*.fla";
var fileList = FLfile.listFolder(fileURL + "/" + fileMask, "files") ;
for each(var file in fileList) {
	var id = getIdFromFileName(file);
	var url = fileURL + "/" + file;
	var doc = fl.openDocument(url);
	doc.selectNone();
	doc.selectAll();
	doc.clipCopy();
	var newDoc = fl.createDocument();
	fl.setActiveWindow(newDoc);
	newDoc.clipPaste(true);
	fl.closeDocument(doc, false);
	newDoc.selectAll();
	handlePetIcon(newDoc, getSymbolByName(newDoc, "a"), "_L");
	handlePetIcon(newDoc, getSymbolByName(newDoc, "b"), "_F");
	handlePetIcon(newDoc, getSymbolByName(newDoc, "c"), "_S");
	handlePetIcon(newDoc, getSymbolByName(newDoc, "d"), "_A");
	cleanLibrary(newDoc);
	newDoc.selectNone();
	newDoc.selectAll();
	newDoc.deleteSelection();
	fl.saveDocument(newDoc, saveURL + "/peticon" + id + ".fla");
	newDoc.publish();
	fl.closeDocument(newDoc, false);
}
if(errRecord == "") {
	fl.trace("没有遗漏，厉害");
} else {
	fl.trace(errRecord);
}

function getSymbolByName(doc, nm) {
	for each(var sym in doc.selection) {
		if(sym.name == nm) {
			return sym;
		}
	}
	return null;
}

function getIdFromFileName(fileName) {
	var temp = fileName.replace(".fla", "");
	var arr = temp.split("-");
	return parseInt(arr[0]);
}

function handlePetIcon(doc, symInstance, postFix) {
	if(symInstance == null) {
		errRocord += "缺id【" + id + "】的【" + postFix + "】\n"
		return;
	}
	var lib = doc.library;
	if(lib.selectItem(symInstance.libraryItem.name, true)) {
		lib.setItemProperty('linkageExportForAS', true);
		lib.setItemProperty('linkageExportForRS', false);
		lib.setItemProperty('linkageExportInFirstFrame', true);
		lib.setItemProperty('linkageClassName', "mmo.pet.peticon" + id + postFix);
		lib.renameItem("精灵头像" + id + postFix);
	}
}

function cleanLibrary(doc) {
	var lib = doc.library;
	lib.newFolder("dev");
	lib.newFolder("art");
	var allItem = lib.items;
	for(var i = 0; i < allItem.length; i++) {
		var item = allItem[i];
		if(item.itemType == 'folder') {
			continue;
		}
		if(item.linkageExportForAS == true) {
			lib.moveToFolder("dev", item.name, false);
		} else{
			lib.moveToFolder("art", item.name, false);
		}
	}
}

	