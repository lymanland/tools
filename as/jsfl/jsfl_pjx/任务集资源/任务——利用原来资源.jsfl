//��ľ��������Դ����£������øýű������滻��Դ
//��taskconfig�ļ�������taskId,ѡ��E:\vstsworkspace\projectX\source\assets\taskextĿ¼���Ѵ��ڵ���Դ��ִ�л������������Դ
//ע���滻�����������
fl.outputPanel.clear(); 
var sucRecord = [];
var errRecord = [];
var myName = "lixiangfei";
var xmlName ="taskconfig.xml";
var scriptName=fl.scriptURI.split("/")[fl.scriptURI.split("/").length - 1];
var patt = new RegExp(scriptName,"g"); //g��ʾȫ�ֱ���
var xmlUri = fl.scriptURI.replace(patt, xmlName);
var xml = XML(FLfile.read(xmlUri));
if(!FLfile.exists(xmlUri)){
	alert("no XML");
}
var taskId =xml.taskId;
//��ȡ���

//�����
var folderURI ="file:///E|/vstsworkspace/projectX/source/project";
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
if(FLfile.exists(filePath))
{
	fl.trace(filePath+"\n");
}
var str = FLfile.read(filePath);
//=====================================
var chooseFileURL;
var fileMask ="*.fla";
chooseFileURL = fl.browseForFolderURL("��ѡ����ļ���·��", "select file");
fl.trace("chooseFileURL--->"+chooseFileURL);
var path=chooseFileURL.substr(0,chooseFileURL.lastIndexOf("/"));
if(chooseFileURL!=null)
{
	var fileList=FLfile.listFolder(chooseFileURL+"/"+fileMask,"files");
	FLfile.createFolder(path + "/task"+taskId);
	handleBatchFile(fileList);
	writeChange2File();
	printRecord();
}

function handleBatchFile(fileList) 
{
	for each(var file in fileList) 
	{
		handleSingleFile(file);
	}
}

function handleSingleFile(file)
{
	var doc=fl.openDocument(chooseFileURL+"/"+file);
	var arr=file.split("_");
	var type;
//	fl.trace(arr.length);
	if(arr.length>1)
	{
		type=arr[1];
	}else
	{
		type="doc";
	}
//	fl.trace("type--->"+type);
	var lib=doc.library;
	var items=lib.items;
	for(var i=0;i<items.length;i++)
	{
			var item=items[i];
			if(item.itemType=='folder'){
				continue;
			}
			if(item.linkageExportForAS==true)
			{
				var clsName =item.linkageClassName;
				var pattern = /[0-9]+/ ; 
				var newClsName=clsName.replace(pattern,taskId);
				item.linkageClassName=newClsName;
				//ֻ��һ���Ļ�����break
				//break;
				
			}
	}
	var savePath;
	if(type=="doc")
	{
		var pattern = /[0-9]+/ ; 
		var docClass=doc.docClass;
		var newDocClass=docClass.replace(pattern,taskId);
		doc.docClass=newDocClass;
		savePath = path + "/task"+taskId +"/task"+taskId + ".fla";
		fl.saveDocument(doc, path + "/task"+taskId +"/task"+taskId + ".fla");
	}else
	{
		savePath = path + "/task"+taskId +"/task"+taskId+ "_"+ type;
		fl.saveDocument(doc, path + "/task"+taskId +"/task"+taskId+ "_"+ type);
	}
	//fl.trace("savePath---->" + savePath);
	addPath2Change(savePath);
	doc.publish();
	fl.closeDocument(doc, false);
}


function addPath2Change(path){
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

function writeChange2File()
{
		if(!FLfile.write(filePath, str))
		{
			var tmpfileURI = filePath.replace("file:///", "");
			tmpfileURI = tmpfileURI.replace("|/", ":/");
			var command = '"C:/Program Files/Microsoft Visual Studio 8/Common7/IDE/tf.exe" checkout '+tmpfileURI;
			FLfile.runCommandLine(command);
			FLfile.write(filePath, str)
			fl.trace("ǩ���������");
			fl.trace(tmpfileURI+" ���������ɹ���");

		}
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
	fl.trace("--------------------- ������Ϣ�б� ��β-------------------------\n");
}




