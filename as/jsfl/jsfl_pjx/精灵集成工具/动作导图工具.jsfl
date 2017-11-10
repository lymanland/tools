var defaultFrameInterval = 2;
var defaultLineThickness = 4;
var picQuality = 70;
var toolType = "动作";
var fileMask = "*-" + toolType + "*.fla";
var errRecord = [];
var fileURL;
var saveURL;
var saveURLNew;

//fileURL = "file:///C|/Documents%20and%20Settings/qianjiuquan/%e6%a1%8c%e9%9d%a2/effect";
fileURL = fl.browseForFolderURL("请选择打开文件夹路径", "select file");
if(fileURL != null) {
	saveURLNew = fileURL + "/converted";
	saveURL = saveURLNew + "/tmp";
	FLfile.createFolder(saveURLNew);
	FLfile.createFolder(saveURL);
	var fileList = FLfile.listFolder(fileURL + "/" + fileMask, "files");
	handleBatchFile(fileList);
	printErrRecord();
  //删除临时文件
  FLfile.remove(saveURL);
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
		var containConfigTxt = false;
		for each(var instance in doc.selection) {
			if(instance.name != "txt") {
				continue;
			}
			doc.selectNone();
			doc.selection = [instance];
			var config = instance.getTextString();
			//alert(config);
			doc.deleteSelection();
			doc.selectNone();
			if(config.indexOf("jg=") != -1) {
				var configFrameInterval = parseInt(config.replace("jg=", ""));
				exportPngWithStaticInterval(finalDoc, configFrameInterval, id, i);
				containConfigTxt = true;
				break;
			} else {
				var intervalArr = config.split(",");
				exportPngWithConfigInterval(finalDoc, intervalArr, id, i);
				containConfigTxt = true;
				break;
			}
		}
		if(!containConfigTxt) {
			exportPngWithStaticInterval(finalDoc, defaultFrameInterval, id, i);
		}
	}
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
	fl.closeDocument(finalDoc, false);
	fl.closeDocument(doc, false);
  
  
  //搬迁，减少fla文件大小
  finalDoc2 = fl.createDocument();
  finalDoc = fl.openDocument(saveURL + "/action" + id + ".fla");
  fl.setActiveWindow(finalDoc);
  var itemIndex = finalDoc.library.findItemIndex(actionName); 
  var theItem = finalDoc.library.items[itemIndex]; 
  fl.getDocumentDOM().addItem({x:0,y:0}, theItem);
  finalDoc.selectNone();
  finalDoc.selectAll();
  finalDoc.clipCopy();
  fl.setActiveWindow(finalDoc2);
  finalDoc2.clipPaste();
  finalDoc2.deleteSelection();
  fl.saveDocument(finalDoc2, saveURLNew + "/action" + id + ".fla");
  finalDoc2.publish();
  fl.closeDocument(finalDoc, false);
  fl.closeDocument(finalDoc2, false);
  
}

function exportPngWithConfigInterval(finalDoc, intervalArr, id, frameIndex) {
	var doc = fl.getDocumentDOM();
	var newDoc = fl.createDocument();
	var picInfos = [];
	var picUrls = [];
	var frameCount = doc.getTimeline().frameCount;
	for(var i = 0; i < intervalArr.length; i++) {//导出图片
		//清理newDoc的舞台
		fl.setActiveWindow(newDoc);
		newDoc.selectNone();
		newDoc.selectAll();
		if(newDoc.selection.length > 0) {
			newDoc.deleteSelection();
		}
		//从doc中拷贝
		fl.setActiveWindow(doc);
		doc.getTimeline().currentFrame = parseInt(intervalArr[i]) - 1;
		doc.selectNone();
		doc.selectAll();
		if(doc.selection.length > 0) {
			doc.clipCopy();
			fl.setActiveWindow(newDoc);
			newDoc.clipPaste(true);
			newDoc.selectNone();
			newDoc.selectAll();
			newDoc.group();
			newDoc.selectNone();
			newDoc.selectAll();
			var target = newDoc.selection[0];
			var orgX = target.x;
			var orgY = target.y;
			target.x = parseFloat(target.width / 2 + defaultLineThickness); 
			target.y = parseFloat(target.height / 2 + defaultLineThickness);
			newDoc.width = Math.round(target.width + 2 * defaultLineThickness);
			newDoc.height = Math.round(target.height + 2 * defaultLineThickness);
			var itemName = "frame" + frameIndex + "_" + intervalArr[i] + ".png";
			var picURL = saveURL + "/" + itemName;
			newDoc.exportPNG(picURL, false, true);
			picUrls.push(picURL);
			picInfos.push([itemName, orgX, orgY, intervalArr[i]]);
		}
	}
	fl.closeDocument(newDoc, false);
	fl.setActiveWindow(finalDoc);
	var lib = finalDoc.library;
	if(!finalDoc.library.itemExists("pic")) {
		finalDoc.library.newFolder("pic");
	}
	for each(var url in picUrls) {//导入图片,之后删除
		newDoc.importFile(url);
		FLfile.remove(url);
	}
	//导入后图片都在舞台上，清除掉
	finalDoc.selectAll();
	if(finalDoc.selection.length > 0) {
		finalDoc.deleteSelection();
	}
	//创键特效原件
	var picItemName = "frame/frame" + frameIndex;
	lib.addNewItem("movie clip", picItemName);
	lib.selectItem(picItemName, true);
	lib.editItem(picItemName);
	var tl = finalDoc.getTimeline();
	tl.insertFrames(frameCount - 1, true);
	for each(var picInfo in picInfos) {//按照原来的坐标和帧放入图片
		var itmeName = picInfo[0];
		var orgX = parseFloat(picInfo[1]);
		var orgY = parseFloat(picInfo[2]);
		var index = parseInt(picInfo[3]) - 1;
		if(index != 0) {
			tl.convertToBlankKeyframes(index, index);
		}
		tl.currentFrame = index;
		lib.addItemToDocument({x:orgX, y:orgY}, itmeName);
	}
	//调整图片质量，顺便放好在pic文件夹中
	for each(var item in lib.items) {
		if(item.itemType == "bitmap") {
			var itemName = item.name;
			lib.selectItem(itemName, true);
			var frameIndex = itemName.indexOf("frame");
			if(frameIndex >= 0) {
				lib.setItemProperty('linkageExportForAS', true);
				lib.setItemProperty('linkageExportInFirstFrame', true);
				var exportName = 'action_' + id + '_' + itemName.substring(frameIndex, itemName.indexOf("."));
				lib.setItemProperty('linkageClassName', exportName);
			}
			lib.setItemProperty('allowSmoothing', false);
			lib.setItemProperty('compressionType', 'photo');
			lib.setItemProperty('useImportedJPEGQuality', false);
			lib.setItemProperty('quality', picQuality);
			lib.moveToFolder("pic", item.name, true);
		}
	}
	finalDoc.exitEditMode();
	fl.setActiveWindow(doc);
	doc.exitEditMode();
	finalDoc.width = 960;
	finalDoc.height = 560;
}

function exportPngWithStaticInterval(finalDoc, interval, id, frameIndex) {
	var doc = fl.getDocumentDOM();
	var configInterval = [];
	var frameCount = doc.getTimeline().frameCount;
	for(var i = 1; i <= frameCount; i += interval) {
		configInterval.push(i);
	}
	exportPngWithConfigInterval(finalDoc, configInterval, id, frameIndex);
}

function printErrRecord() {
	var loggerName = saveURLNew + "/集成日志.txt";
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