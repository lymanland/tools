/**
 * �Ǳȸ��漯����֪��
 * fla����˵����a020458.fla
 * a02-->�Ǳ��·�ǰ׺���(����ClothesData�е��Ǳ��·�id������ȥ)
 * 0458-->�·�id��ע�⣺һ������λ���֣������Ļ�ǰ�油�㣩
 *
 * ʹ�ã������������ļ��Ѿ����ձ������ļ����������󣬽���ֱ�ӷ����ļ����м���
 *       ������ɺ�flash�������Ϣ��ӵ���ClothesPartsDatas.as�Լ�ClothesData.as
 *
 * �ļ���ţ�skinĿ¼��
 *
 * AS�޸ģ���interfaces/pet/data/PetClothesMap.as�¼�����Ӧ����
 */
var fileURL = fl.browseForFolderURL("��ѡ�������Դ��·����", "selest file");
var saveURL = fileURL + '/skin';
FLfile.createFolder(saveURL);

var fileList = FLfile.listFolder(fileURL, "files") ;

if(fileURL != null && saveURL != null)
{
	//var conf = prompt("Enter config", "Type user name here");
	//var confarr = conf.split(';');
	var confarr = [];
	for(var j =0;j < fileList.length; j++)
	{
		var filearr = fileList[j].split('_');
		var str = filearr[1];
		var add0Num = 4 - str.length;
		var fileName = "4";
		for(var k=0;k<add0Num;k++)
		{
			fileName = fileName + "0";
		}
		confarr.push(fileName+str);
	}
	
	for(var j =0;j < fileList.length; j++)
	{
		
		var doc = fl.openDocument(fileURL+ '/' + fileList[j]);
		doc.selectAll();
		var petArray = doc.selection;
		for(var i = 0; i< petArray.length; i ++)
		{
			var pet = petArray[i];
			var tempY = pet.y;
			pet.scaleX = pet.scaleY = 1.2;
			pet.y = tempY;
		}
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
				selArr[i].linkageClassName = "a0" + confarr[j] + "0_C";
				selArr[i].linkageBaseClass = "flash.display.MovieClip";
				selArr[i].linkageExportInFirstFrame = true;
				selArr[i].name = "a0" + confarr[j] + "0_C";
			}
		}
		fl.saveDocument(new_doc, saveURL + '/' + "a0" + confarr[j] + '.fla');
		fl.closeDocument(new_doc);
		fl.closeDocument(doc,false);
	}
	
	for(var j =0;j < fileList.length; j++)
	{
		var filearr = fileList[j].split('_');
		fl.trace("			\""+confarr[j]+"\""+ ": new Clothes("+ confarr[j] +",\n				" +		
				"\"" +filearr[2] +"\""+ ", 0, 0, false, 1, 0, false),\n");
	}
	
	for(var j =0;j < fileList.length; j++)
	{
		var filearr = fileList[j].split('_');
		fl.trace("				\"" + confarr[j]+"\":\n					"  +
					"[[new ClothesParts(\"a0"+ confarr[j] + "0\", SkinPosInfo.QI_CHONG__QIAN, SkinInfoFactory.SCENE_PET_STAND_MOVIE\n						" +
						", ClothesSideTypes.TWO, \"" + filearr[4].substr(0, filearr[4].length - 4) +"\")],\n					"+
					"\"a0"+confarr[j]+"\"],");
	}

	alert("��ɣ�");
}