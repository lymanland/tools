/**
  * 只用于a03开头的跟随集成
  * 资源命名模板:"跟随_30001_奇奇vip1和vip2样子_V1.0_000111222333.fla"
  */
var fileURL = fl.browseForFolderURL("请选择跟随资源的路径：", "selest file");
var saveURL = fileURL + '/skin';
FLfile.createFolder(saveURL);

var fileList = FLfile.listFolder(fileURL, "files") ;

if(fileURL != null && saveURL != null)
{
	var confarr = [];
	for(var j =0;j < fileList.length; j++)
	{
		var filearr = fileList[j].split('_');
		var str = filearr[1];
    var fileName = "";
		confarr.push(str);
	}
	
	for(var j =0;j < fileList.length; j++)
	{
		
		var doc = fl.openDocument(fileURL+ '/' + fileList[j]);
		doc.selectAll();
		new_doc = fl.createDocument();
		doc.clipCopy();
		//new_doc.clipPaste(true);
		new_doc.library.addNewItem("movie clip", confarr[j] + "_C");
		new_doc.library.editItem(confarr[j] + "_C");
		new_doc.clipPaste(true);
		var selArr = new_doc.library.items;
		for(var i = 0; i< selArr.length; i++)
		{
			if(selArr[i].name == confarr[j] + "_C")
			{
				selArr[i].linkageExportForAS = true;
				selArr[i].linkageExportForRS = false;
				selArr[i].linkageClassName = "a" + confarr[j] + "0_C";
				selArr[i].linkageBaseClass = "flash.display.MovieClip";
				selArr[i].linkageExportInFirstFrame = true;
				selArr[i].name = "a" + confarr[j] + "0_C";
			}
		}
		fl.saveDocument(new_doc, saveURL + '/' + "a0" + confarr[j] + '.fla');
		fl.closeDocument(new_doc);
		fl.closeDocument(doc,false);
	}
	
	for(var j =0;j < fileList.length; j++)
	{
		var filearr = fileList[j].split('_');
		fl.trace("			\""+confarr[j]+"\""+ ": new Clothes("+ confarr[j] +"," +"\"" +filearr[2] +"\""+ ", 0, 0, false, false),\n");
	}
	
	for(var j =0;j < fileList.length; j++)
	{
		var filearr = fileList[j].split('_');
		fl.trace("			\"" + confarr[j]+"\":\n				"  +
					"[[new ClothesParts(\"a"+ confarr[j] + "0\", SkinPosInfo.QI_CHONG__QIAN, SkinInfoFactory.SCENE_PET_STAND_MOVIE\n					" +
						", ClothesSideTypes.TWO, \"" + filearr[4].substr(0, filearr[4].length - 4) +"\")], "+
					"\"a0"+confarr[j]+"\"],");
	}

	alert("完成！");
}