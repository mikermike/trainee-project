var app = angular.module("MyApp", []);

var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");

var gravity = 0.7;

var angle = 0;

var gamevelocity = 7;
var globaltimer = 0;



var player = { x: c.width / 2, y: 50, width: 50, height: 50, velY: 0, speed: 10, jumping: true, jumpcycle:false, death:false};


(function () {
    var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    window.requestAnimationFrame = requestAnimationFrame;
})();


app.controller("cubegame", function ($scope) {

    document.body.onkeydown = function (e) {
        if (e.keyCode == 32) {
           // console.log("SPACEBAR");
            if (!player.jumping) {
                player.jumping = true;
                player.jumpcycle = true;
                jumpframes = 0;
                player.velY = -player.speed * 2;
            };
        };
    };


    // PARTICLE
    var particles = [];

    function Particle(x, y, vel, size) {
        this.x = x;
        this.y = y;
        this.vel = vel;
        this.size = size;


        this.update = function () {
            ctx.save();
            ctx.translate(this.x, this.y);
 
            if (player.jumping == false) {
                ctx.fillStyle = "#b83bff";
            } else {
                ctx.fillStyle = "#ff9900";
            }

            ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
            ctx.restore();

            this.x -= vel
            if (this.size > 0) {
                this.size -= 1;
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

    //FLOOR
    var floortiles = [];
    var refFloorTile = new floortile;
    var floorInit = false;
    
    function floortile(x, y, size) {
        this.x = x;
        this.y = y;
        this.size = 50;
        var grd = ctx.createLinearGradient(0, 0, 50, 0);
        grd.addColorStop(0, "black");
        grd.addColorStop(1, "red");
    
       
        this.update = function () {
            ctx.save();
            ctx.translate(this.x, this.y);

            ctx.fillStyle = grd;

            ctx.fillRect(0, 0, this.size, this.size);
            ctx.restore();

            this.x -= gamevelocity;
            
        };
    };

    function TileUpdate() {

        if (floorInit == false) {
            var tilelocation = 0;
            for (var i = 0; i < c.width / refFloorTile.size; i++) {
                floortiles.push(new floortile(0 + tilelocation, c.height - refFloorTile.size));
                tilelocation += refFloorTile.size;
            };
            floorInit = true;
        };
       
        if (floorInit == true && floortiles[floortiles.length - 1].x < c.width - refFloorTile.size) {
           floortiles.push(new floortile(floortiles[floortiles.length - 1].x + refFloorTile.size, c.height - refFloorTile.size));
        }; 
      
        if (floortiles.length > (c.width / refFloorTile.size) + 5) {
            floortiles.splice(0, 2)
        };

        for (var i = 0; i < floortiles.length; i++) {
            floortiles[i].update();
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
            ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
            ctx.restore();
            this.x -= gamevelocity;
        };
        this.collisionCheck = function () {
            if (player.x - (player.width / 2) <= this.x + (this.size / 2) && player.x + (player.width / 2) >= this.x - (this.size / 2)) {
               
                if (player.y - (player.width / 2) < this.y + (this.size / 2) && player.y + (player.width / 2) > this.y - (this.size / 2)) {
                    console.log("HIT");
                };
               
            };
        };
    };

   
    function BoxUpdate() {
        if ((globaltimer / 100) % 1 === 0) {
        //    boxes.push(new Box(1280, c.height - player.height, 50))
           // testtimer = 0;
        };
        for (var i = 0; i < boxes.length; i++) {
            boxes[i].update();
            boxes[i].collisionCheck();
        }
    };

    var platforms = [];
    //PLATFORM >>>>
    function Platform(x, y, sizeX, sizeY) {
        this.x = x;
        this.y = y-=sizeY;
        this.sizeX = sizeX;
        this.sizeY = sizeY;

        this.update = function () {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.fillStyle = "#3377ff";
            ctx.fillRect(0, 0, this.sizeX, this.sizeY);
            ctx.restore();
            this.x -= gamevelocity;
            
        };
        this.collisionCheck = function () {
            if (player.x + (player.width / 2) > this.x + 10 && player.x + (player.width / 2) < this.x + (player.width / 2)) {
               if (player.y + (player.width / 2) > this.y+2 && player.y + (player.width / 2) < this.y + this.sizeY) {
                    console.log("HIT-platform");
                };

            };
        };
    }

    function PlatformUpdate() {
        if ((globaltimer / 200) % 1 === 0) {
            platforms.push(new Platform(1280, c.height, 100 + Math.floor((Math.random() * 10)) * 50, 100 + Math.floor(Math.random() * 5 )* 50));
        };

        if (platforms.length > 10) {
            platforms.splice(0, 2)
        };

        for (var i = 0; i < platforms.length; i++) {
            platforms[i].update();
            platforms[i].collisionCheck();
        }
       
    };

    var value1 = 0;
    //PLAYER
    function PlayerUpdate() { 
        player.velY += gravity;
        player.y += player.velY;

        if (player.y >= c.height - (player.height*1.5)) {
            player.y = c.height - (player.height*1.5);
            player.jumping = false;
            player.velY = 0;
        };

        // PLATFORM CHECK
        
        for (var i = 0; i < platforms.length; i++) {
           // console.log(platforms[i].x);
            if (player.x + (player.width / 2) > platforms[i].x && player.x - (player.width / 2) < platforms[i].x + platforms[i].sizeX && player.death == false) {
                if (player.y + (player.height / 2) >= platforms[i].y && player.y + (player.height / 2) < platforms[i].y + 20) {
                    player.y = platforms[i].y - (player.height/2);
                    player.jumping = false;
                    player.velY = 0;
                    angle = 0;
                };

            };
        };

        ctx.save();
        ctx.translate(player.x, player.y);

        if (angle < 358 && player.jumpcycle == true) {
            angle = (-Math.cos(value1) + 1) * 180;
            value1 += 0.08;
        };

        if (angle > 358 ) {
            angle = 0;
            value1 = 0;
            player.jumpcycle = false;
        };

        ctx.rotate(angle * (Math.PI / 180));
       
        ctx.fillStyle = "#FF0000";
        ctx.stroke();
        ctx.fillRect(-(player.width / 2), -(player.height / 2), player.width, player.height);

        ctx.fillStyle = "#0bd5a3";
        ctx.fillRect(-player.width / 2, -(player.height / 2), 10, 10);
        ctx.fillRect((player.width / 2)-10, (player.height / 2)-10, 10, 10);

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

    
        PlatformUpdate();
        BoxUpdate();
        fgUpdate();
     
        TileUpdate();

        globaltimer++;
        requestAnimationFrame(Update);
    };


window.addEventListener("load", function () {
    Update();

});
 

// TEST UPDATE FUNCTION ---------
    function Update2() {
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
            
        requestAnimationFrame(Update2);
    }

    
    var angle2 = 0;
    function Update3() {
        if (angle2 < 358) {
            angle2 = (-Math.cos(value1) + 1) * 180;
            console.log(angle2);
            value1 += 0.08;
        } else {
            
        };
        requestAnimationFrame(Update3);
    };

});


