/**
 * [解析url参数]
 * @example ?id=12345&a=1
 * @return Object {id:12345,a:1}
 */
export function urlParse(){
	let url = decodeURIComponent(window.location.search);
	let obj = {};
	let reg = /[?&][^?&]+=[^?&]+/g;
	//['?id=12345','a=1']
	let arr = url.match(reg);
	if(arr){
		arr.forEach((item)=>{
			let  tempArr =  item.substring(1).split('=');
			let key = decodeURIComponent(tempArr[0]);
			let value = decodeURIComponent(tempArr[1]);
			obj[key] = value;
		})
	}
	return obj;
}