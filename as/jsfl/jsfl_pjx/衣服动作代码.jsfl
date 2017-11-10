fl.outputPanel.clear();
var pathPerfix = "file:///E|/vstsworkspace/projectX/source/";
var sourcePath = pathPerfix+"assets/skin/";
var codeOutputPath = pathPerfix+"as/skin/";
var codeSrcFileName = "{name}{id}_CINFO.as";
var codeSrc = pathPerfix+"tools/jsfl/"+codeSrcFileName;

var log = [];

var doc;
var lib;

main();

function main() {
  var idStr = prompt("输入衣服id(用英文逗号分开)", "id,id,id");
  var idArr = idStr.split(",");
  for(var i = 0; i < idArr.length; i++)
  {
    handleSingleCloth(idArr[i]);
  }
  traceLog();
}

function traceLog()
{
  for(var i = 0; i < log.length; i++)
  {
    fl.trace(log[i]);
  }
}

function handleSingleCloth(clothId) {
  log.push("当前衣服："+clothId);
  var fileName = getFileName(clothId);
  var fileURL = sourcePath+fileName+".fla";
  log.push("fileURL: "+fileURL);
  fl.openDocument(fileURL);
  doc = fl.getDocumentDOM();
  doc.sourcePath = "../../as/skin/"+fileName;
  if(doc.externalLibraryPath.indexOf("../../as") == -1)
  {
    doc.externalLibraryPath = "../../as;" + fl.externalLibraryPath;
  }
  lib = doc.library;
  var items = lib.items;
  var devItems = getDevItem(items, fileName);
  var actionScript = "";
  for(var i = 0; i < devItems.length; i++)
  {
    log.push("devItem: "+devItems[i].name);
    var id = getSubId(devItems[i], fileName);
    var lengthArr = getSingleItemLength(devItems[i]);
    log.push("lengthArr: "+lengthArr);
    code(fileName, id, lengthArr);
    actionScript += "var skin"+id+":"+fileName+id+"_CINFO; ";
  }
  doc.selectNone();
  doc.getTimeline().layers[0].frames[0].actionScript = actionScript;
	doc.save();		
	doc.publish();
	doc.close();
  log.push("当前衣服："+clothId+" ok\n");
}

function code(folderName, id, lengthArr) {
  var code = FLfile.read(codeSrc);
  var pattern = ["\\\{name\\\}", "\\\{id\\\}"];
  var replacement = [folderName, id];
  for(var i = 0; i < lengthArr.length; i++)
  {
    pattern.push("\\\{len"+i+"\\\}");
    replacement.push(lengthArr[i]);
  }
  code = replaceDatas(code, pattern, replacement);
  
  var outputFileName = replaceDatas(codeSrcFileName, pattern, replacement);
  var outputPath = codeOutputPath+folderName;
  createFolder(outputPath);
  var outputflieURI = outputPath+"/"+outputFileName;
  log.push("outputflieURI: "+outputflieURI);
  FLfile.write(outputflieURI, code);
}

function createFolder(path) {
  var URI = "file:///";
  var folder = path.replace(URI, "").split("/");
  URI += folder[0];
  for(var i = 1; i < folder.length; i++)
  {
    URI += "/";
    URI += folder[i];
    if(!FLfile.exists(URI))
    {
      FLfile.createFolder(URI);
    }
  }
}

function getSubId(item, fileName) {
  var name = item.name;
  name = name.replace("dev/"+fileName, "");
  name = name.replace("_C", "");
  return name;
}

function getDevItem(items, fileName) {
  var newArr = [];
  var perfix = "dev/"+fileName;
  for(var i = 0; i < items.length; i++)
  {
    if(items[i].name.indexOf(perfix) != -1)
    {
      newArr.push(items[i]); 
    }
  }
  return newArr;
}

function getSingleItemLength(item) {
  var newArr = [];
  lib.selectItem(item.name);
  lib.editItem();
  var elements = doc.getTimeline().layers[0].frames[0].elements;
  var pointYArr = [];
  var i;
  for(i = 0; i < elements.length; i++)
  {
     pointYArr.push(Math.round(elements[i].y));
  }
  pointYArr.sort(sortNumber);
  var y = pointYArr[0];
  var count = 0;
  for(i = 0; i < pointYArr.length; i++)
  {
    if(pointYArr[i] != y)
    {
      newArr.push(count);
      y = pointYArr[i];
      count = 0;
    }
    count++;
  }
  newArr.push(count);
  doc.exitEditMode();
  return newArr;
}

function sortNumber(a, b)
{
return a - b;
}

function getFileName(id) {
	var l = id.length;
	var str = "a";
	for(var i = 0; i < 6-l; i++)
	{
		str += "0";
	}
	str += id;
	return str;
}

function replaceDatas(datas, pattern, replacement) {
  for(var i = 0; i<replacement.length; i++)
  {
    var patt = new RegExp(pattern[i],"g");
    datas = datas.replace(patt, replacement[i]);
  }
  return datas;
}

