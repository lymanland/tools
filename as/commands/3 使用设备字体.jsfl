//*** Clear Output
fl.outputPanel.clear();//输出面板清空

//*** 获得fla文档
var oDocument = fl.getDocumentDOM();
var oLib = oDocument.library;
var aLibItems = oLib.items;

	
//*** 循环遍历库元件
for(var i=0; i <aLibItems.length; i++){
	
	//*** 如果有时间轴 time line
	if(aLibItems[i].timeline != undefined){

		//*** 获得图层
		var aLayers = aLibItems[i].timeline.layers;
		
		//*** 遍历这个元件的每个图层
		for(var ii=0; ii <aLayers.length; ii++){

			//*** 获得每一帧
			var aFrames = aLayers[ii].frames;
			
			//***遍历每一帧
			for(var iii=0; iii <aFrames.length; iii++){

				//*** 获得每一帧的元件
				var aElements = aFrames[iii].elements;
				
				editElements(aElements);
			}
		}
	}
}

function editGroup(group)
{
	group.selected = true;
	editElements(group.members);
}

function editElements(aElements)
{
	//*** 在遍历这个元件的每一帧
	for(var ix=0; ix <aElements.length; ix++){
		
		//*** 判断是否是文本
		if(aElements[ix].elementType == "text"){
			
			//*** 获得文本
			var oText = aElements[ix];
			
			//*** 判断如果是动态文本或者输入文本
			if(
				(oText.textType == "dynamic")
				||(oText.textType == "input")
			){
				//oText.setElementProperty('fontRenderingMode', 'device');

									//设置字体大小
				//oText.setTextAttr("face", "FZY3JW--GB1-0");
				//*** Set device
				oText.fontRenderingMode = "device";
				
				//*** Tracedata
				fl.outputPanel.trace("Text Element Name: " + aElements[ix].name + " : " + oText.textType + " : " + oText.embedRanges);
			}
		}
		else if(aElements[ix].elementType == "shape" && aElements[ix].isGroup)
		{
			editGroup(aElements[ix]);
		}
	}
}