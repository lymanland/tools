var fileURL = fl.browseForFolderURL("���ļ���·��", "select file");
if(fileURL == null)
{
	alert("�ļ��в���Ϊ��");
}

var fileC = FLfile.listFolder(fileURL, "files");
FLfile.createFolder(fileURL+ "/furniture");
var saveURL = fileURL + "/furniture/";

rename();

function rename()
{
	for(var i = 0; i < fileC.length; i++)
	{
		var doc = fl.openDocument(fileURL + '/' + fileC[i]);
		var fileNameArr = fileC[i].split('_');
		var fileId= fileNameArr[1];
		var name = null;
		if(fileId.length == 1)
		{
			name = "b00000" + fileId;
		}else if(fileId.length == 2)
		{
			name = "b0000" + fileId;
		}else if(fileId.length == 3)
		{
			name = "b000" + fileId;
		}else
		{
			alert("Id����1000��֧��");
			return;
		}
		var selArr = doc.library.items;
		for(var k = 0; k< selArr.length; k++)
		{
			if(selArr[k].linkageExportForAS)
			{
				var Arr = selArr[k].name.split('_');
				if(Arr[1] == 'B')
				{
					selArr[k].name = name + "_B";
					selArr[k].linkageClassName = "mmo.furniture." + name + "_B";
				}else if(Arr[1] == 'C')
				{
					selArr[k].name = name + "_C";
					selArr[k].linkageClassName = "mmo.furniture." + name + "_C";
				}else 
				{
					fl.trace(fileC[i] + "���ļ���������");
				}
				
				
 			}	
		}
		fl.saveDocument(doc,saveURL + name + ".fla");
		fl.closeDocument(doc,false);

	}
	alert("��ɣ���");
}



