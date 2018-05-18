$(function(){
	$('#radioCheck').click();
	
})

function toWgs84(long,lat){
	//百度经纬度坐标转国测局坐标
	var bd09togcj02 = coordtransform.bd09togcj02(long, lat);
	//国测局坐标转wgs84坐标
	var wgs84 = coordtransform.gcj02towgs84(bd09togcj02[0],bd09togcj02[1]);
	return wgs84;
}

function getQueryString(name) {
	var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
	var r = window.location.search.substr(1).match(reg);
	if (r != null) {
		return unescape(r[2]);
	}
	return null;
}