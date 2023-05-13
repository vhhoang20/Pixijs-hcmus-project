const app = new PIXI.Application({width: window.innerWidth, height: window.innerHeight});
document.body.appendChild(app.view);

const container = new PIXI.Container();
app.stage.addChild(container);

const carTexture = PIXI.Texture.from('data/car.png');
const obstacleTexture = PIXI.Texture.from('data/obstacle.png');
const trackTexture = PIXI.Texture.from('data/track.png');
let obstacles = [];

const columnWidth = app.renderer.width / 12;
const columnHeight = app.renderer.height;

let isGameOver = false;
let score = 0;
let scoreText;
let score_interval;
let obstacle_interval;
let car_speed = 5;

setup();

function setup() {
	divide_column();

	scoreText = new PIXI.Text('Score: 0', {
		fill: 'white',
		fontSize: 50,
	});
	scoreText.position.set(app.renderer.width / 9, app.renderer.height / 3); // Vị trí hiển thị điểm
	container.addChild(scoreText);

	// Tạo xe
	car = new PIXI.Sprite(carTexture);
	car.width = 80;
	car.height = 130;
	car.position.set(app.renderer.width / 2, app.renderer.height - 100);
	car.anchor.set(0.5);
	container.addChild(car);

	score_interval = setInterval(updateScore, 500);
	obstacle_interval = setInterval(createObstacle, 2000);
	app.ticker.add(gameLoop);
	app.ticker.add(moving_obstacle);
	// app.ticker.add(() => {
	// 	for (const obstacle of obstacles) {
	// 		// Di chuyển đối tượng xuống dưới với tốc độ cố định
	// 		obstacle.y += car_speed;
			
	// 		// Kiểm tra nếu đối tượng đi qua màn hình, đặt lại vị trí ban đầu
	// 		if (obstacle.y > app.renderer.height) {
	// 			// Xóa các đối tượng vật cản trước đó khỏi container
	// 			container.removeChild(obstacle);
	// 			obstacles.splice(obstacles.indexOf(obstacle), 1);
	// 		}

	// 		// Kiểm tra va chạm với xe
	// 		if (checkCollision(car, obstacle)) {
	// 			gameOver();
	// 		}
	// 	}
	// });
	

	// Bắt sự kiện bàn phím
	document.addEventListener('keydown', onKeyDown);
	document.addEventListener('keyup', onKeyUp);
}

function moving_obstacle() {
	for (const obstacle of obstacles) {
		// Di chuyển đối tượng xuống dưới với tốc độ cố định
		obstacle.y += car_speed;
		
		// Kiểm tra nếu đối tượng đi qua màn hình, đặt lại vị trí ban đầu
		if (obstacle.y > app.renderer.height) {
			// Xóa các đối tượng vật cản trước đó khỏi container
			container.removeChild(obstacle);
			obstacles.splice(obstacles.indexOf(obstacle), 1);
		}

		// Kiểm tra va chạm với xe
		if (checkCollision(car, obstacle)) {
			gameOver();
		}
	}
}

// Hàm cập nhật điểm
function updateScore() {
	score++; // Cập nhật điểm
	scoreText.text = 'Score: ' + score; // Cập nhật hiển thị điểm trên scoreText
}

function divide_column() {
	// Tạo các cột
	const column1 = new PIXI.Graphics();
	column1.beginFill(0xCCCCCC);
	column1.drawRect(columnWidth * 4, 0, columnWidth, columnHeight);
	column1.endFill();

	const column2 = new PIXI.Graphics();
	column2.beginFill(0xCCCCCC);
	column2.drawRect(columnWidth * 5, 0, columnWidth, columnHeight);
	column2.endFill();

	const column3 = new PIXI.Graphics();
	column3.beginFill(0xCCCCCC);
	column3.drawRect(columnWidth * 6, 0, columnWidth, columnHeight);
	column3.endFill();

	const column4 = new PIXI.Graphics();
	column4.beginFill(0xCCCCCC);
	column4.drawRect(columnWidth * 7, 0, columnWidth, columnHeight);
	column4.endFill();

	// Thêm các cột vào container
	container.addChild(column1, column2, column3, column4);

	// Tạo đường kẻ giữa các cột
	const lineGraphics = new PIXI.Graphics();
	lineGraphics.lineStyle(5, 0xFF0000); // Màu và độ dày đường kẻ
	lineGraphics.moveTo(columnWidth * 5, 0);
	lineGraphics.lineTo(columnWidth * 5, columnHeight);
	lineGraphics.moveTo(columnWidth * 6, 0);
	lineGraphics.lineTo(columnWidth * 6, columnHeight);
	lineGraphics.moveTo(columnWidth * 7, 0);
	lineGraphics.lineTo(columnWidth * 7, columnHeight);

	// Thêm đường kẻ vào container
	container.addChild(lineGraphics);
}

function createObstacle() {
	const number_obstacle = Math.floor(Math.random() * 3) + 1;
	const columns = [columnWidth * 4.5, columnWidth * 5.5, columnWidth * 6.5, columnWidth * 7.5];

	for (let i = 0; i < number_obstacle; i++)
	{
		const obstacle = new PIXI.Sprite(obstacleTexture);
		const index = Math.floor(Math.random() * columns.length);

		obstacle.width = 100;
		obstacle.height = 150;
		obstacle.position.set(columns[index], 100);
		obstacle.anchor.set(0.5);

		columns.splice(index, 1);

		container.addChild(obstacle);
		obstacles.push(obstacle);
	}
}

function checkCollision(spriteA, spriteB) {
	const boundsA = spriteA.getBounds();
	const boundsB = spriteB.getBounds();
  
	return (
	  boundsA.x + boundsA.width > boundsB.x &&
	  boundsA.x < boundsB.x + boundsB.width &&
	  boundsA.y + boundsA.height > boundsB.y &&
	  boundsA.y < boundsB.y + boundsB.height
	);
}

// Function to handle game over
function gameOver() {
	// Stop the game loop
	app.ticker.remove(gameLoop);
	app.ticker.remove(moving_obstacle);

	clearInterval(score_interval);
	clearInterval(obstacle_interval);

	isGameOver = true;
  
	// Display game over message
	const gameOverText = new PIXI.Text('Game Over', {
	  fill: 'black',
	  fontSize: 48,
	  fontWeight: 'bold',
	});
	gameOverText.anchor.set(0.5);
	gameOverText.position.set(app.renderer.width / 2, app.renderer.height / 2);
	container.addChild(gameOverText);
  
	// Create a play again button
	const playAgainButton = new PIXI.Graphics();
	playAgainButton.beginFill(0xCCCCCC);
	playAgainButton.drawRect(app.renderer.width / 2 - 100, app.renderer.height / 2 + 50, 200, 50);
	playAgainButton.endFill();
  
	const playAgainText = new PIXI.Text('Play Again', {
	  fill: 'black',
	  fontSize: 24,
	  fontWeight: 'bold',
	});
	playAgainText.anchor.set(0.5);
	playAgainText.position.set(app.renderer.width / 2, app.renderer.height / 2 + 75);
	container.addChild(playAgainButton, playAgainText);
  
	// Add click event listener to play again button
	playAgainButton.interactive = true;
	playAgainButton.buttonMode = true;
	playAgainButton.on('click', resetGame);
}
  
// Function to reset the game
function resetGame() {
	isGameOver = false;
  
	// Remove all game objects from the container
	container.removeChildren();
  
	score = 0;
	obstacles = [];
  
	// Remove event listeners for keydown and keyup events
	document.removeEventListener('keydown', onKeyDown);
	document.removeEventListener('keyup', onKeyUp);
	car_speed = 5;
	setup();
	// // Clear the car's position and key states
	// car.position.set(app.renderer.width / 2, app.renderer.height - 100);
	// isLeftKeyDown = false;
	// isRightKeyDown = false;
  
	// // Add event listeners for keydown and keyup events
	// document.addEventListener('keydown', onKeyDown);
	// document.addEventListener('keyup', onKeyUp);
  
	// // Re-create game elements and add them to the container
	// divide_column();
	// container.addChild(car);
  
	// // Start game loop and obstacle creation interval
	// app.ticker.add(gameLoop);
}
  
// Điều khiển xe di chuyển
let isLeftKeyDown = false;
let isRightKeyDown = false;

function onKeyDown(event) {
	if (event.key === 'ArrowLeft') {
		isLeftKeyDown = true;
	} else if (event.key === 'ArrowRight') {
		isRightKeyDown = true;
	}
}

function onKeyUp(event) {
	if (event.key === 'ArrowLeft') {
		isLeftKeyDown = false;
	} else if (event.key === 'ArrowRight') {
		isRightKeyDown = false;
	}
}

// Vòng lặp game
function gameLoop(delta) {
	// Di chuyển xe dựa trên sự kiện bàn phím
	if (isLeftKeyDown) {
		car.x -= delta * 15;
	} else if (isRightKeyDown) {
		car.x += delta * 15;
	}
	
	// Kiểm tra vị trí xe và giới hạn trong 6 cột
	const laneWidth = app.renderer.width / 12;
	const minLane = laneWidth * 4.5; // Cột đầu tiên
	const maxLane = laneWidth * 7.5; // Cột cuối cùng

	// Giới hạn di chuyển của xe trong phạm vi đường đua
	if (car.x < minLane) {
		car.x = minLane;
	} else if (car.x > maxLane) {
		car.x = maxLane;
	}
}