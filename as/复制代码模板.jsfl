
var arrSrcValue = ["newact20150327","getleihun", "GetLeiHun", "GLH"];
var arrDescValue = ["newact20153333","tiaozhan", "MyTiaoZhan", "MYTZ"];

var UriStr = "vstsworkspace/projectX/source/as/newactivityext/mmo/activityext/";
var OrgUri = "file:///E|/"+ UriStr;

var srcFolderUri = OrgUri + "newact20150327/getleihun/" ;
var descFolderUri = OrgUri + "newact20153333/tiaozhan/" ;

function createFolder(folderUriF)
{
	FLfile.createFolder(folderUriF);
}
createFolder(descFolderUri);

var readStr = "";
function readFile(fileUriF, ExtNameF)
{
	readStr = String(FLfile.read(fileUriF + ExtNameF));
}

function replaceFileStr(tempF, realStrF)
{
	var patt = new RegExp(tempF,"g");
	readStr = readStr.replace(patt, realStrF);
}

function createFile(strF, fileUriF, ExtNameF)
{
	if(FLfile.exists(fileUriF)) {
		alert("已存在！" + fileUriF);
	} else {
		FLfile.write(fileUriF, strF);
		
	}
}

function addFile(arrFileNameF, tUri, desUri)
{
	for each (var item in arrFileNameF) {
		var realClassName = item;
		
		var id = 0;
		for each(var value in arrSrcValue){
			if(item.indexOf(value) != -1){
				var pattFileName = new RegExp(value,"g");
				realClassName = item.replace(pattFileName, arrDescValue[id]);
				break;
			}
			++id;
		}

		readFile(tUri , item);

		id = 0;
		for each(var value in arrSrcValue){
			replaceFileStr(arrSrcValue[id], arrDescValue[id])
			++id;
		}

		
		var fileUri = desUri +  realClassName;
		createFile(readStr , fileUri, realClassName);
	}
}

function addFolder(arrFolderNameF, tUri, desUri)
{
	for each (var item in arrFolderNameF) {
		
		var desUri2 = desUri + item + "/";
		var tUri2 = tUri + item + "/";
		createFolder(desUri2);
		var arrFileName2 = FLfile.listFolder(tUri2, "files"); 
		var arrFolderName2 = FLfile.listFolder(tUri2, "directories"); 
		
		addFile(arrFileName2, tUri2, desUri2);
		addFolder(arrFolderName2, tUri2, desUri2)
	}
}

function addTotalFile(tUriF, desUri)
{
	var arrFileName = FLfile.listFolder(tUriF, "files"); 
	var arrFolderName = FLfile.listFolder(tUriF, "directories"); 
	
	addFolder(arrFolderName, tUriF, desUri)
	addFile(arrFileName, tUriF, desUri);
	alert("mission done");
}

addTotalFile(srcFolderUri, descFolderUri);