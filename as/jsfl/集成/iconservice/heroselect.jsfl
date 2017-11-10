﻿var optimizeBMP = 1;
var changePicQuality = 0;
var picQuality = 80;
var picClsPrefix = "mmo.iconservice.res.HeroSelect_#raceId#";
var filePrefix = "heroselect-";
var libNames = ["可替换资源/英雄名字", "可替换资源/英雄头像", "可替换资源/英雄背景"];
var clsNames = ["mmo.iconservice.res.HeroSelect_Name_#raceId#"
, "mmo.iconservice.res.HeroSelect_Head_#raceId#"
, "mmo.iconservice.res.HeroSelect_BG_#raceId#"];
var outputURL = "file:///E|/projectio/dev/source/assets/iconservice/res/heroselect_#raceId#.fla";
var defaultRaceId = 0;
var defaultFilePath = "";

function exportPetIcon(raceId, filePath)
{
	//fl.outputPanel.clear();
	var doc;
	//fl.trace("888888888888 = " + raceId);
	if (raceId == 0)
	{
		//raceId = prompt("raceid:", "0");
		var fileName = fl.getDocumentDOM().name.split(".fla")[0];
		defaultRaceId = fileName.split(filePrefix)[1];
		raceId = prompt("roleid", defaultRaceId);
		if (raceId == null || raceId == "")
		{
			return;
		}
		//fl.trace("111111111111 = " + raceId);
		doc = fl.getDocumentDOM();
	}
	else
	{
		//fl.trace("2222222 = " + raceId);
		doc = fl.openDocument(filePath);
	}
	//fl.trace(name);
	doc.selectAll();
	doc.deleteSelection();
	for each (var libName in libNames){
		doc.library.selectItem(libName, true, true);
		doc.library.setItemProperty('linkageExportForAS', true);
		doc.library.setItemProperty('linkageExportInFirstFrame', true);
		doc.library.setItemProperty('linkageClassName', clsNames[libNames.indexOf(libName)].replace("#raceId#", raceId));
		fl.getDocumentDOM().library.addItemToDocument({x: 0, y: 0});
	}
	doc.selectAll();
	doc.clipCopy();

	var newDoc = fl.createDocument();
	newDoc.clipPaste();
	newDoc.selectAll();
	//var item = newDoc.selection[0];
	//item.linkageClassName = "mmo.peticon.PetIcon" + raceId + "_res";
	newDoc.deleteSelection();
	var lib = newDoc.library;
	lib.selectItem(libName);

	if(optimizeBMP){
		var bmpCount = 0;
		for each (var item in lib.items)
		{
			if (item.itemType == "bitmap")
			{
				var itemName = item.name;
				lib.selectItem(itemName, true);
				lib.setItemProperty('allowSmoothing', false);
				if(changePicQuality){
					lib.setItemProperty('compressionType', 'photo');
					lib.setItemProperty('useImportedJPEGQuality', false);
					lib.setItemProperty('quality', picQuality);
				}
				lib.setItemProperty('linkageExportForAS', true);
				lib.setItemProperty('linkageExportInFirstFrame', true);
				lib.setItemProperty('linkageClassName', picClsPrefix.replace("#raceId#", raceId) + "_tmpBmp_" + bmpCount);
				lib.moveToFolder("bmpFolder", item.name, true);
				bmpCount++;
			}
		}
	}

	fl.saveDocument(newDoc, outputURL.replace("#raceId#", raceId));
	newDoc.publish();
	fl.closeDocument(doc, false);
	fl.closeDocument(newDoc, false);
	fl.trace("aOK! raceId:" + raceId);
}

exportPetIcon(defaultRaceId, defaultFilePath);
