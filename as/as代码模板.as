//lee_getService
${:import(mmo.interfaces.ServiceContainer)}
var service:${value}= ServiceContainer.getService(${value});


//lee_getInstance
${:import(flash.system.ApplicationDomain,mmo.play.util.InteractUtil)}
var clsName:String = "mmo.";${cursor}
var res:MovieClip = InstanceUtil.getInstance(clsName, ApplicationDomain.currentDomain);


//lee_wp_init_dispose
//在继承WindowPanelBase的类里快速生成【框架基本结构重写代码】
${:import(flash.display.MovieClip)}
override protected function initChildren(res:MovieClip):void
{
		
}
	
override protected function initClickHelper():void{
	super.initClickHelper();
	regClickFuncCheckAnti("btnGet", onGetClick);
		
}
	
override public function dispose():void
{
	super.dispose();
}


//lee_wp_lisenter
//在继承WindowPanelBase的类里快速生成【lisenter相关代码】
${:import(flash.events.Event,mmo.interfaces.eventcenter.BaseEvent)}
override protected function addLisenters():void
{
	super.addLisenters();
}
		
protected function handleMaterialUpdated(e:Event):void
{
	super.handleMaterialUpdated(e);
}
		
protected function handleDailyServerUpdate(evt:BaseEvent):void
{
	super.handleDailyServerUpdate(evt);
}
		
override protected function removeLisenters():void
{
	super.removeLisenters();
}


//lee_applycallback
//调用回调
${:import(mmo.play.util.InteractUtil)}
InteractUtil.applyCallback(callback);


//lee_applycallback
//调用回调
${:import(mmo.play.util.InteractUtil)}
InteractUtil.applyCallback(callback);


//lee_applycallback_if
//调用回调 包含if判断
${:import(mmo.play.util.InteractUtil)}
if(false){
	InteractUtil.applyCallback(callback);
	return;
}
InteractUtil.applyCallback(callback);


//lee_applycallback_func
////调用回调 在虚函数里面
${:import(mmo.play.util.InteractUtil)}
handlFuncSelfName(function():void{
	InteractUtil.applyCallback(callback);
});


//lee_var_cosnt
//定义静态变量
${specifier:values(public, protected, private)} static const ${value}:${Type:values(String,Number,Boolean)} = ${cursor};

//lee_var_mc
//声明MovieClip变量
var ${value}:MovieClip = view["_${value}"];


//lee_load_res
//LoaderHelper下载资源
${:import(mmo.play.util.InteractUtil,mmo.loader.LoaderHelper,flash.display.MovieClip)}
mmo.loader.LoaderHelper
LoaderHelper.loadAndExcuteToDomain(URL, clsName, function(cls:Class):void
{
	var mc:MovieClip = new cls() as MovieClip;
	InteractUtil.applyCallback(callback, [mc]);
});