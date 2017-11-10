var optimizeBMP = 1;
var changePicQuality = 0;
var picQuality = 80;
var picClsPrefix = "mmo.iconservice.res.HeroSkinView_#ID#";
var filePrefix = "heroskinview-";
var libNames = ["可替换内容/匹配立绘", "可替换内容/匹配底板"
, "可替换内容/结算立绘", "可替换内容/匹配英雄名字", "可替换内容/商城立绘", "可替换内容/LOADING立绘 "];
var clsNames = ["mmo.iconservice.res.HeroSkinView_Match_#ID#"
, "mmo.iconservice.res.HeroSkinView_BG_#ID#"
, "mmo.iconservice.res.HeroSkinView_Result_#ID#"
, "mmo.iconservice.res.HeroSkinView_Name_#ID#"
, "mmo.iconservice.res.HeroSkinView_Shop_#ID#"
, "mmo.iconservice.res.HeroSkinView_Loading_#ID#"];
var outputURL = "file:///E|/projectio/dev/source/assets/iconservice/res/heroskinview_#ID#.fla";
var defaultId = 0;
var defaultFilePath = "";

function exportRes(id, filePath)
{
	//fl.outputPanel.clear();
	var doc;
	//fl.trace("888888888888 = " + id);
	if (id == 0)
	{
		//id = prompt("id:", "0");
		var fileName = fl.getDocumentDOM().name.split(".fla")[0];
		defaultRaceId = fileName.split(filePrefix)[1];
		id = prompt("skinid", defaultRaceId);
		if (id == null || id == "")
		{
			return;
		}
		//fl.trace("111111111111 = " + id);
		doc = fl.getDocumentDOM();
	}
	else
	{
		//fl.trace("2222222 = " + id);
		doc = fl.openDocument(filePath);
	}
	//fl.trace(name);
	doc.selectAll();
	doc.deleteSelection();
	for each (var libName in libNames){
		doc.library.selectItem(libName, true, true);
		doc.library.setItemProperty('linkageExportForAS', true);
		doc.library.setItemProperty('linkageExportInFirstFrame', true);
		doc.library.setItemProperty('linkageClassName', clsNames[libNames.indexOf(libName)].replace("#ID#", id));
		fl.getDocumentDOM().library.addItemToDocument({x: 0, y: 0});
	}
	doc.selectAll();
	doc.clipCopy();

	var newDoc = fl.createDocument();
	newDoc.clipPaste();
	newDoc.selectAll();
	//var item = newDoc.selection[0];
	//item.linkageClassName = "mmo.peticon.PetIcon" + id + "_res";
	newDoc.deleteSelection();
	var lib = newDoc.library;
	lib.selectItem(libName);

	var bmpCount = 0;
	if(optimizeBMP){
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
				lib.setItemProperty('linkageClassName', picClsPrefix.replace("#ID#", id) + "_tmpBmp_" + bmpCount);
				lib.moveToFolder("bmpFolder", item.name, true);
				bmpCount++;
			}
		}
	}

	fl.saveDocument(newDoc, outputURL.replace("#ID#", id));
	newDoc.publish();
	fl.closeDocument(doc, false);
	fl.closeDocument(newDoc, false);
	fl.trace("aOK! ID:" + id);
	if(bmpCount > 1){
		fl.trace("警告：位图数量大于1，可能存在不重用的资源！");
	}
}

exportRes(defaultId, defaultFilePath);
