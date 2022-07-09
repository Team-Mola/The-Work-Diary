const date = new Date();
var time={}

function getDateID() {
    if(date.getMonth()<10){
        const today=String(date.getFullYear())+0+String(date.getMonth()+1)+String(date.getDate());   
        return(today);
      }else if(date.getDate()<=10){
        const today=String(date.getFullYear())+String(date.getMonth()+1)+0+String(date.getDate());
        return(today);
      }else{
        const today=String(date.getFullYear())+String(date.getMonth()+1)+String(date.getDate());
        return(today);
      }   
}

function getNowTime() {
  return date.getHours()+parseFloat((date.getMinutes()/100).toFixed(1));
}

time.getDailyWorkingHours=function(start, finish) {
  let intNum={
    start: parseInt(start.toFixed(0)),
    finish: parseInt(finish.toFixed(0))
  }
  let floatNum={
    start: parseFloat((start-intNum.start).toFixed(1)),
    finish: parseFloat((finish-intNum.finish).toFixed(1)),
  }
  if(floatNum.start>floatNum.finish){
    const num=intNum.finish-intNum.start-1;
    const tmp=0.6-floatNum.start+floatNum.finish;
    if(tmp>=0 && tmp<=4) return num+0.5;
    else return num+1;
  }else {
    const num=intNum.finish-intNum.start;
    const tmp=floatNum.finish-floatNum.start;
    if(tmp>=0 && tmp<=4) return num+0.5;
    else return tmp+1;
  }
}

module.exports = {getDateID, getNowTime, time};