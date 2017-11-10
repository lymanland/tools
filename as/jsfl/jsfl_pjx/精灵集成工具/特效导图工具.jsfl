var toolType = "特效";
var defaultFrameInterval = 2;
var defaultLineThickness = 4;
var picQuality = 50;
var fileMask = "*-" + toolType + "-*.fla";
var errRecord = [];
var fileURL;
var saveURL;
var saveURLNew;

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
			exportPngWithStaticInterval(configFrameInterval, id);
			return;
		} else {
			var intervalArr = config.split(",");
			exportPngWithConfigInterval(intervalArr, id);
			return;
		}
	}
	exportPngWithStaticInterval(defaultFrameInterval, id);
}

function exportPngWithConfigInterval(intervalArr, id) {
	var doc = fl.getDocumentDOM();
	var frameCount = doc.getTimeline().frameCount;
	var picInfos = [];
	var picUrls = [];
	var newDoc = fl.createDocument();
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
			var itemName = "temp" + intervalArr[i] + ".png";
			var picURL = saveURL + "/" + itemName;
			newDoc.exportPNG(picURL, false, true);
			picUrls.push(picURL);
			picInfos.push([itemName, orgX, orgY, intervalArr[i]]);
		}
	}
	//fl.closeDocument(newDoc, false);
	finalDoc = fl.createDocument();//这里再新建一个doc是为了fla中没有多余的原件
	fl.setActiveWindow(finalDoc);
	var lib = finalDoc.library;
	lib.newFolder("pic");
	for each(var url in picUrls) {//导入图片,之后删除
		finalDoc.importFile(url);
		FLfile.remove(url);
	}
	//导入后图片都在舞台上，清除掉
	finalDoc.selectNone();
	finalDoc.selectAll();
	if(finalDoc.selection.length > 0) {
		finalDoc.deleteSelection();
	}
	//创键特效原件
	var picItemName = "dev/特效" + id;
	lib.addNewItem("movie clip", picItemName);
	lib.selectItem(picItemName, true);
	lib.setItemProperty('linkageExportForAS', true);
	lib.setItemProperty('linkageExportInFirstFrame', true);
	lib.setItemProperty('linkageClassName', 'mmo.effect.Effect' + id);
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
	//调整图片质量，随便放好在pic文件夹中
	for each(var item in lib.items) {
		if(item.itemType == "bitmap") {
			var itemName = item.name;
			lib.selectItem(itemName, true);
			var frameIndex = itemName.indexOf("temp");
			if(frameIndex >= 0) {
				lib.setItemProperty('linkageExportForAS', true);
				lib.setItemProperty('linkageExportInFirstFrame', true);
				var exportName = 'effect_' + id + '_' + itemName.substring(frameIndex, itemName.indexOf("."));
				lib.setItemProperty('linkageClassName', exportName);
			}
			lib.setItemProperty('allowSmoothing', false);
			lib.setItemProperty('compressionType', 'photo');
			lib.setItemProperty('useImportedJPEGQuality', false);
			lib.setItemProperty('quality', picQuality);
			lib.moveToFolder("pic", item.name, true);
		}
	}
	finalDoc.width = 960;
	finalDoc.height = 560;
	//拷贝eff层
	fl.setActiveWindow(doc);
	var layerIndex = parseInt(doc.getTimeline().findLayerIndex("eff"));
	if(isNaN(layerIndex)) {
		errRecord.push("特效文件[" + id + "]没有命名eff层");
		return;
	} else {
		doc.getTimeline().setSelectedLayers(layerIndex, true);
		doc.getTimeline().copyFrames();
		fl.setActiveWindow(finalDoc);
		tl.addNewLayer("eff");
		tl.setSelectedLayers(0, true);
		tl.pasteFrames();
	}
	//处理特技名的库元件
	handleEffectName(doc, finalDoc, id);
	//最后处理
	fl.saveDocument(finalDoc, saveURL + "/effect" + id + ".fla");
	fl.closeDocument(doc, false);
	fl.closeDocument(newDoc, false);
	fl.closeDocument(finalDoc, false);
	
	//搬迁，减少fla文件大小
  finalDoc2 = fl.createDocument();
  finalDoc = fl.openDocument(saveURL + "/effect" + id + ".fla");
  fl.setActiveWindow(finalDoc);
  var itemIndex = finalDoc.library.findItemIndex(picItemName);
  var theItem = finalDoc.library.items[itemIndex]; 
  finalDoc.addItem({x:0,y:0}, theItem);
  //finalDoc.exitEditMode();
  var effectNameItem = "dev/特效名-"+id;
  if(finalDoc.library.itemExists(effectNameItem))
  {
	  itemIndex = finalDoc.library.findItemIndex(effectNameItem);
	  var theItem = finalDoc.library.items[itemIndex]; 
	  finalDoc.addItem({x:0,y:0}, theItem);
  }
  finalDoc.selectNone();
  finalDoc.selectAll();
  finalDoc.clipCopy();
  fl.setActiveWindow(finalDoc2);
  finalDoc2.clipPaste();
  finalDoc2.deleteSelection();
  handleEffectName(finalDoc, finalDoc2, id);
  fl.saveDocument(finalDoc2, saveURLNew + "/effect" + id + ".fla");
  finalDoc2.publish();
  fl.closeDocument(finalDoc, false);
  fl.closeDocument(finalDoc2, false);
  
}

function exportPngWithStaticInterval(interval, id) {
	var doc = fl.getDocumentDOM();
	var configInterval = [];
	var frameCount = doc.getTimeline().frameCount;
	for(var i = 1; i <= frameCount; i += interval) {
		configInterval.push(i);
	}
	exportPngWithConfigInterval(configInterval, id);
}

function handleEffectName(doc, finalDoc, id) {
	fl.setActiveWindow(doc);
	doc.exitEditMode();
	doc.selectNone();
	doc.selectAll();
	doc.deleteSelection();
	doc.selectNone();
	var items = doc.library.items;
	for(var i = 0; i < items.length; i++) {
		var item = items[i];
		if(item.name.indexOf("特效名-") != -1) {
			doc.library.addItemToDocument({x:0, y:0}, item.name);
			doc.selectAll();
			doc.clipCopy();
			break;
		}
	}
	if(doc.selection.length > 0) {
		fl.setActiveWindow(finalDoc);
		finalDoc.exitEditMode();
		finalDoc.clipPaste(true);
		finalDoc.selectAll();
		finalDoc.deleteSelection();
		finalDoc.library.selectItem(item.name, true);
		finalDoc.library.setItemProperty('linkageExportForAS', true);
		finalDoc.library.setItemProperty('linkageExportInFirstFrame', true);
		finalDoc.library.setItemProperty('linkageClassName', 'mmo.effect.EffectName' + id);
		finalDoc.library.moveToFolder("dev", item.name, true);
	}
}

function printErrRecord() {
	var loggerName = saveURLNew + "/集成日志.txt";
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