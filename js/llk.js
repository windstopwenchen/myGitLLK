window.onload = function () {
	init();
}

var wrap;
var rows = 7;
var cols = 12;
var types = 20;
var squareSet;
var chooseOne=null;
var chooseTwo=null;

var TowardEnum={NONE:null,UP:{row:-1,col:0},RIGHT:{row:0,col:1},DOWN:{row:1,col:0},LEFT:{row:0,col:-1}};

function init(){
	wrap = document.getElementById('wrap');
	if(rows*cols%2!=0){
		alert('输入数量不能为奇数');
	}
	initSquareSet();
	
};

function initSquareSet(){
	wrap.style.width=86*cols + 'px';
	wrap.style.height=78*rows + 'px';
	
	var numSet = generateSquareNumSet();
	
	squareSet = new Array(rows+2);
	for(var i = 0; i< squareSet.length;i++){
		squareSet[i]= new Array(cols+2); 
	}
	
	for(var i = 1;i <= rows;i++){
		for(var j = 1;j <= cols;j++){
			var temp = createSquare(numSet.pop(),i,j);
			squareSet[i][j] = temp;
			wrap.appendChild(temp);
			temp.onclick=function(){
				if(chooseOne == null || chooseOne.num != this.num){
					chooseOne=this;					
				}else{
					chooseTwo=this;
					if(chooseOne !=chooseTwo && checkLine(chooseOne.row,chooseOne.col,0,TowardEnum.NONE,[])){
						clearSquare(chooseOne.row,chooseOne.col);
						clearSquare(chooseTwo.row,chooseTwo.col);
					}
					chooseOne=null;
					chooseTwo=null;
				}
				//修改点击后的图片
				render();
				//每次点击都检查是否胜利
				if(checkFinish()){
					alert('游戏胜利！');
				}
				
			}
			
		}
	}
	
};


function generateSquareNumSet(){
	var temp = [];
	for(var i=0;i<rows*cols/2;i++){
		var num = Math.floor(Math.random()*types);
		temp.push(num);
		temp.push(num);
	}
	temp.sort(function(){
		return Math.random()-0.5;
	});
	return temp;
}

function createSquare(num,row,col){
	var temp = document.createElement('div');
	temp.classList.add('square');
	
	temp.style.left =86*col + 'px';
	temp.style.top=76*row+'px';
	temp.style.backgroundImage=`url("./img/${num}.png")`;
	temp.num=num;
	temp.row=row;
	temp.col=col;
	return temp;
}

function checkLine(){
	
}

function clearSquare(row,col){
	wrap.removeChild(squareSet[row][col]);
	squareSet[row][col]=null;
}

function render(){
	for(var i=0;i<squareSet.length;i++){
		for(var j=0;j<squareSet[i].length;j++){
			if(squareSet[i][j]&&squareSet[i][j]==chooseOne){
				squareSet[i][j].style.opacity='0.5';
			}else if(squareSet[i][j]){
				squareSet[i][j].style.opacity='1';
			}
		}
	}
}

function checkFinish(){
	for(var i =0;i<squareSet.length;i++){
		for(var j=0;j<squareSet[i].length;j++){
			if(squareSet[i][j]){
				//有就返回false还是失败
				return false;
			}
		}
	}
	//循环检查发现都被清除
	return true;
}

function checkLine(row,col,changeTimes,nowToward,path){
	if(isExist(row,col)&&squareSet[row][col]==chooseTwo&&changeTimes<=3){
		return true;
	}
	if(isExist(row,col)&&squareSet[row][col]!=chooseOne
		||changeTimes>3
		||row<0||col<0||row>=squareSet.length||col>=squareSet[0].length
		||path.indexOf(getLocation(row,col)) >-1){
			path.pop();
			return false;
	}
		
	path.push(getLocation(row,col))	;
	return checkLine(row - 1, col, nowToward == TowardEnum.UP ? changeTimes : changeTimes + 1, TowardEnum.UP, path) //up
        || checkLine(row, col + 1, nowToward == TowardEnum.RIGHT ? changeTimes : changeTimes + 1, TowardEnum.RIGHT, path) //right
        || checkLine(row + 1, col, nowToward == TowardEnum.DOWN ? changeTimes : changeTimes + 1, TowardEnum.DOWN, path) //right
        || checkLine(row, col - 1, nowToward == TowardEnum.LEFT ? changeTimes : changeTimes + 1, TowardEnum.LEFT, path); //right;
}

function isExist(row,col){
	if(row>0 && row < squareSet.length && col>0 && col<squareSet[0].length&&squareSet[row]&&squareSet[row][col]){
		return true;
	}
	return false;
	
}

function getLocation(row,col){
	return ""+row+","+col;
}
