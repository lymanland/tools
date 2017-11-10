//fl.trace(fl.scriptURI);
var myName = "liyijun";
var uriStr = "vstsworkspace/projectX/source";
var tfexe = "C:/Program Files/Microsoft Visual Studio 8/Common7/IDE/tf.exe";
var orgUri = "file:///E|/"+ uriStr;
var folderURI = orgUri + "/project";
var validateURI= "E:/"+uriStr+"/assets";
var fileURI = folderURI+"/dateReplace/"+myName+"/.settings/com.adobe.flexbuilder.flashbridge.prefs"; 
var fileList2 = FLfile.listFolder(folderURI, "directories"); //folders 
fileList2.sort();
for(var idx = fileList2.length - 1; idx >= 0; idx--)
{
	if(fileList2[idx].indexOf("_") == -1)
	{
		break;
	}
}
fileURI = fileURI.replace("dateReplace", fileList2[idx]);
FLfile.setAttributes(fileURI, "V");
var str = String(FLfile.read(fileURI)); 
//alert(str);
var doc = fl.getDocumentDOM();
var curUri = doc.pathURI;
curUri = curUri.replace("projectx", "projectX");
curUri = curUri.replace("file:///", "");
curUri = curUri.replace("|/", ":/");

tmpfileURI = fileURI.replace("file:///", "");
tmpfileURI = tmpfileURI.replace("|/", ":/");
var isEnd = false;
if(curUri.indexOf(validateURI) == -1)
{
	alert("路径错误！");
}
else{
	var idx = str.indexOf(curUri);
	if(idx == -1 || idx >= str.indexOf("flashProFiles/recentFiles="))
	{
		var command = '"C:/Program Files/Microsoft Visual Studio 8/Common7/IDE/tf.exe" add '+curUri;
		FLfile.runCommandLine(command);
		var startIdx = str.indexOf("flashProFiles/paths=");
		var endIdx = str.indexOf("flashProFiles/flashProID", startIdx);
		str = str.replace("flashProFiles/paths=", "flashProFiles/paths="+curUri + ((endIdx - startIdx < 30)?"":";"));
		
		if(FLfile.write(fileURI, str))
		{
			fl.trace(curUri+" 加入变更集成功！");
		}
		else
		{
			var command = '"C:/Program Files/Microsoft Visual Studio 8/Common7/IDE/tf.exe" checkout '+tmpfileURI;
			FLfile.runCommandLine(command);
			FLfile.write(fileURI, str)
			fl.trace("签出变更集！");
			fl.trace(curUri+" 加入变更集成功！");
		}
	}
	else
	{
		alert("已在变更集中！");
	}
}