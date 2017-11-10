//��taskconfig����id���Լ���Ӧ��Դmov comic
fl.outputPanel.clear(); 
var sucRecord = [];
var errRecord = [];
var myName = "liyijun";
var xmlName ="taskconfig.xml";
var folderURI ="file:///E|/vstsworkspace/projectX/source/project";

//��ȡ����
var scriptName=fl.scriptURI.split("/")[fl.scriptURI.split("/").length - 1];
var patt = new RegExp(scriptName,"g"); //g��ʾȫ�ֱ���
var xmlUri = fl.scriptURI.replace(patt, xmlName);
var xml = XML(FLfile.read(xmlUri));
if(!FLfile.exists(xmlUri)){
	alert("no XML");
}
var saveBaseURL = "file:///E|/vstsworkspace/projectX/source/assets/taskext/";
var taskId =xml.taskId;
var taskConf = xml.taskConf.split(",");
var clsPosixConf =xml.clsPosix.split(",");
var filePosixConf = xml.filePosix.split(",");
var saveURL = saveBaseURL+"task"+taskId;
fl.trace("saveURL" + saveURL);
FLfile.createFolder(saveURL); 
//��ȡ���ã������ļ��н���

var files = [];
var moiveIndex = 1;
var comicIndex = 1;
var fileIndex = 0;
//�����
var filePath = folderURI+"/dateReplace/"+myName+"/.settings/com.adobe.flexbuilder.flashbridge.prefs"; 
var fileList2 = FLfile.listFolder(folderURI, "directories"); //folders 
fileList2.sort();
for(var idx = fileList2.length - 1; idx >= 0; idx--)
{
	if(fileList2[idx].indexOf("_") == -1)
	{
		break;
	}
}
filePath = filePath.replace("dateReplace", fileList2[idx]);

//����ʼ

if(FLfile.exists(filePath))
{
	fl.trace(filePath+"\n");
}
var str = FLfile.read(filePath);
var fileURL;
var fileMask ="*.fla";
fileURL = fl.browseForFolderURL("��ѡ����ļ���·��", "select file");
if(fileURL!=null)
{
	var fileList=FLfile.listFolder(fileURL+"/"+fileMask,"files");
	handleBatchFile(fileList);
}

function handleBatchFile(fileList) 
{
	for each(var file in fileList) 
	{
		handleSingleFile(file);
		files.push(file);
		
	}
	
	if(FLfile.write(filePath, str))
	{
			printRecord();
	}
	else
	{
			var tmpfileURI = filePath.replace("file:///", "");
			tmpfileURI = tmpfileURI.replace("|/", ":/");
			var command = '"C:/Program Files/Microsoft Visual Studio 8/Common7/IDE/tf.exe" checkout '+tmpfileURI;
			FLfile.runCommandLine(command);
			FLfile.write(filePath, str)
			fl.trace("ǩ���������");
	}
}

function handleSingleFile(file)
{
	var doc=fl.openDocument(fileURL+"/"+file);
	var type = taskConf[fileIndex];
	var clsPofix;
	var filePofix;
	if(type =="Mov")
	{
		filePofix = filePosixConf[0] +moiveIndex;
		clsPofix = clsPosixConf[0] + moiveIndex;
		moiveIndex ++;
	}else
	{
		filePofix = filePosixConf[1] +comicIndex;
		clsPofix = clsPosixConf[1] + comicIndex;
		comicIndex++;
	}
	fileIndex ++;
	var frameCount=doc.getTimeline().frameCount;
	fl.setActiveWindow(doc);
	for(var i = 0; i < frameCount; i++) 
	{
		if(doc.getTimeline().currentFrame != i) 
		{
			doc.getTimeline().currentFrame = i;
		}
		doc.selectNone();
		doc.selectAll();
		if(doc.selection.length > 1) 
		{
			errRecord.push("�ļ�[" + file + "]��" + i + "֡����̨�ϵ�ԭ��������1������");
			return;
		}
		//������в�������Ͳ��ɼ�
		for(var idx = 0; idx < doc.getTimeline().layerCount; idx++) 
		{
			doc.getTimeline().setSelectedLayers(idx, true);
			doc.getTimeline().setLayerProperty("visible", true);
			doc.getTimeline().setLayerProperty("locked", false);
		}
		
		/**selection*/
		doc.selectNone();
		doc.selectAll();
		var selections = doc.selection;
		var lib=doc.library;
		var items=doc.library.items;
		for(var index =0;index<items.length;index++)
		{
			var item=items[index];	
			if (item.name == selections[0].libraryItem.name) 
			{ 
				doc.deleteSelection();
				lib.selectItem(item.name, true);
				lib.editItem(item.name);
				lib.setItemProperty('linkageExportForAS', true);
				lib.setItemProperty('linkageExportInFirstFrame', true);
				var clsName="mmo.task"+taskId+"."+clsPofix;
				lib.setItemProperty('linkageClassName', clsName);
				break;	 
			} 
		}
		cleanLibrary(doc);
		var path = saveURL +"/task"+taskId+ "_"+ filePofix+ ".fla";
		addPath(path);
		fl.saveDocument(doc, path);
		doc.publish();
		fl.closeDocument(doc, false);
	}
}

function addPath(path){
	var curUri = path;
	curUri = curUri.replace("file:///", "");
	curUri = curUri.replace("|/", ":/");
	var pathsStart = "flashProFiles/paths=";
	var pathsEnd = "flashProFiles/flashProID="
	var indexPathsStart = str.indexOf(pathsStart);
	var indexPathsEnd = str.indexOf(pathsEnd);
	var tempFileList = str.slice(indexPathsStart+pathsStart.length, indexPathsEnd-1);
	var tempFileListArray = tempFileList.split(";");
	var hasTempFile = false;
	for each(var tempFile in tempFileListArray )
	{
		if(tempFile == curUri)
		{
			hasTempFile = true;
		}
	}
	if(!hasTempFile)
	{
		tempFileList = tempFileList + ";" + curUri;
		sucRecord.push(path);
	}
	else
	{
		errRecord.push(path+"���ڱ�����У�");
	}
	temp = str.slice(0, indexPathsStart+pathsStart.length);
	temp += tempFileList;
	temp += str.slice(indexPathsEnd-1, str.length-1);
	str = temp;
}


function printRecord() {
	fl.trace("--------------------- �ɹ����������б� -------------------------");
	for(var i = 0; i < sucRecord.length; i++) {
		fl.trace(sucRecord[i]);
	}
	fl.trace("--------------------- �ɹ����������б� ��β-------------------------\n");
	fl.trace("--------------------- ������Ϣ�б� -------------------------");
	for(var j = 0; j < errRecord.length; j++) {
		fl.trace(errRecord[j]);
	}
	for(var k=0;k<files.length;k++)
	{
		fl.trace("filename:"+files[k]);
	}
	fl.trace("--------------------- ������Ϣ�б� ��β-------------------------\n");
}

/* ������ļ��� */
function cleanLibrary(aDoc) 
{
	var lib = aDoc.library;
	lib.newFolder("dev");
	lib.newFolder("art");
	var allItem = lib.items;
	for(var i = 0; i < allItem.length; i++)
	{
		var item = allItem[i];
		if(item.itemType == 'folder') 
		{
			continue;
		}
		if(item.linkageExportForAS == true) 
		{
			lib.moveToFolder("dev", item.name, false);
		} else
		{
			lib.moveToFolder("art", item.name, false);
		}
	}
}
