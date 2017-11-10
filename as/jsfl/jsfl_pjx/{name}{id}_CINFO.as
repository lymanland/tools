package 
{
	import mmo.interfaces.avatar.ActionInfo;
	import mmo.interfaces.avatar.SkinInfo;
	
	public class {name}{id}_CINFO extends SkinInfo
	{
		public function {name}{id}_CINFO()
		{
			super();
		}
		
		override public function hasSpecialAction():Boolean {
			return false;
		}
		
		protected override function getActionInfo():Array {
			// "act" 为动作标识符
			// "row" 为动作所在行
			// "len" 为动作帧长度
			// "delay" 为每帧的延迟，单位为帧。例如delay=1表示延迟1帧，即实际该帧的动画停留2帧的时间
			return [
				ActionInfo.getInstance("ddzn", 0, {len0}, 2, 0, {len0}),	// 普通站立
				ActionInfo.getInstance("uuzn", 1, {len1}, 2, 0, {len1}),
				ActionInfo.getInstance("ldzn", 0, {len0}, 2, 0, {len0}),
				ActionInfo.getInstance("rdzn", 0, {len0}, 2, 1, {len0}),
				ActionInfo.getInstance("llzn", 0, {len0}, 2, 0, {len0}),
				ActionInfo.getInstance("rrzn", 0, {len0}, 2, 1, {len0}),
				ActionInfo.getInstance("luzn", 1, {len1}, 2, 0, {len1}),
				ActionInfo.getInstance("ruzn", 1, {len1}, 2, 1, {len1}),
				ActionInfo.getInstance("ddwn", 2, {len2}, 2),	// 普通移动
				ActionInfo.getInstance("uuwn", 3, {len3}, 2),
				ActionInfo.getInstance("ldwn", 2, {len2}, 2),
				ActionInfo.getInstance("rdwn", 2, {len2}, 2, 1),
				ActionInfo.getInstance("llwn", 2, {len2}, 2),
				ActionInfo.getInstance("rrwn", 2, {len2}, 2, 1),
				ActionInfo.getInstance("luwn", 3, {len3}, 2),
				ActionInfo.getInstance("ruwn", 3, {len3}, 2, 1),
				ActionInfo.getInstance("ddsn", 4, {len4}, 6),	// 射击
				ActionInfo.getInstance("uusn", 5, {len5}, 6),
				ActionInfo.getInstance("ldsn", 4, {len4}, 6),
				ActionInfo.getInstance("rdsn", 4, {len4}, 6, 1),
				ActionInfo.getInstance("lusn", 5, {len5}, 6),
				ActionInfo.getInstance("rusn", 5, {len5}, 6, 1),
				ActionInfo.getInstance("ddzr", 6, 1, 0),	// 骑宠站立
				ActionInfo.getInstance("uuzr", 7, 1, 0),
				ActionInfo.getInstance("ldzr", 6, 1, 0),
				ActionInfo.getInstance("rdzr", 6, 1, 0, 1),
				ActionInfo.getInstance("llzr", 6, 1, 0),
				ActionInfo.getInstance("rrzr", 6, 1, 0, 1),
				ActionInfo.getInstance("luzr", 7, 1, 0),
				ActionInfo.getInstance("ruzr", 7, 1, 0, 1),
				ActionInfo.getInstance("ddwr", 6, {len6}, 2),	// 骑宠移动
				ActionInfo.getInstance("uuwr", 7, {len7}, 2),
				ActionInfo.getInstance("ldwr", 6, {len6}, 2),
				ActionInfo.getInstance("rdwr", 6, {len6}, 2, 1),
				ActionInfo.getInstance("llwr", 6, {len6}, 2),
				ActionInfo.getInstance("rrwr", 6, {len6}, 2, 1),
				ActionInfo.getInstance("luwr", 7, {len7}, 2),
				ActionInfo.getInstance("ruwr", 7, {len7}, 2, 1),
				ActionInfo.getInstance("ddsr", 4, {len4}, 6),   //骑宠射击
				ActionInfo.getInstance("uusr", 5, {len5}, 6), 
				ActionInfo.getInstance("ldsr", 4, {len4}, 6),
				ActionInfo.getInstance("rdsr", 4, {len4}, 6, 1),
				ActionInfo.getInstance("lusr", 5, {len5}, 6),
				ActionInfo.getInstance("rusr", 5, {len5}, 6, 1),
				ActionInfo.getInstance("ddzf", 8, {len8}, 3),	// 飞行站立
				ActionInfo.getInstance("uuzf", 9, {len9}, 3),
				ActionInfo.getInstance("ldzf", 8, {len8}, 3),
				ActionInfo.getInstance("rdzf", 8, {len8}, 3, 1),
				ActionInfo.getInstance("llzf", 8, {len8}, 3),
				ActionInfo.getInstance("rrzf", 8, {len8}, 3, 1),
				ActionInfo.getInstance("luzf", 9, {len9}, 3),
				ActionInfo.getInstance("ruzf", 9, {len9}, 3, 1),
				ActionInfo.getInstance("ddwf", 8, {len8}, 3),	// 飞行移动
				ActionInfo.getInstance("uuwf", 9, {len9}, 3),
				ActionInfo.getInstance("ldwf", 8, {len8}, 3),
				ActionInfo.getInstance("rdwf", 8, {len8}, 3, 1),
				ActionInfo.getInstance("llwf", 8, {len8}, 3),
				ActionInfo.getInstance("rrwf", 8, {len8}, 3, 1),
				ActionInfo.getInstance("luwf", 9, {len9}, 3),
				ActionInfo.getInstance("ruwf", 9, {len9}, 3, 1),
				ActionInfo.getInstance("ddsf", 4, {len4}, 6),	// 飞行射击
				ActionInfo.getInstance("uusf", 5, {len5}, 6),
				ActionInfo.getInstance("ldsf", 4, {len4}, 6),
				ActionInfo.getInstance("rdsf", 4, {len4}, 6, 1),
				ActionInfo.getInstance("lusf", 5, {len5}, 6),
				ActionInfo.getInstance("rusf", 5, {len5}, 6, 1)
			];
		}
	}
}