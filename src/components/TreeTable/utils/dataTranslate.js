/*
* @Author: sunlandong
* @Date:   2017-03-11 12:06:49
* @Last Modified by:   sunlandong
* @Last Modified time: 2017-03-11 16:30:03
*/

import Vue from 'vue'
function DataTransfer (data) {
  if (!(this instanceof DataTransfer)) {
    return new DataTransfer(data, null, null)
  }
}


function treeObj(originObj){
	//对象深拷贝
	let obj ={};
	for (let key in originObj){
		var val = originObj[key];
  		obj[key] = typeof val === 'object' ? arguments.callee(val):val;
   }
   return obj;
}
 


DataTransfer.treeToArray = function (data, parent, level, expandedAll) {
  let tmp = []
  Array.from(data).forEach(function (record) {
     
    let thisExpandedAll = expandedAll;
    if(record.childrenFlag){
      thisExpandedAll = true;
    }else{
      thisExpandedAll = false;
    }
    if (record._expanded === undefined) {
      Vue.set(record, '_expanded', thisExpandedAll)
    }
    if (parent) {
      Vue.set(record, '_parent', parent)
    }
    if (!record.hasChildren) {
      Vue.set(record, '_hasChildren', 'has')
    }
    let _level = 0
    if (level !== undefined && level !== null) {
      _level = level + 1
    }
    Vue.set(record, '_level', _level);

    tmp.push(record)
    if (record.children && record.children.length > 0) {
      let children = DataTransfer.treeToArray(record.children, record, _level, thisExpandedAll)
      tmp = tmp.concat(children)
    }
    if(record.childrenFlag !== undefined && !record.childrenFlag){
      Vue.set(record, '_hasChildren', 'no');
    }
    
  })
  return tmp
}

export default DataTransfer
