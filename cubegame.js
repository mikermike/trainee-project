var app = angular.module("MyApp", []);

var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");

var gravity = 0.5;
var angle = 0;

var player = { x: c.width / 2, y: 50, width: 50, height: 50, velY: 0, speed: 10, jumping: true, jumpcycle:false};


(function () {
    var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    window.requestAnimationFrame = requestAnimationFrame;
})();


app.controller("cubegame", function ($scope) {

    document.body.onkeyup = function (e) {
        if (e.keyCode == 32) {
            console.log("SPACEBAR");
            if (!player.jumping) {
                player.jumping = true;
                player.jumpcycle = true;
                player.velY = -player.speed * 2;

            }
        }
    }


    // PARTICLE
    var particles = [];

    function Particle(x, y, vel, size) {
        this.x = x;
        this.y = y;
        this.vel = vel;
        this.size = size;

        this.update = function () {
            ctx.save();
            ctx.translate(x, y);
           // ctx.fillStyle = "#b83bff";
            if (player.jumping == false) {
                ctx.fillStyle = "#b83bff";
            } else {
                ctx.fillStyle = "#ff9900";
            }

            ctx.fillRect(-size / 2, -size / 2, size, size);
            ctx.restore();

            x -= vel
            if (size > 0) {
                size -= 1;
            };
        };
    };

    function ParticleUpdate() {
        if (particles.length <= 30) {
            particles.push(new Particle(player.x, player.y + (Math.random() * 20), 5, 20));
        };

        if (particles.length > 25) {
            particles.splice(0, 5)
        };

        for (var i = 0; i < particles.length; i++) {
            particles[i].update();
        }
    };

    var boxes = [];
    var testtimer = 0;

    //BOXES
    function Box(x, y, size) {
        this.x = x;
        this.y = y;
        this.size = size;

        this.update = function () {
            ctx.save();
            ctx.translate(x, y);
            ctx.fillStyle = "#b83bff";
            ctx.fillRect(-size / 2, -size / 2, size, size);
            ctx.restore();
            x -= 10;
        };
        this.collisionCheck = function () {
            if (player.x - (player.width / 2) <= x + (size / 2) && player.x + (player.width / 2) >= x - (size / 2)) {
               
                if (player.y - (player.width / 2) < y + (size / 2) && player.y + (player.width / 2) > y - (size / 2)) {
                    console.log("HIT");
                };
               
            };
        };
    };

   
    function BoxUpdate() {
        if (testtimer > 100) {
            boxes.push(new Box(1280, c.height - player.height, 50))
            testtimer = 0;
        };
        for (var i = 0; i < boxes.length; i++) {
            boxes[i].update();
            boxes[i].collisionCheck();
        }
        testtimer +=1
    };

    //PLAYER
    function PlayerUpdate() { 
        player.velY += gravity;
        player.y += player.velY;

        if (player.y >= c.height - player.height) {
            player.y = c.height - player.height;
            player.jumping = false;
        }

        ctx.save();
        ctx.translate(player.x, player.y);
        ctx.rotate(angle * Math.PI / 180);
        
        if (player.jumping == true && player.jumpcycle == true) {
            angle += 10;
        }

        if (angle >= 360) {
            angle = 0;
            player.jumpcycle = false;
        };

        ctx.fillStyle = "#FF0000";
        ctx.stroke();
        ctx.fillRect(-(player.width / 2), -(player.height / 2), player.width, player.height);

        ctx.restore();
    };

    // background
    function bgUpdate() {

    };

    // forground
    function fgUpdate() {
        ParticleUpdate();
        PlayerUpdate();
    };

    function Update() {
        ctx.clearRect(0, 0, c.width, c.height);

        bgUpdate();

        BoxUpdate();
        fgUpdate();
     
        requestAnimationFrame(Update);
    };

window.addEventListener("load", function () {
 Update();
});
 

// TEST UPDATE FUNCTION ---------
    function update2() {
        ctx.clearRect(0, 0, 1280, 720);

        angle += 0.01;
        // incrementAngle();
        ctx.save();
        ctx.lineWidth = 10;
        ctx.translate(200, 200);
        ctx.rotate(angle);

        ctx.fillStyle = "#FF0000";
        ctx.fillRect(-25, -25, 50, 50);
        ctx.strokeRect(-25, -25, 50, 50);
        ctx.restore();
        ctx.translate(0.5, 0)
            
        requestAnimationFrame(update2);
    }
});


