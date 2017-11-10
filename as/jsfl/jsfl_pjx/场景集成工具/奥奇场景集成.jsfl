/********************************************/
/*场景美术元件命名规则：name_name_name_Id.fla例如：square_Square_奥奇广场_19.fla*/
/********************************************/
var layer;
var sceneName;
var sceneClassName;
var sceneDescribName
var sceneId;
var fileURL = fl.browseForFolderURL("open", "selest file");
var fileMask ="*.fla";
var fileList = FLfile.listFolder(fileURL+"/"+fileMask, "files") ;
var index=0;
var j;
var arrSql=[];
var arrAssetConfig=[];
var arrServerConfig=[];
var arrMapConfig=[];
var width;
var height;

var obstructionName;
function setLayer(tl,index,val){
	tl.setSelectedLayers(index,true);
	tl.setLayerProperty("visible", val);
	tl.setLayerProperty("locked", !val);
}
function setAllLayers(tl,val){
	var layerCount = tl.layerCount;
	for(var i=0;i<layerCount;i++){
		setLayer(tl,i,val);
	}
}

function setNormalLayers(tl)
{
	var layerCount = tl.layerCount;
	for(var i=0;i<layerCount;i++){
		tl.setSelectedLayers(i,true);
		tl.setLayerProperty('layerType', 'normal');
	}
}

function check(doc)
{
   var arrlib=doc.library.items;
   for(var i = 0; i < arrlib.length; i++)
   {
		if(arrlib[i].name=="Background"||arrlib[i].name=="background")
		{
		  layer.background=true;
		}
		if(arrlib[i].name=="Foreground"||arrlib[i].name=="foreground")
		{
		  //arrlib[i].name ="Foreground";
		  layer.foreground=true;
		}
		if(arrlib[i].name=="Topground"||arrlib[i].name=="topground")
		{
		  layer.topground=true;
		}
		if(arrlib[i].name=="Obstruction"||arrlib[i].name=="obstruction")
		{
		  layer.obstruction=true;
		}
		if(arrlib[i].name=="Overlap"||arrlib[i].name=="overlap")
		{
		  layer.overlap=true;
		}
   }
}
function GetName(olddoc)
{
	var nameArr=olddoc.name.split("_");
	if(nameArr.length<3)
	{
		alert("fla文件命名错误，请检查");
		return false;
	}
	//fl.trace(nameArr);
	sceneName=nameArr[0];
	sceneClassName=nameArr[1];
	sceneDescribName=nameArr[2];
	sceneId=nameArr[3];
	return true;
}
function initNewDoc(newdoc)
{
   var lib=newdoc.library;
   lib.newFolder("dev");
   lib.newFolder("arts");
   lib.newFolder("arts/ButtonItems");
   lib.newFolder("arts/GraphicItems");
   lib.newFolder("arts/MovieClipItems");
   lib.newFolder("arts/MovieItems");
   lib.addNewItem("movie clip", "dev/"+sceneName);
   
   if(layer.topground != true)
      lib.addNewItem("movie clip", "Topground");
   if(layer.obstruction != true)
      lib.addNewItem("movie clip", "Obstruction");
   if(layer.overlap != true)
      lib.addNewItem("movie clip", "Overlap");
   if(layer.background != true)
      lib.addNewItem("movie clip", "Background");
   if(layer.foreground != true)
	  lib.addNewItem("movie clip", "Foreground");
 
}
function creatLayer(tl)
{
	 var outputpanel=fl.outputPanel;
     var lib=fl.getDocumentDOM().library;
	   
	   tl.addNewLayer("Background");
	   lib.addItemToDocument({x:0, y:0}, "Background");
	   lib.addItemToDocument({x:0, y:0}, "background");
	   
	   tl.addNewLayer("Overlap");
	   lib.addItemToDocument({x:0, y:0}, "Overlap");	
	   lib.addItemToDocument({x:0, y:0}, "overlap");
	   
	   tl.addNewLayer("Obstruction");
	   lib.addItemToDocument({x:0, y:0}, "Obstruction");  
	   lib.addItemToDocument({x:0, y:0}, "obstruction");  
	   
	   tl.addNewLayer("Foreground");
	   lib.addItemToDocument({x:0, y:0}, "Foreground");
	   lib.addItemToDocument({x:0, y:0}, "foreground");
	   
	   tl.addNewLayer("Topground");
	   lib.addItemToDocument({x:0, y:0}, "Topground");  
	   lib.addItemToDocument({x:0, y:0}, "topground");  
		
	   
	   var layerIndex= tl.findLayerIndex("图层 1");
	   outputpanel.trace(layerIndex);
	   tl.deleteLayer(layerIndex[0]);
	   
}
function setPosition(tl)
{
     var arrLayer=tl.layers;
	 var doc=fl.getDocumentDOM();
	 for( i=0;i<arrLayer.length;i++)
	 {
		var arrItem=arrLayer[i].frames[0].elements;
		if(arrItem.length>1)
		   alert("该图层元件超过一个");
		if(arrItem.length ==0)
		   return ;
		setAllLayers(tl,false);//锁了全部图层
		setLayer(tl,i,true);//解锁当前层
		doc.selectAll();
		setElementName(arrItem[0],doc);
		//fl.getDocumentDOM().deleteSelection();
		//fl.getDocumentDOM().moveSelectionBy({x:0, y:0});
	 }
}
function setElementName(element,doc)
{
   var lib=doc.library;
   //注册点设置为0
   element.x=0;
   element.y=0;
   if(element.layer.name =="Overlap")
   {
     element.name="overlap";
   }
   else if(element.layer.name =="Foreground")
   {
   	  element.name="foreground";
   }
   else if(element.layer.name =="Obstruction")
   {
   	  element.name="obstruction";
   }
   else if(element.layer.name =="Background")
   {
	  fl.trace("background:"+element.x+":"+element.y);	  
   	  element.name="background";
   }
   else if(element.layer.name =="Topground")
   {
	  //fl.trace("background:"+element.x+":"+element.y);	  
   	  element.name="topground";
   }
}

function setExportClass()
{
  var lib=fl.getDocumentDOM().library;
  lib.selectItem("dev/"+sceneName,true);
   if (lib.getItemProperty('linkageImportForRS') == true) {
		lib.setItemProperty('linkageImportForRS', false);
	}
	lib.setItemProperty('linkageExportForAS', true);
	//lib.setItemProperty('linkageExportForRS', false);
	lib.setItemProperty('linkageExportInFirstFrame', true);
	lib.setItemProperty('linkageClassName', 'mmo.scene.'+sceneName+'.'+sceneClassName);
		
	doc=fl.getDocumentDOM();
	doc.exitEditMode();
	document.docClass="mmo.scene."+sceneName+'.DocClass';
	doc.externalLibraryPath ="../../as";
	doc.sourcePath = "../../as";	
}

function sortItem()
{
    var lib=fl.getDocumentDOM().library;
	var arrlib=lib.items;	
	var item;
   for(var i = 0; i < arrlib.length; i++)
   {
        item=arrlib[i];
		if( item.name.toLowerCase()=="background" || item.name.toLowerCase() =="foreground" || item.name.toLowerCase() =="topground" ||  item.name.toLowerCase() =="obstruction" ||  item.name.toLowerCase() =="overlap")
		{
		    //lib.selectItem(item.name);
            if(item.name.toLowerCase() =="obstruction")	{
			   obstructionName = item.name;
            }			
			lib.moveToFolder('arts/MovieClipItems',item.name,true);			
		}
		else if(item.name == "dev/"+sceneName)
		{
		  
		}
		else if( item.itemType == "graphic" || item.itemType=="bitmap")
		{
		   lib.moveToFolder('arts/GraphicItems',item.name,true);
		}
		else if( item.itemType == "movie clip")
		{
		   lib.moveToFolder('arts/MovieItems',item.name,true);
		}
		else if( item.itemType == "button")
		{
		   lib.moveToFolder('arts/ButtonItems',item.name,true);
		}
   }
}

function creatFile()
{
   FLfile.createFolder("file:///E|/vstsworkspace/projectX/source/as/mmo/scene/"+sceneName);
   var sceneClassFile="package mmo.scene."+sceneName+"\r\n"+"{\r\n"+"   import flash.geom.Point;\r\n\r\n"+"   import mmo.common.utils.tips.TipsManager;\r\n";
   sceneClassFile+="   import mmo.interfaces.scene.SceneNames;\r\n"+"   import mmo.play.scene.SceneBase;\r\n\r\n"+"   public class "+sceneClassName+" extends SceneBase\r\n";
   sceneClassFile+="   {\r\n"+"      public function "+sceneClassName+"()\r\n"+"      {\r\n         super(300,300);\r\n      }\r\n\r\n      override protected function onJoinRoom():void{\r\n";
   sceneClassFile+="         super.onJoinRoom();\r\n      }\r\n   }\r\n}";
   
   var sceneDocClassFile="package mmo.scene."+sceneName+"\r\n"+"{\r\n"+"   import mmo.play.scene.DocSceneBase;\r\n\r\n   public class DocClass extends DocSceneBase\r\n   {\r\n";
   sceneDocClassFile+="      public function DocClass() {\r\n      }\r\n\r\n      override protected function setScene():void {\r\n         this._scene = new "+sceneClassName+"()\r\n      }\r\n   }\r\n}";
   
   var doc=fl.getDocumentDOM();
   var filepath="file:///E|/vstsworkspace/projectX/source/as/mmo/scene/"+sceneName+"/";
   FLfile.write(filepath+sceneClassName+".as", sceneClassFile);
   FLfile.write(filepath+"DocClass.as", sceneDocClassFile);
   
   fl.saveDocument(doc,"file:///E|/vstsworkspace/projectX/source/assets/scene/"+sceneName+".fla");
   //doc.close(false); 
}

function exportdata()
{
   var outputpanel=fl.outputPanel;
   id=sceneId.split(".")[0];
   //outputpanel.trace("INSERT INTO `Scene` (`SceneId`, `SceneName`, `Desc`, `SceneType`, `Continent`, `Area`) VALUES ('"+id+"', '"+sceneName+"', '"+sceneDescribName+"', '', '', '') ;");  
   var lib=fl.getDocumentDOM().library;
   lib.selectItem("dev/"+sceneName,true);
   lib.setItemProperty('linkageExportForAS', false);
   doc=fl.getDocumentDOM();  
   doc.exitEditMode();
   document.docClass="mmo.scene.util.MapArrayGetter";
   
   lib.addItemToDocument({x:0, y:0}, "arts/MovieClipItems/"+obstructionName);
   
   doc.selectAll();
   doc.enterEditMode('inPlace');
   doc.selectAll();
   doc.setFillColor('#FF3395');
   doc.exitEditMode();
   
   var element=doc.getTimeline().layers[0].frames[0].elements[0];
   element.x=0;
   element.y=0;
   element.name="obstruction";
   width=element.width;
   height=element.height;
   doc.testMovie();
	
 
   arrServerConfig[index]="<Room name=\""+sceneName+"\" autoJoin=\"true\" maxUsers=\"100\" />";   
   arrAssetConfig[index]="<r nm=\""+sceneName+"\" rm=\""+sceneName+"\" id=\""+id+"\" swf=\"scene/"+sceneName+"\" desc=\""+sceneDescribName+"\" ms=\"\" mu=\"music/ms_home\"/>";
   //outputpanel.trace("");
   //outputpanel.trace("id="+id);  
   //alert("随便输，只是暂停下。");	
   outputpanel.trace("");
   outputpanel.save(fileURL+ "/data.txt", true);
   
    doc.selectAll();
    doc.deleteSelection();
	setExportClass();
	fl.saveDocument(doc,"file:///E|/vstsworkspace/projectX/source/assets/scene/"+sceneName+".fla");
	 outputpanel.trace("j:"+j+"filelist"+fileList.length)
	if(j==fileList.length-1)
	{
	    fl.outputPanel.clear();	
		 var k;
		for(k=0;k<=index;k++)
		{
			outputpanel.trace(arrAssetConfig[k]);
		}
		outputpanel.trace("");
		for(k=0;k<=index;k++)
		{
			outputpanel.trace(arrServerConfig[k]);
		}
		outputpanel.save(fileURL+ "/data.txt", true);
	}
	index++;
}

function main(){
    //fl.outputPanel.save("file:///E|/data.txt", true); 
	//fl.outputPanel.clear();
	fl.outputPanel.clear();	
	fl.outputPanel.save(fileURL+ "/data.txt", false);
	for(j = 0; j < fileList.length; j++)
	{	
        if(	fileList[j].indexOf(".fla") == -1)
		   continue;
	    layer=new Object;		
		var olddoc = fl.openDocument(fileURL+ '/' + fileList[j]);
		var oldtl = olddoc.getTimeline();
		//fl.trace(olddoc.name);
		check(olddoc);
		GetName(olddoc);
		//解锁所有的层
		setAllLayers(oldtl,true);
		//把引导层变成普通层
		setNormalLayers(oldtl);
		olddoc.selectAll();
		olddoc.clipCopy();
		
		var newdoc=fl.createDocument();
		var newtl=newdoc.getTimeline();
		newdoc.clipPaste(true);
		olddoc.close();
		newdoc.selectAll();
		newdoc.deleteSelection();
		
		initNewDoc(newdoc);
		var newlib=newdoc.library;
		//newlib.selectItem("dev/"+sceneName);
		newlib.editItem("dev/"+sceneName);
		newtl=fl.getDocumentDOM().getTimeline();	
		creatLayer(newtl);
		setPosition(newtl);
		setExportClass();
		sortItem();	
		creatFile();
		exportdata();
	}
}

main();
