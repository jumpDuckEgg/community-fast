function filterBoardType(val){
    let result;
    if(val == 0 ){
        result = '首页';        
    }else {
        result = '市场';
    }
    return result;
}

function filterBoolean(val){
  let result;
  if(val == 0 ){
      result = '否';        
  }else {
      result = '是';
  }
  return result;
}

function filterGoodsType(val){
  let result;
  if(val == 0 ){
      result = 'SKU';        
  }else {
      result = 'POA';
  }
  return result;
}

function filterStatus(val){
  let result;
  if(val == 0 ){
      result = '待审核';        
  }
  if(val == 1 ){
      result = '审核通过';        
  }
  if(val == 2 ){
    result = '审核失败';        
  }
  
  return result;
}



// 过滤成树形数据

function treeObj(originObj){
	//对象深拷贝
	let obj ={};
	for (let key in originObj){
		var val = originObj[key];
  		obj[key] = typeof val === 'object' ? arguments.callee(val):val;
   }
   //对象新增children键值，用于存放子树
  //  obj['children'] = [];
   return obj;
}


//data：带转换成树形结构的对象数组
//attributes：对象属性
function toTreeData (data, attributes) {
    let resData = data;
    let tree = [];
   
   //找寻根节点
    for (let i = 0; i < resData.length; i++) {
   
      if (resData[i][attributes.parentId] === '0'|| resData[i][attributes.parentId] === null) {
        tree.push( treeObj(resData[i]) );
        resData.splice(i, 1);
        i--;
      }
    }
   
    run(tree);
   
    //找寻子树
    function run(chiArr) {
      if (resData.length !== 0) {
        for (let i = 0; i < chiArr.length; i++) {
          for (let j = 0; j < resData.length; j++) {
            if (chiArr[i][attributes.id] === resData[j][attributes.parentId]){
              let obj = treeObj(resData[j]);
              if(!chiArr[i].children){
                chiArr[i].children = []
              }
              chiArr[i].children.push(obj);
              resData.splice(j, 1);
              j--;
            }
          }
          if(chiArr[i].children){
            run(chiArr[i].children);
          }
          
        }
      }
    }
   
    return tree;
   
  }

 





export default {
    filterBoardType,
    toTreeData,
    filterBoolean,
    filterGoodsType,
    filterStatus
}