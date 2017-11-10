function main(){
	var ignoreFrames = prompt("将多少帧合并在一起？", "1");
	var doc = fl.getDocumentDOM();
	fl.setActiveWindow(doc);
	doc.selectAll();
	var selectArr = doc.selection;
	for (var i = 0; i < selectArr.length; i++){
		doc.selectNone();
		doc.selection = [selectArr[i]];
		var name = doc.selection[0].libraryItem.name;
		doc.enterEditMode("inPlace");
		checkAndConvertBMP(doc, ignoreFrames, name);
		doc.exitEditMode();
	}
	setLibBMPQuality(60);
}

function checkAndConvertBMP(doc, ignoreFrames, parentLibItemName){
	doc.getTimeline().convertToKeyframes(0, doc.getTimeline().frameCount);
	for (var i = 0; i < doc.getTimeline().layers.length; i ++){
		var tl = doc.getTimeline();
		tl.convertToKeyframes(0, tl.frameCount);
		var layer = tl.layers[i];
		for (var j = 0; j < layer.frames.length; j ++){
			if(layer.frames[j].tweenType != "none"){
				layer.frames[j].tweenType = "none";
			}
			if(j%ignoreFrames != 0){
				tl.clearKeyframes(j,j);
				continue;
			}
			tl.setSelectedFrames(j,j);
			doc.selectAll();
			doc.convertSelectionToBitmap();//只需要一句话即可转位图有木有
			doc.selectAll();
			doc.selection[0].libraryItem.name = parentLibItemName + "_bmp_" + i + "_" + j;
		}
	}
}

function setLibBMPQuality(picQuality){
	var doc = fl.getDocumentDOM();
	var lib = doc.library;
	if(!lib.itemExists("bmpFolder")) {
		lib.newFolder("bmpFolder");
	}
	for each(var item in lib.items) {
		if(item.itemType == "bitmap") {
			var itemName = item.name;
			lib.selectItem(itemName, true);
			lib.setItemProperty('allowSmoothing', false);
			lib.setItemProperty('compressionType', 'photo');
			lib.setItemProperty('useImportedJPEGQuality', false);
			lib.setItemProperty('quality', picQuality);
			lib.moveToFolder("bmpFolder", item.name, true);
		}
	}
}


main();