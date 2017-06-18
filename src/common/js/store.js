/**
 * [保存数据到localstorage]
 * @param  {[Number]} id  [商家id]
 * @param  {[type]} key [属性值]
 * @param  {[type]} value [value值]
 * @return {[type]}       [description]
 */
export function saveToLocal(id, key, value) {
    let seller = window.localStorage.__seller__;
    if (!seller) {
        seller = {};
        seller[id] = {};

    } else {
        seller = JSON.parse(seller);
        if (!seller[id]) {
            seller[id] = {};
        }
    }
    seller[id][key] = value;
    window.localStorage.__seller__ = JSON.stringify(seller);
};
/**
 * [从localstorage读取数据]
 * @param  {[Number]} id  [商家id]
 * @param  {[type]} key [属性值]
 * @param  {[type]} def [属性值的默认取值，当没有保存key时，返回默认值]
 * @return {[type]}     [属性值对应的value值]
 */
export function loadFromLocal(id, key, def) {
	let seller = window.localStorage.__seller__;
	if(!seller){
		return def;
	}
	
	seller = JSON.parse(seller);
	if(!seller[id]){
		return def;
	}

	let ret = seller[id][key];
	return ret || def;
}
