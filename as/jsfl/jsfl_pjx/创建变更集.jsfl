//fl.trace(fl.scriptURI);
var myName = "chenfengte";
var uriStr = "vstsworkspace/projectX/source";
var orgUri = "file:///E|/"+ uriStr;
var folderURI = orgUri + "/project";
var validateURI= "E:/"+uriStr+"/assets";
var fileURI = folderURI+"/dateReplace/"+myName+"/.settings/com.adobe.flexbuilder.flashbridge.prefs"; 
var settingFileUrl= folderURI+"/dateReplace/"+myName;
var fileList2 = FLfile.listFolder(folderURI, "directories"); //folders 
FLfile.runCommandLine('"E:/vstsworkspace/projectX/source/tools/jsfl/createDateFolder.exe"');
fileList2.sort();
for(var idx = fileList2.length - 1; idx >= 0; idx--)
{
	if(fileList2[idx].indexOf("_") == -1)
	{
		break;
	}
}
fileURI = fileURI.replace("dateReplace", fileList2[idx]);
settingFileUrl = settingFileUrl.replace("dateReplace", fileList2[idx]);
if(fileURI != null)
{
	tmpfileURI = fileURI.replace("file:///", "");
	tmpfileURI = tmpfileURI.replace("|/", ":/");
	
	//fl.trace(fileURL);
	FLfile.createFolder(settingFileUrl+"/.settings")
	var str = "eclipse.preferences.version=1\nflashProFiles/defaultIndex=0\nflashProFiles/defaultPath=\nflashProFiles/paths=\nflashProFiles/flashProID=1392775914643\nflashProFiles/asVersion=0\nflashProFiles/boundTemplate=C:/Users/"+myName+"/AppData/Local/Adobe/Flash CS6/zh_CN/Configuration/ActionScript 3.0/Templates/boundClass_as3.as\nflashProFiles/classTemplate=C:/Users/"+myName+"/AppData/Local/Adobe/Flash CS6/zh_CN/Configuration/ActionScript 3.0/Templates/standardClass_as3.as\nflashProFiles/recentFiles=\nflashProFiles/locations=";
	//var loggerName = fileURI + "/.settings/com.adobe.flexbuilder.flashbridge.prefs";
  fl.trace(tmpfileURI);
	if(FLfile.exists(fileURI)) {
			alert("已存在！");
		} else {
			FLfile.write(fileURI, str);
			alert("已创建！");
		}
	var command = '"C:/Program Files/Microsoft Visual Studio 8/Common7/IDE/tf.exe" add '+tmpfileURI;
	FLfile.runCommandLine(command);
}
