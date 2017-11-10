var skinPosList = [];
function init(){
	skinPosList = [
		{name:"标签", value:"SkinPosInfo.BIAO_QIAN"},
		{name:"特效01", value:"SkinPosInfo.TE_XIAO_01"},
		{name:"翅膀（前）", value:"SkinPosInfo.CHI_BANG_QIAN"},
		{name:"骑宠（前）", value:"SkinPosInfo.QI_CHONG__QIAN"},
		{name:"脸部装饰(前)", value:"SkinPosInfo.MIAN_BU_ZHUANG_SHI"},
		{name:"背部配件(前)", value:"SkinPosInfo.BEI_BU_PEI_JIAN_QIAN"},
		{name:"背部(前)", value:"SkinPosInfo.BEI_BU__QIAN"},
		{name:"头部(前)", value:"SkinPosInfo.TOU_FA__QIAN"},
		{name:"配饰(前)", value:"SkinPosInfo.PEI_SHI__QIAN"},
		{name:"左手饰品（前）", value:"SkinPosInfo.SHOU_CHI_WU_ZUO_QIAN"},
		{name:"衣服（袖子前）", value:"SkinPosInfo.YI_FU__XIU_ZI_QIAN"},
		{name:"底色（手臂前）", value:"SkinPosInfo.DI_SE__SHOU_BI_QIAN"},
		{name:"底色（头部）", value:"SkinPosInfo.DI_SE__TOU_BU"},
		{name:"面部装饰(后)", value:"SkinPosInfo.MIAN_BU_ZHUANG_SHI_HOU"},
		{name:"左手饰品（后）", value:"SkinPosInfo.SHOU_CHI_WU_ZUO_HOU"},
		{name:"裙摆", value:"SkinPosInfo.QUN_BAI"},
		{name:"靴子", value:"SkinPosInfo.XUE_ZI"},
		{name:"衣服（躯干）", value:"SkinPosInfo.YI_FU__QU_GAN"},
		{name:"鞋子", value:"SkinPosInfo.XIE_ZI"},
		{name:"底色（躯干）", value:"SkinPosInfo.DI_SE__QU_GAN"},
		{name:"手持物右", value:"SkinPosInfo.SHOU_CHI_WU_YUO"},
		{name:"衣服袖子后 ", value:"SkinPosInfo.YI_FU__XIU_ZI_HOU"},
		{name:"底色（手臂后）", value:"SkinPosInfo.DI_SE__SHOU_BI_HOU"},
		{name:"配饰（后）", value:"SkinPosInfo.PEI_SHI__HOU"},
		{name:"头发（后）", value:"SkinPosInfo.TOU_FA__HOU"},
		{name:"背部(后)", value:"SkinPosInfo.BEI_BU__HOU"},
		{name:"背部配件(后) ", value:"SkinPosInfo.BEI_BU_PEI_JIAN_HOU"},
		{name:"翅膀（后）", value:"SkinPosInfo.CHI_BANG_HOU"},
		{name:"骑宠（后）", value:"SkinPosInfo.QI_CHONG__HOU"},
		{name:"特效02", value:"SkinPosInfo.TE_XIAO_02"},
		{name:"阴影", value:"SkinPosInfo.YIN_YING"},
		{name:"背景", value:"SkinPosInfo.BEI_JING"}
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