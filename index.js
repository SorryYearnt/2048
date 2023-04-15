const PositionStep = 2.2;
const MouseMinMovementDistance = 5;
const TouchMinMovementDistance = 5;


const N2 = 0;
const N4 = 1;
const N8 = 2;
const N16 = 3;
const N32 = 4;
const N64 = 5;
const N128 = 6;
const N256 = 7;
const N512 = 8;
const N1024 = 9;
const N2048 = 10;


class NumberPosition {
	NumberSquare = null;
	RowIndex;
	ColumnIndex;
	StyleLeft;
	StyleTop;
	constructor(RowIndex, ColumnIndex) {
		this.RowIndex = RowIndex;
		this.ColumnIndex = ColumnIndex;
		this.StyleLeft = ColumnIndex * PositionStep + 'rem';
		this.StyleTop = RowIndex * PositionStep + 'rem';
	}
}

const Board = [];
const NumberPositions = [];
let EmptySquareNumber = 16;
let Changing = true;
let ToLeft, ToRight, ToUp, ToDown;
let OperationStartPosition = [];

/* 本代码由SorryYearnt编写，转载请注明出处。This code is written by SorryYearnt. Please indicate the source for reprinting. このコードはSorryYearntによって書かれており、転載は出典を明記してください。 */

function Initialize() {
	Resize();
	addEventListener('resize', Resize);

	for (let i = 0; i < 4; i++) {
		Board[i] = [];
		for (let j = 0; j < 4; j++) {
			NumberPositions.push(Board[i][j] = new NumberPosition(i, j));
		}
	}

	const FreeItem1 = {};//标量传入数组不会自动改变
	const FreeItem2 = {};
	const ROW = ['i', FreeItem1, 'i][j', 'ColumnIndex', 'i][TargetPosition.ColumnIndex', FreeItem2];
	const COLUMN = [FreeItem1, 'i', 'j][i', 'RowIndex', FreeItem2, 'TargetPosition.RowIndex][i'];
	const POSITIVE = [3, 2, '>=0', 'TargetPosition', 'CurrentPosition', -1, '--'];
	const NEGATIVE = [0, 1, '<4', 'CurrentPosition', 'TargetPosition', 1, '++'];
	const AsyncFunction = Object.getPrototypeOf(async function () { }).constructor;
	function OperationCreater(Axis, Direction) {
		FreeItem1.toString = () => Direction[0];
		FreeItem2.toString = () => Direction[5];
		return new AsyncFunction(`
		Changing=true;
		let Promises=[];
		let HaveChange=false;
		for(let i=0;i<4;i++){
			let TargetPosition=Board[${Axis[0]}][${Axis[1]}];
			for(let j=${Direction[1]};j${Direction[2]};){
				let CurrentPosition=Board[${Axis[2]}];
				let CurrentNumberSquare=CurrentPosition.NumberSquare;
				function MoveNumber(thenFunc){
					CurrentNumberSquare.style.transitionDuration=(${Direction[3]}.${Axis[3]}-${Direction[4]}.${Axis[3]})*0.05+'s';
					Promises.push(MoveNumberSquare(TargetPosition,CurrentNumberSquare).then(thenFunc));
					CurrentPosition.NumberSquare=null;
					HaveChange=true;
				}
				if(CurrentNumberSquare!=null){
					let TargetNumberSquare=TargetPosition.NumberSquare;
					function ComposeNumberActionCreater(TargetPosition){
						return ()=>{
							TargetNumberSquare.remove();
							let NewNumberSquare=CreateNumber(CurrentNumberSquare.Number+1,TargetPosition);
							CurrentNumberSquare.remove();
							EmptySquareNumber++;
							if(NewNumberSquare.Number==N2048){
								NewNumberSquare.Promise=NewNumberSquare.Promise.then(()=>{
									ChallengeResult.getElementsByClassName('Win')[0].style.display = 'block';
									ChallengeResult.style.display = 'block';
									throw true;
								});
							}
							return NewNumberSquare.Promise;
						}
					}
					if(TargetNumberSquare==null){
						MoveNumber();
					}
					else if(TargetNumberSquare.Number==CurrentNumberSquare.Number){
						CurrentNumberSquare.style.zIndex=2;
						MoveNumber(ComposeNumberActionCreater(TargetPosition));
						TargetPosition=Board[${Axis[4]}+${Axis[5]}];
					}
					else{
						TargetPosition=Board[${Axis[4]}+${Axis[5]}];
						if(TargetPosition!=CurrentPosition){
							continue;
						}
					}
				}
				j${Direction[6]};
			}
		}
		await Promise.all(Promises);
		if(HaveChange){
			await GenerateNewNumber();
		}
		Changing=false;
	`);
	}
	ToLeft = OperationCreater(ROW, NEGATIVE);
	ToRight = OperationCreater(ROW, POSITIVE);
	ToUp = OperationCreater(COLUMN, NEGATIVE);
	ToDown = OperationCreater(COLUMN, POSITIVE);

	const EmptyFunc = () => { };
	document.addEventListener('keyup', event => {
		if (Changing) {
			return;
		}
		switch (event.code) {
			case 'ArrowUp':
			case 'KeyW':
				ToUp().catch(EmptyFunc);
				event.preventDefault();
				break;
			case 'ArrowDown':
			case 'KeyS':
				ToDown().catch(EmptyFunc);
				event.preventDefault();
				break;
			case 'ArrowLeft':
			case 'KeyA':
				ToLeft().catch(EmptyFunc);
				event.preventDefault();
				break;
			case 'ArrowRight':
			case 'KeyD':
				ToRight().catch(EmptyFunc);
				event.preventDefault();
				break;
		}
	});
	document.addEventListener('mousedown', event => {
		OperationStartPosition[0] = event.clientX;
		OperationStartPosition[1] = event.clientY;
	});
	function CheckDrawingOperation(pointer, event) {
		let dx = pointer.clientX - OperationStartPosition[0];
		let dy = pointer.clientY - OperationStartPosition[1];
		if (dx * dx > 4 * dy * dy) {
			if (dx > MouseMinMovementDistance) {
				ToRight().catch(EmptyFunc);
				event.preventDefault();
			}
			else if (dx < -MouseMinMovementDistance) {
				ToLeft().catch(EmptyFunc);
				event.preventDefault();
			}
		}
		else if (dy * dy > 4 * dx * dx) {
			if (dy > MouseMinMovementDistance) {
				ToDown().catch(EmptyFunc);
				event.preventDefault();
			}
			else if (dy < -MouseMinMovementDistance) {
				ToUp().catch(EmptyFunc);
				event.preventDefault();
			}
		}
	}
	document.addEventListener('mouseup', event => {
		CheckDrawingOperation(event, event);
	});
	document.addEventListener('touchstart', event => {
		if (event.touches.length == 1) {
			OperationStartPosition[0] = event.changedTouches[0].clientX;
			OperationStartPosition[1] = event.changedTouches[0].clientY;
		}
		else {
			OperationStartPosition = [];
		}
	});
	document.addEventListener('touchmove', event => {
		event.preventDefault();
	}, {
		passive: false
	});
	document.addEventListener('touchend', event => {
		CheckDrawingOperation(event.changedTouches[0], event);
	})

	ChallengeResult.addEventListener('click', ResetChallengeResult);

	document.addEventListener('selectstart', event => {
		event.preventDefault();
	})

	Title.getElementsByTagName('button')[0].addEventListener('click', ReStart);
	Start();

	let accessStatisticsList = ['https://visitor-badge.laobi.icu/badge?page_id=SorryYearnt.2048&right_color=green&left_text=Visitors', 'https://count.getloli.com/get/@SorryYearnt.2048?theme=moebooru'];
	accessStatisticsList.forEach(async (value, index, array) => {
		let accessStatistics = new Image();
		accessStatistics.alt = '访问统计';
		accessStatistics.unavailable = false;
		accessStatistics.index = index;
		accessStatistics.addEventListener('error', event => {
			accessStatistics.unavailable = true;
			accessStatistics.whenError?.();
		});
		await (array[index] = accessStatistics);
		accessStatistics.src = value;
	});
	let accessStatisticsDiv = document.getElementsByClassName('access-statistics')[0];
	accessStatisticsDiv.append(accessStatisticsList[0]);
	function replaceByNextAccessStatistics() {
		for (let i = this.index + 1; i < accessStatisticsList.length; i++) {
			if (!accessStatisticsList[i].unavailable) {
				accessStatisticsDiv.replaceChildren(accessStatisticsList[i]);
				accessStatisticsList[i].whenError = replaceByNextAccessStatistics;
				break;
			}
		}
	}
	accessStatisticsList[0].whenError = replaceByNextAccessStatistics;
}

function Start() {
	Promise.all([GenerateNewNumber(), GenerateNewNumber()]).then(() => {
		Changing = false;
	});
}

function GenerateNewNumber() {
	let Index = Math.floor(Math.random() * EmptySquareNumber);
	let NewNumber = Math.random() < 0.9 ? N2 : N4;
	let NewNumberSquare = CreateNumber(NewNumber, NumberPositions.find((element, index, array) => {
		if (element.NumberSquare == null) {
			if (Index == 0) {
				return true;
			}
			Index--;
		}
	}));
	if (NewNumber == N4) {
		NewNumberSquare.classList.add('Generate');
	}
	EmptySquareNumber--;
	function CheckLose() {
		if (EmptySquareNumber == 0) {
			for (let i = 0; i < 4; i++) {
				for (let j = 0; j < 4; j++) {
					if (Board[i][j].NumberSquare.Number == Board?.[i + 1]?.[j]?.NumberSquare?.Number || Board[i][j].NumberSquare.Number == Board[i]?.[j + 1]?.NumberSquare?.Number) {
						return;
					}
				}
			}
			NewNumberSquare.Promise = NewNumberSquare.Promise.then(() => {
				ChallengeResult.getElementsByClassName('Lose')[0].style.display = 'block';
				ChallengeResult.style.display = 'block';
				throw false;
			});
		}
	}
	CheckLose();
	return NewNumberSquare.Promise;
}

function CreateNumber(Number, NumberPosition) {
	let NewNumberSquare = Store.children[Number].cloneNode(true);
	NewNumberSquare.Number = Number;
	Numbers.appendChild(NewNumberSquare);
	function atEnd(event) {
		this.Resolve();
	}
	NewNumberSquare.addEventListener('transitionend', atEnd);
	NewNumberSquare.addEventListener('animationend', atEnd);
	MoveNumberSquare(NumberPosition, NewNumberSquare);
	return NewNumberSquare;
}

function MoveNumberSquare(TargetPosition, NumberSquare) {
	NumberSquare.Promise = new Promise((resolutionFunc, rejectionFunc) => {
		NumberSquare.Resolve = resolutionFunc;
	});
	TargetPosition.NumberSquare = NumberSquare;
	NumberSquare.Position = TargetPosition;
	NumberSquare.style.left = TargetPosition.StyleLeft;
	NumberSquare.style.top = TargetPosition.StyleTop;
	return NumberSquare.Promise;
}

function ReStart() {
	Numbers.innerHTML = '';
	NumberPositions.forEach(element => {
		element.NumberSquare = null;
	});
	EmptySquareNumber = 16;
	ResetChallengeResult();
	Start();
}

function Resize() {
	if (innerWidth * 1.35 <= innerHeight) {
		document.body.style.backgroundColor = '#CACFD2';
		WaterMark.style.display = 'none';
		document.documentElement.style.fontSize = document.documentElement.clientWidth * 0.8 * 0.1 + 'px';
		Title.children[0].style.textAlign = 'left';
		Title.children[1].style.padding = 0;
		Title.children[2].style.right = 0;
	}
	else {
		document.body.style.backgroundColor = null;
		WaterMark.style.display = null;
		document.documentElement.style.fontSize = document.documentElement.clientHeight * 0.9 / 13.5 + 'px';
		Title.children[0].style.textAlign = null;
		Title.children[1].style.padding = null;
		Title.children[2].style.right = null;
	}
}

function ResetChallengeResult() {
	ChallengeResult.style = null;
	ChallengeResult.children[0].style = null;
	ChallengeResult.children[1].style = null;
}

addEventListener('load', Initialize);

console.log('本网页由SorryYearnt制作，转载请注明出处。');
console.log('This web page is produced by SorryYearnt. Please indicate the source for reprinting.');
console.log('このページはSorryYearntで作成されています。転載は出典を明記してください。');	
