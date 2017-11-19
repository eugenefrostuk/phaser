var game = null,
    platforms = null,
    stars = null,
    ground = null,
    ledges = null,
    player = null,
    cursors = null,
    score = 0,
    scoreInfo = null;

window.onload = function () {
    game = new Phaser.Game(800, 550, Phaser.AUTO, '',
        { preload: preload, create: create, update: update });
}

function preload() {
    game.load.image('sky', 'assets/sky.png');
    game.load.image('ground', 'assets/platform.png');
    game.load.image('star', 'assets/star.png');
    game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
}

function create() {
    enableKeyboard();
    enablePhysics();
    createBG();
    createPlatforms();
    createStars();
    createPlayer();
    createScoreInfo();
}

function enableKeyboard() {
    cursors = game.input.keyboard.createCursorKeys();
}

function enablePhysics() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
}

function createBG() {
    game.add.sprite(0, 0, 'sky');
}

function createPlatforms() {
    platforms = game.add.group();
    platforms.enableBody = true;

    ground = platforms.create(0, game.world.height - 64, 'ground');
    ground.scale.setTo(2, 2);
    ground.body.immovable = true;

    ledges = [];
    ledges[0] = platforms.create(400, 400, 'ground');
    ledges[0].body.immovable = true;
    ledges[1] = platforms.create(-150, 250, 'ground');
    ledges[1].body.immovable = true;
}

function createStars() {
    stars = game.add.group();
    stars.enableBody = true;
    for (let i = 0; i < 12; i++) {
        let star = stars.create(i * 70, 0, 'star');
        star.body.gravity.y = 10 + Math.random() * 15;
        star.body.bounce.y = 0.25 + Math.random() * 0.25;
        star.body.collideWorldBounds = true;
    }
}

function createPlayer() {
    player = game.add.sprite(32, game.world.height - 150, 'dude');

    game.physics.arcade.enable(player);

    player.body.bounce.y = 0.2;
    player.body.gravity.y = 300;
    player.body.collideWorldBounds = true;

    player.animations.add('left', [8, 7, 2, 3], 10, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);
}

function createScoreInfo() {
    scoreInfo = game.add.text(16, 16, 'score: 0', 
            { fontSize: '32px', fill: '#000' });
}

function update() {
    collide();
    moveDude();
}

function collide() {
    game.physics.arcade.collide(player, platforms);
    game.physics.arcade.collide(stars, platforms);
    game.physics.arcade.overlap(player, stars, collectStar, null, this);
}

function moveDude() {
    if (cursors.left.isDown) {
        player.body.velocity.x = -150;
        player.animations.play('left');
    } else if (cursors.right.isDown) {
        player.body.velocity.x = 150;
        player.animations.play('right');
    } else {
        player.body.velocity.x = 0;
        player.animations.stop();
        player.frame = 4;
    }

    if (cursors.up.isDown && player.body.touching.down) {
        player.body.velocity.y = -350;
    }
}

function collectStar(player, star) {
    star.kill();
    score += 10;
    scoreInfo.text = 'Score: ' + score;
}