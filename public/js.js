// Khởi tạo PixiJS
const app = new PIXI.Application({ width: window.innerWidth, height: window.innerHeight });
document.body.appendChild(app.view);

const carTexture = PIXI.Texture.from('data/car.png');
const obstacleTexture = PIXI.Texture.from('data/obstacle.png');
const trackTexture = PIXI.Texture.from('data/track.png');

const obstacles = [];
setup();

function setup() {
	// Tạo đường đua
	track = new PIXI.Sprite(trackTexture);
	// Tính toán kích thước cột và vị trí của 4 cột giữa
	columnWidth = app.renderer.width / 6;
	columnStart = columnWidth;
	columnEnd = columnWidth * 5;

	// Thiết lập vị trí và kích thước của sprite track
	track.position.set(columnStart, 0);
	track.width = columnEnd - columnStart;
	track.height = app.renderer.height;

	// Thêm sprite track vào stage
	app.stage.addChild(track);

	car = new PIXI.Sprite(carTexture);
	car.width = 150;
	car.height = 150;
	car.position.set(app.renderer.width / 2, app.renderer.height - 50);
	car.anchor.set(0.5);
	app.stage.addChild(car);

	for (let i = 0; i < 3; i++) {
		obstacle = new PIXI.Sprite(obstacleTexture);
		obstacle.width = 100;
		obstacle.height = 100;
		obstacle.position.set(app.renderer.width / (i+2), -obstacle.height); // Đặt vị trí ban đầu của đối tượng

		obstacles.push(obstacle); // Thêm đối tượng vào mảng

		app.stage.addChild(obstacle); // Thêm đối tượng vào stage
	}

	// // obstacles.push(obstacle);
	app.ticker.add(() => {
		for (const obstacle of obstacles) {
			// Di chuyển đối tượng xuống dưới với tốc độ cố định
			obstacle.y += 5;
	
			// Kiểm tra nếu đối tượng đi qua màn hình, đặt lại vị trí ban đầu
			if (obstacle.y > app.renderer.height) {
				obstacle.y = -obstacle.height;
			}
		}
	});

	app.ticker.add(gameLoop);

	// Bắt sự kiện bàn phím
	document.addEventListener('keydown', onKeyDown);
	document.addEventListener('keyup', onKeyUp);
}

function createObstacle() {
	if (obstacles.length >= 3) {
	  return; // Không tạo thêm xe nếu đã đạt giới hạn
	}
  
	const obstacle = new PIXI.Sprite(obstacleTexture);
	obstacle.anchor.set(0.5);
	obstacle.position.set(Math.random() * (app.renderer.width - 100) + 50, 100);
	app.stage.addChild(obstacle);
	obstacles.push(obstacle);
}
  
function updateObstacles() {
	for (let i = obstacles.length - 1; i >= 0; i--) {
	  const obstacle = obstacles[i];
	  obstacle.y += 5; // Tốc độ di chuyển của obstacles
  
	  // Kiểm tra va chạm giữa car và obstacle
	  if (isCollision(car, obstacle)) {
		// Xử lý va chạm
		console.log('Collision detected');
	  }
  
	  // Kiểm tra nếu obstacle đi qua màn hình
	  if (obstacle.y > app.renderer.height + 50) {
		app.stage.removeChild(obstacle);
		obstacles.splice(i, 1);
	  }
	}
}

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

function gameLoop(delta) {
	// Di chuyển xe dựa trên sự kiện bàn phím
	if (isLeftKeyDown) {
		car.x -= delta * 15;
	} else if (isRightKeyDown) {
		car.x += delta * 15;
	}

	// Kiểm tra vị trí xe và giới hạn trong 6 cột
	const laneWidth = app.renderer.width / 6;
	const minLane = laneWidth * 1.5; // Cột đầu tiên
	const maxLane = laneWidth * 5; // Cột cuối cùng

	// Giới hạn di chuyển của xe trong phạm vi đường đua
	if (car.x < minLane) {
		car.x = minLane;
	} else if (car.x > maxLane) {
		car.x = maxLane;
	}
}