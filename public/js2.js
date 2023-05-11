// Khởi tạo PixiJS
const app = new PIXI.Application({ width: window.innerWidth, height: window.innerHeight });
document.body.appendChild(app.view);

// Tạo đường đua và xe
let track;
let car;

// Tải các tài nguyên
app.loader.add('track', './data/track.png')
          .add('car', './data/car.png')
          .load(setup);

function setup() {
  // Tạo đường đua
  track = new PIXI.Sprite(app.loader.resources['track'].texture);
  track.width = app.renderer.width;
  track.height = app.renderer.height;
  app.stage.addChild(track);

  // Tạo xe
  car = new PIXI.Sprite(app.loader.resources['car'].texture);
  car.position.set(app.renderer.width / 2, app.renderer.height - 50);
  car.anchor.set(0.5);
  app.stage.addChild(car);

  // Tạo menu
  menu = new PIXI.Container();
  app.stage.addChild(menu);
  let menuStyle = new PIXI.TextStyle({
    fill: 0x00000,
    fontSize: 36,
    fontFamily: "Comic Sans MS",
    fontStyle: "bold"
  })
  menuBox = PIXI.Sprite.from(PIXI.Texture.WHITE);
  menuBox.width = 300;
  menuBox.height = 200;
  menuBox.anchor.set(0.5);
  menuBox.x = app.view.width/2;
  menuBox.y = app.view.height/2;
  menuBox.tint = 0xff8c19;
  // menuBox.beginFill(0xFFFF00);
  // menuBox.lineStyle(5, 0xFFFF00);
  // menuBox.drawRect(app.renderer.width / 2 -40, app.renderer.width / 2 +40, app.renderer.height - 30, app.renderer.height +30);
  menu.addChild(menuBox);
  // Option 1: Play
  opt1 = new PIXI.Text("Play");
  opt1.anchor.set(0.5);
  opt1.x = app.view.width/2;
  opt1.y = app.view.height/2 - 30;
  opt1.style = menuStyle;
  opt1.interactive = true;
  opt1.click = function(e) {menu.visible = false}
  // Option 2: Instruction
  opt2 = new PIXI.Text("Instruction");
  opt2.anchor.set(0.5);
  opt2.x = app.view.width/2;
  opt2.y = app.view.height/2 + 10;
  opt2.style = menuStyle;
  opt2.interactive = true;
  opt2.click = function(e) {menu.visible = false; instruction.visible = true}

  menu.addChild(opt1, opt2)
  
  // Instruction option display
  instruction = new PIXI.Container();
  instruction.visible = false
  app.stage.addChild(instruction);
  guide = new PIXI.Text("Press left and right arrow to move the car and try to evade the obstacles");
  guide.anchor.set(0.5)
  guide.x = app.view.width/2;
  guide.y = app.view.height/2 - 60;
  guide.style = menuStyle;

  play = new PIXI.Text("Play");
  play.anchor.set(0.5);
  play.x = app.view.width/2;
  play.y = app.view.height/2;
  play.style = menuStyle;
  play.interactive = true;
  play.click = function(e) {instruction.visible = false}
  instruction.addChild(guide, play)

  // Bắt đầu vòng lặp chính
  app.ticker.add(gameLoop);

  // Bắt sự kiện bàn phím
  document.addEventListener('keydown', onKeyDown);
  document.addEventListener('keyup', onKeyUp);
  // Bắt sự kiện chuột
  //app.view.addEventListener('mousemove', onMouseMove);
}

let isLeftKeyDown = false;
let isRightKeyDown = false;

function onKeyDown(event) {
  if (event.key === 'ArrowLeft') {
    isLeftKeyDown = true;
  } else if (event.key === 'ArrowRight') {
    isRightKeyDown = true;
  }
  if(event.key === 'Escape') {
    menu.visible = true;
  }
}

function onKeyUp(event) {
  if (event.key === 'ArrowLeft') {
    isLeftKeyDown = false;
  } else if (event.key === 'ArrowRight') {
    isRightKeyDown = false;
  }
}

function onMouseMove(event) {
  const mouseX = event.clientX;
  const carX = mouseX - app.view.offsetLeft;

  car.x = carX;
}

function gameLoop(delta) {
  // Di chuyển xe dựa trên sự kiện bàn phím
  if (isLeftKeyDown) {
    car.x -= delta * 5;
  } else if (isRightKeyDown) {
    car.x += delta * 5;
  }

  // Giới hạn di chuyển của xe trong phạm vi đường đua
  if (car.x < 0) {
    car.x = 0;
  } else if (car.x > app.renderer.width) {
    car.x = app.renderer.width;
  }
}