var defaultFrameInterval = 2;
var defaultLineThickness = 4;
var picQuality = 50;
var fileMask = "*-*.fla";
var errRecord = [];
var fileURL;
var saveURL;
var saveURLNew;

fileURL = fl.browseForFolderURL("请选择打开文件夹路径", "select file");
if(fileURL != null) {
	saveURL = fileURL + "/converted";
	saveURLNew = saveURL + "/new";
	FLfile.createFolder(saveURL);
	FLfile.createFolder(saveURLNew);
	var fileList = FLfile.listFolder(fileURL + "/" + fileMask, "files");
	handleBatchFile(fileList);
	printErrRecord();
}

function handleBatchFile(fileList) {
	for each(var file in fileList) {
		handleSingleFile(file);
	}
}

function handleSingleFile(file) {
	var tmp = file.split("-");
	var id = tmp[1].replace(".fla", "");
	var doc = fl.openDocument(fileURL +　"/" + file);
	doc.library.newFolder("art");
	doc.library.newFolder("dev");
	doc.selectNone();
	doc.selectAll();
	if(doc.selection.length > 1) {
		errRecord.push("文件[" + file + "]舞台上的原件数大于1，请检查");
		return;
	}
	doc.enterEditMode("inPlace");
	//解除所有层的锁定和不可见
	for(var idx = 0; idx < doc.getTimeline().layerCount; idx++) {
		doc.getTimeline().setSelectedLayers(idx, true);
		doc.getTimeline().setLayerProperty("visible", true);
		doc.getTimeline().setLayerProperty("locked", false);
	}
	doc.selectNone();
	doc.selectAll();
  	//删除文本
	for each(var instance in doc.selection) {
		if(instance.name != "txt") {
			continue;
		}
		doc.selectNone();
		doc.selection = [instance];
		doc.deleteSelection();
		doc.selectNone();
		break;
	}
	doc.exitEditMode();
  
  //处理特效元件
	doc.selectNone();
	doc.selectAll();
	var instance = doc.selection[0];
	var item = instance.libraryItem;
	doc.library.selectItem(item.name);
  	doc.library.renameItem("Buffer" + id);
  	doc.library.selectItem(item.name, true);
	doc.library.setItemProperty('linkageExportForAS', true);
	doc.library.setItemProperty('linkageExportInFirstFrame', true);
	doc.library.setItemProperty('linkageClassName', 'mmo.battle.buffer.Buffer' + id);
  	doc.library.moveToFolder("dev", item.name);
	
  	doc.selectAll();
	doc.deleteSelection();
	var items = doc.library.items;
	for(var i = 0; i < items.length; i++) {
		var item = items[i];
		if(item.name.indexOf("dev/") != -1) {
			doc.library.addItemToDocument({x:0, y:0}, item.name);
		}
    	else
    	{
      		if(item.itemType != "folder")
      		{
        		doc.library.moveToFolder("art", item.name);
      		}
   		}
	}
  
  	doc.selectNone();
  	doc.selectAll();
  	doc.clipCopy();
  	finalDoc = fl.createDocument();
  	fl.setActiveWindow(finalDoc);
  	finalDoc.clipPaste();
  	finalDoc.deleteSelection();
  	fl.saveDocument(finalDoc, saveURL + "/buffer" + id + ".fla");
  	finalDoc.publish();
  	fl.closeDocument(finalDoc, false);
  	fl.closeDocument(doc, false);
}

function printErrRecord() {
	var loggerName = saveURL + "/集成日志.txt";
	if(errRecord.length == 0) {
		var message = "--------------------- 无错误信息 -------------------------";
		fl.trace(message);
		if(FLfile.exists(loggerName)) {
			FLfile.write(loggerName, message, "append");
		} else {
			FLfile.write(loggerName, message + "\r\n");
		}
		return;
	}
	fl.trace("\n--------------------- 错误信息列表 -------------------------");
	for(var i = 0; i < errRecord.length; i++) {
		fl.trace(errRecord[i]);
		if(FLfile.exists(loggerName)) {
			FLfile.write(loggerName, errRecord[i] + "\r\n", "append");
		} else {
			FLfile.write(loggerName, errRecord[i] + "\r\n");
		}
	}
	fl.trace("--------------------- 错误信息列表 表尾-------------------------\n");
}