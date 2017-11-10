var defaultFrameInterval = 2;
var defaultLineThickness = 4;
var picQuality = 70;
var toolType = "动作";
var fileMask = "*-" + toolType + "*.fla";
var errRecord = [];
var fileURL;
var saveURL;
var saveURLNew;

fileURL = fl.browseForFolderURL("请选择打开文件夹路径", "select file");
if(fileURL != null) {
	saveURL = fileURL + "/converted";
	saveURLNew = saveURL + "/new";
	FLfile.createFolder(saveURL);
	//FLfile.createFolder(saveURLNew);
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
	var id = tmp[2].replace(".fla", "");
	var doc = fl.openDocument(fileURL +　"/" + file);
	var frameCount = doc.getTimeline().frameCount;
	var finalDoc = fl.createDocument();
	fl.setActiveWindow(doc);
	doc.library.newFolder("art");
	doc.library.newFolder("frame");
	for(var i = 0; i < frameCount; i++) {
		if(doc.getTimeline().currentFrame != i) {
			doc.getTimeline().currentFrame = i;
		}
		doc.selectNone();
		doc.selectAll();
		if(doc.selection.length > 1) {
			errRecord.push("文件[" + file + "]第" + i + "帧的舞台上的原件数大于1，请检查");
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
		doc.selectNone();
		doc.selectAll();
		for each(var instance in doc.selection) {
			moveToFrame(doc, instance, i);
		}
	}
	doc.selectAll();
	doc.deleteSelection();
	var items = doc.library.items;
	for(var i = 0; i < items.length; i++) {
		var item = items[i];
		if(item.name.indexOf("frame/frame") != -1) {
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
	doc.selectAll();
	doc.clipCopy();
  	fl.setActiveWindow(finalDoc);
	finalDoc.clipPaste();
	finalDoc.deleteSelection();
	
	var lib = finalDoc.library;
  var actionName = "dev/action" + id;
	lib.newFolder("dev");
	lib.addNewItem("movie clip", actionName);
	lib.selectItem(actionName, true);
	lib.editItem(actionName);
	lib.setItemProperty('linkageExportForAS', true);
	lib.setItemProperty('linkageExportInFirstFrame', true);
	lib.setItemProperty('linkageClassName', 'mmo.battle.action.Action' + id)
	for(i = 0; i < frameCount; i++) {
		var tl = finalDoc.getTimeline();
		tl.insertBlankKeyframe();
		tl.currentFrame = i;
		lib.selectItem("frame/frame" + i, true);
		lib.addItemToDocument({x:0, y:0});
		finalDoc.selectNone();
		finalDoc.selectAll();
		finalDoc.selection[0].x = 0;
		finalDoc.selection[0].y = 0;
		finalDoc.selection[0].name = "mc";
	}
	fl.saveDocument(finalDoc, saveURL + "/action" + id + ".fla");
	finalDoc.publish();
	fl.closeDocument(finalDoc, false);
	fl.closeDocument(doc, false);
}

function moveToFrame(doc, instance, i)
{
  var item = instance.libraryItem;
  doc.library.selectItem(item.name);
  doc.library.renameItem("frame" + i);
  doc.library.moveToFolder("frame", item.name);
}

function printErrRecord() {
	var loggerName = saveURL + "/集成日志.txt";
	if(errRecord.length == 0) {
		var message = "\r\n--------------------- 无错误信息 -------------------------";
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