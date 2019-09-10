const util={
  getYear:function(n){
    const currDate=new Date();
    let nowYear = currDate.getFullYear();
    let arr=[];
    for(let i=0;i<n;i++){
        arr.push(nowYear-i);
    }
    return arr;
  }
}
export default util;