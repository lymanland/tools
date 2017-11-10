var npcId;
var npcName;
var npcIconNames=[];
var npcFaceName;
var npcSyms=[];
var npcConfig=[];
var npcIconConfig;
var iconId;

var fileUrl= fl.browseForFolderURL("打开文件夹路径", "select file");
if(fileUrl==null){
	alert("未选定文件夹！");
}

FLfile.createFolder(fileUrl+"/npc/");
var saveUrl=fileUrl+"/npc/";
var fileMask = "*fla";
var fileC = FLfile.listFolder(fileUrl+"/"+fileMask,"files");

main();

function exportNpc(npcsym)
{
	npcsym.linkageExportForAS = true;
	npcsym.linkageExportForRS = false;
	npcsym.linkageExportInFirstFrame = true;
	npcsym.linkageClassName = "mmo.npc.Npc" + npcId + "_1";
    npcsym.name =  npcName+"形象";
	
}

function newItem(curLayer,nextLayer,tl)
{
	curLayer.locked = false;
	nextLayer.locked = true;
	var oldtl = tl;
	var lib = fl.getDocumentDOM().library;
	var frames=curLayer.frames;
	var nextFrames = nextLayer.frames;
	fl.outputPanel.clear();
	fl.outputPanel.save(saveUrl+"/npc"+npcId+"IconConfig.xml",false);
	for(var i=0;i<curLayer.frameCount;i++){
		if(frames[i].name==""&&i==0){
			iconId = i/10+1;
			var pName = npcName+"_普通";
			lib.addNewItem("movieclip");
			lib.renameItem(pName);
			curLayer.locked = true;
			nextLayer.locked = false;
			oldtl.setSelectedLayers(1,true);
			oldtl.copyFrames(i);
			lib.editItem(pName);
			var newtl = fl.getDocumentDOM().getTimeline();
			newtl.pasteFrames(0);
			lib.setItemProperty("linkageExportForAS",true);
			lib.setItemProperty("linkageExportForRS",false);
			lib.setItemProperty("linkageExportInFirstFrame",true);
			lib.setItemProperty("linkageClassName", "mmo.npc.NpcIcon" + npcId + "_"+(i/10+1));
			
			npcIconConfig = "<i npcId=\""+npcId+"\" iconId=\""+iconId+"\" npcName=\""+npcName+"\" desc=\"默认\" />";  
			fl.outputPanel.trace(npcIconConfig);
		}
	
		if(i%10==0&&i>=10){
			iconId = i/10+1;
			var itemName = npcName+"_"+frames[i].name;
			lib.addNewItem("movieclip");
			lib.renameItem(itemName);
			curLayer.locked = true;
			nextLayer.locked = false;
			oldtl.setSelectedLayers(1,true);
			oldtl.copyFrames(i);
			lib.editItem(itemName);
			var newtl = fl.getDocumentDOM().getTimeline();
			newtl.pasteFrames(0);
			lib.setItemProperty("linkageExportForAS",true);
			lib.setItemProperty("linkageExportForRS",false);
			lib.setItemProperty("linkageExportInFirstFrame",true);
			lib.setItemProperty("linkageClassName", "mmo.npc.NpcIcon" + npcId + "_"+iconId);
			
			npcIconConfig = "<i npcId=\""+npcId+"\" iconId=\""+iconId+"\" npcName=\""+npcName+"\" desc=\""+frames[i].name+"\" />";  
			fl.outputPanel.trace(npcIconConfig);
		}
		
	}
	fl.outputPanel.save(saveUrl+"/npc"+npcId+"IconConfig.xml", false);
}


function exportNpcIcon(npcsym)
{
	var lib = fl.getDocumentDOM().library;
	lib.editItem(npcsym.name);
	var tl = fl.getDocumentDOM().getTimeline();
	var layers=[];
	layers = tl.layers;
	newItem(layers[0],layers[1],tl);
	return;
}

function newFolder(folderName,doc) {
	if(!doc.library.itemExists(folderName)) 
	{
		doc.library.newFolder(folderName);
	}
}

function sortItem(doc)
{
   var lib =doc.library;
   newFolder("dev",doc);
   newFolder("arts",doc);
   newFolder("arts/ButtonItems",doc);
   newFolder("arts/GraphicItems",doc);
   newFolder("arts/MovieClipItems",doc);
   
   var arrlib=lib.items;	
   var item;
  // fl.outputPanel.trace(arrlib.length);
  for(var i = 0; i < arrlib.length; i++)
   {
        item=arrlib[i];
		if(item.linkageExportForAS == true)
		{
		  lib.moveToFolder('dev',item.name,true);
		}
		else if( item.itemType == "graphic" || item.itemType=="bitmap")
		{
		   lib.moveToFolder('arts/GraphicItems',item.name,true);
		}
		else if( item.itemType == "movie clip")
		{
		   lib.moveToFolder('arts/MovieClipItems',item.name,true);
		}
		else if( item.itemType == "button")
		{
		   lib.moveToFolder('arts/ButtonItems',item.name,true);
		}
   }
}

function createFile(doc)
{
	var saveFile = saveUrl+"npc"+npcId+".fla";
	fl.saveDocument(doc,saveFile);
	fl.closeDocument(doc,false);
	var newdoc =fl.openDocument(saveFile);
	sortItem(newdoc);
	newdoc.selectAll();
	newdoc.deleteSelection();
	fl.saveDocument(newdoc,true);
	
	
}

function exportConfigData()
{
	fl.outputPanel.clear();
	fl.outputPanel.save(saveUrl+ "/npcconfig.xml", false);
	for(var i=0;i<fileC.length;i++)
	{
	    fl.outputPanel.trace(npcConfig[i]);
	}
	fl.outputPanel.save(saveUrl+ "/npcconfig.xml", false);
}


function main()
{
	for(var i=0;i<fileC.length;i++){
	
		var oldDoc=fl.openDocument(fileUrl+"/"+fileC[i]);
		
		var lib=fl.getDocumentDOM().library;
		lib.newFolder("dev");
		lib.newFolder("arts");
		lib.newFolder("arts/ButtonItems");
		lib.newFolder("arts/GraphicItems");
		lib.newFolder("arts/MovieClipItems");
		
		npcName = fileC[i].split("_")[0];
		npcId = fileC[i].split("_")[1].split(".")[0];
		oldDoc.selectAll();
		npcSyms = oldDoc.selection;
		if(npcSyms.length!=2){
			alert("舞台上元件个数不对！应为两个，当前有"+npcSyms.length+"个");
			return;
		}
		exportNpc(npcSyms[0].libraryItem);
		exportNpcIcon(npcSyms[1].libraryItem);
		
		npcConfig[i]="<i id=\""+npcId+"\" name=\""+npcName+"\"/>";  
		createFile(oldDoc);
		
	}
	exportConfigData();
	
}