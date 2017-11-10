var skinPosList = [];
function init(){
	skinPosList = [
		{name:"��ǩ", value:"SkinPosInfo.BIAO_QIAN"},
		{name:"��Ч01", value:"SkinPosInfo.TE_XIAO_01"},
		{name:"���ǰ��", value:"SkinPosInfo.CHI_BANG_QIAN"},
		{name:"��裨ǰ��", value:"SkinPosInfo.QI_CHONG__QIAN"},
		{name:"����װ��(ǰ)", value:"SkinPosInfo.MIAN_BU_ZHUANG_SHI"},
		{name:"�������(ǰ)", value:"SkinPosInfo.BEI_BU_PEI_JIAN_QIAN"},
		{name:"����(ǰ)", value:"SkinPosInfo.BEI_BU__QIAN"},
		{name:"ͷ��(ǰ)", value:"SkinPosInfo.TOU_FA__QIAN"},
		{name:"����(ǰ)", value:"SkinPosInfo.PEI_SHI__QIAN"},
		{name:"������Ʒ��ǰ��", value:"SkinPosInfo.SHOU_CHI_WU_ZUO_QIAN"},
		{name:"�·�������ǰ��", value:"SkinPosInfo.YI_FU__XIU_ZI_QIAN"},
		{name:"��ɫ���ֱ�ǰ��", value:"SkinPosInfo.DI_SE__SHOU_BI_QIAN"},
		{name:"��ɫ��ͷ����", value:"SkinPosInfo.DI_SE__TOU_BU"},
		{name:"�沿װ��(��)", value:"SkinPosInfo.MIAN_BU_ZHUANG_SHI_HOU"},
		{name:"������Ʒ����", value:"SkinPosInfo.SHOU_CHI_WU_ZUO_HOU"},
		{name:"ȹ��", value:"SkinPosInfo.QUN_BAI"},
		{name:"ѥ��", value:"SkinPosInfo.XUE_ZI"},
		{name:"�·������ɣ�", value:"SkinPosInfo.YI_FU__QU_GAN"},
		{name:"Ь��", value:"SkinPosInfo.XIE_ZI"},
		{name:"��ɫ�����ɣ�", value:"SkinPosInfo.DI_SE__QU_GAN"},
		{name:"�ֳ�����", value:"SkinPosInfo.SHOU_CHI_WU_YUO"},
		{name:"�·����Ӻ� ", value:"SkinPosInfo.YI_FU__XIU_ZI_HOU"},
		{name:"��ɫ���ֱۺ�", value:"SkinPosInfo.DI_SE__SHOU_BI_HOU"},
		{name:"���Σ���", value:"SkinPosInfo.PEI_SHI__HOU"},
		{name:"ͷ������", value:"SkinPosInfo.TOU_FA__HOU"},
		{name:"����(��)", value:"SkinPosInfo.BEI_BU__HOU"},
		{name:"�������(��) ", value:"SkinPosInfo.BEI_BU_PEI_JIAN_HOU"},
		{name:"��򣨺�", value:"SkinPosInfo.CHI_BANG_HOU"},
		{name:"��裨��", value:"SkinPosInfo.QI_CHONG__HOU"},
		{name:"��Ч02", value:"SkinPosInfo.TE_XIAO_02"},
		{name:"��Ӱ", value:"SkinPosInfo.YIN_YING"},
		{name:"����", value:"SkinPosInfo.BEI_JING"}
		];
}

function main(){
	init();
	var doc = fl.getDocumentDOM();
	fl.setActiveWindow(doc);
	doc.selectAll();
	var selectArr = doc.selection
	sortByY(selectArr);
	for (var i = 0; i < selectArr.length; i++){
		doc.selectNone();
		doc.selection = [selectArr[i]];
		doc.enterEditMode("inPlace");
		var tl = doc.getTimeline();
		for(var j = 0 ; j < tl.layers.length; j++){
			tl.layers[j].name = j+"."+skinPosList[j].name;
		}
		doc.exitEditMode();
	}
}

function sortByY(selectArr)
{
	for(var i = 1; i < selectArr.length; i++)
	{
		for(var j = 0; j < selectArr.length - i; j++)
		{
			if(selectArr[j].y > selectArr[j+1].y || (selectArr[j].y == selectArr[j+1].y && selectArr[j].x > selectArr[j+1].x))
			{
				var tmp = selectArr[j];
				selectArr[j]  = selectArr[j+1];
				selectArr[j+1] = tmp;
			}
		}
	}
}

main();