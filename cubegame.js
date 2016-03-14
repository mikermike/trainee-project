var app = angular.module("MyApp", []);

var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");

var gravity = 1.7;

var angle = 0;
var rotationSpeed = 0;

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
            jump();
            
        };

    };
  
    document.body.onkeyup = function (e) {
        if (e.keyCode == 32) {
            jump();
            
        };
    };

    function jump() {
        // console.log("SPACEBAR");
        if (!player.jumping && player.velY < 1) {
            player.jumping = true;
            player.jumpcycle = true;
            jumpframes = 0;
            player.velY = -player.speed * 2.9;
        };
        
    };
    // Background
    var bgBoxes = [];
    var bgparticles = [];

    function bgParticle(x, y, vel, size) {
        this.x = x;
        this.y = y;
        this.vel = vel;
        this.size = size;
        this.randomVal = (Math.random() * 50) + 20;

        this.boxUpdate = function () {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.globalAlpha = (Math.sin(globaltimer / 200) + 1) / 10 + 0.05;
            ctx.fillRect(0, 0, this.size, this.size);
            ctx.restore();

            this.x -= gamevelocity * 0.95 + (vel / 5);
        };

        this.ptUpdate = function () {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.globalAlpha = (Math.sin(globaltimer / 50) + 1) / 20 + 0.1;
            ctx.fillStyle = "#FFFFF";
            // ctx.rotate(globaltimer/100);
            ctx.fillRect(0, 0, this.size, this.size);
            ctx.restore();

            this.x -= gamevelocity * 1.5;
            this.y += Math.sin(globaltimer / this.randomVal);
        };
    };
   
    var grd3 = ctx.createLinearGradient(0, 0, 0, c.height);
    grd3.addColorStop(0, "#669cff");
    grd3.addColorStop(1, "#00091a");

    function backgroundUpdate() {
        ctx.fillStyle = grd3;
        ctx.fillRect(0, 0, c.width, c.height);

        // bgparticles.push(new bgParticle(50, 50, 200));

        //------- boxes
        if (globaltimer / (gamevelocity * 2) % 1 === 0) {
            bgBoxes.push(new bgParticle(1280 + (Math.random() * 20), (Math.random() * c.height), Math.random() * 3, 100 + Math.random() * 400));
        };

        if (bgBoxes.length > 45) {
            bgBoxes.splice(0, 5)
        };

        for (var i = 0; i < bgBoxes.length; i++) {

            bgBoxes[i].boxUpdate();
        };

        //-------- particles
        if (globaltimer / (gamevelocity / 2) % 1 === 0) {
            bgparticles.push(new bgParticle(1280, Math.random() * c.height - 100, 1, 10));
        };

        if (bgparticles.length > 45) {
            bgparticles.splice(0, 5)
        };

        for (var i = 0; i < bgparticles.length; i++) {

            bgparticles[i].ptUpdate();
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
        grd.addColorStop(0, "#000080");
        grd.addColorStop(1, "#0000b3");
        
        ctx.lineWidth = "1";
        ctx.strokeStyle = "#000033";
       
        this.update = function () {
            //BOTTOM
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.fillStyle = grd;
            ctx.fillRect(0, 0, this.size, this.size);

            ctx.beginPath();
            ctx.rect(0, 0, this.size, this.size);
            ctx.stroke();

            ctx.restore();

            //TOP
            ctx.save();
            ctx.translate(this.x, this.y - c.height + refFloorTile.size);
            ctx.fillStyle = grd;
            ctx.fillRect(0, 0, this.size, this.size);

            ctx.beginPath();
            ctx.rect(0, 0, this.size, this.size);
            ctx.stroke();

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

    //BOXES>HAZARDS
    function Box(x, y, size) {
        this.x = x;
        this.y = y;
        this.size = size;

        this.update = function () {
            ctx.save();
            ctx.translate(this.x, this.y);

            ctx.fillStyle = "#b83bff";
            ctx.lineWidth = "2";
            ctx.strokeStyle = "#000033";
            // ctx.fillRect(0, -this.size / 2, this.size, this.size);
            
            ctx.beginPath();
            ctx.moveTo(25, -25);
            ctx.lineTo(0, 25);
            ctx.lineTo(50, 25);
            ctx.lineTo(25, -25);
            ctx.fill();
            ctx.stroke();
            
            ctx.restore();

            
            this.x -= gamevelocity;
        };
        this.collisionCheck = function () {
            if (player.x + (player.width / 2) >= this.x + (this.size / 2) && player.x + (player.width / 2) <= this.x + (this.size)) {
                if (player.y - (player.width / 2) < this.y + (this.size / 2) && player.y + (player.width / 2) > this.y - (this.size / 2)) {
                    console.log("HIT");
                };
            };
        };

        this.heightcheck = function () { //CHECK Platforms
         
            for (var i = 0; i < platforms.length; i++) {
                if (this.x >= platforms[i].x && this.x < platforms[i].x + platforms[i].sizeX && platforms[i].side == "bottom") {
                    this.y = c.height - platforms[i].sizeY - this.size/2;
                  
                };
            };
        };
    };

    var boxseed = 0;
    function BoxUpdate() {
        if ((globaltimer / (100 + (outputSeed[boxseed] * 20))) % 1 === 0) { // USES SEED TO CREATE OBJECTS
            console.log(outputSeed[boxseed] * 10);
            boxes.push(new Box(1280, c.height - player.height * 1.5, 50))
            if (boxseed < outputSeed.length - 1) {
                boxseed += 1;
              
            } else {
                boxseed = 0;
            };

        };

        if (boxes.length > 10) {
            boxes.splice(0, 2)
        };

        for (var i = 0; i < boxes.length; i++) {
            boxes[i].update();
            boxes[i].collisionCheck();
            boxes[i].heightcheck();
        }
     
    };
    var score = 0;
    // SCORES & TEXTS
    function ScoreUpdate() {
        if (globaltimer / 50 % 1 === 0) {
            score = globaltimer;
        }
        ctx.save();
        ctx.font = "30px Verdana";
        ctx.fillStyle = "white";
        ctx.fillText("Level Seed:" + seed + " - Score:" + score, 10, 40);
        ctx.restore();
    };


    var platforms = [];
    //PLATFORM >>>>
    function Platform(x, y, sizeX, sizeY,side) {
        this.x = x;
        this.y = y -= sizeY;
        this.sizeX = sizeX;
        this.sizeY = sizeY;
        this.side = side;

        this.update = function () {
            var grd2 = ctx.createLinearGradient(0, 0, 0, this.sizeY);
            grd2.addColorStop(0.2, "#00004d");
            grd2.addColorStop(0.3, "#000066");
            grd2.addColorStop(0.6, "#000066");
            grd2.addColorStop(1, "#00004d");

            //MAIN PLATFORM
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.fillStyle = grd2;
            ctx.fillRect(0, 0, this.sizeX, this.sizeY);
            ctx.restore();

            ctx.lineWidth = "1";
            ctx.strokeStyle = "#000033";

            //TOP-SIDES
            var grd = ctx.createLinearGradient(0, 0, 50, 50);
            grd.addColorStop(0, "#1a1aff");
            grd.addColorStop(1, "#4d4dff");

            for (var i = 0; i < this.sizeY / refFloorTile.size; i++) {
                //LEFT
                ctx.save();
                ctx.fillStyle = grd;
                ctx.translate(this.x, this.y + [i] * 50);
                ctx.fillRect(0, 0, refFloorTile.size, refFloorTile.size);

                ctx.beginPath();
                ctx.rect(0, 0, refFloorTile.size, refFloorTile.size);
                ctx.stroke();

                ctx.restore();

                //RIGHT
                ctx.save();
                ctx.fillStyle = grd;
                ctx.translate(this.x + this.sizeX - refFloorTile.size, this.y + [i] * 50);
                ctx.fillRect(0, 0, refFloorTile.size, refFloorTile.size);

                ctx.beginPath();
                ctx.rect(0, 0, refFloorTile.size, refFloorTile.size);
                ctx.stroke();

                ctx.restore();
            };
         
            for (var i = 0; i < (this.sizeX / refFloorTile.size) - 2; i++) {
                ctx.save();


                ctx.fillStyle = grd;

                if (side == "bottom") {
                    ctx.translate(this.x + refFloorTile.size + [i] * 50, this.y);
                };
                if (side == "top") {
                    ctx.translate(this.x + refFloorTile.size + [i] * 50, this.sizeY - refFloorTile.size);
                };
                    
                ctx.fillRect(0, 0, refFloorTile.size, refFloorTile.size);

                ctx.beginPath();
                ctx.rect(0, 0, refFloorTile.size, refFloorTile.size);
                ctx.stroke();

                ctx.restore();
            };
          

            this.x -= gamevelocity;

        };
        this.collisionCheck = function () {
            if (player.x + (player.width / 2) > this.x + 10 && player.x + (player.width / 2) < this.x + (player.width / 2)) {
                if (player.y + (player.width / 2) > this.y + 2 && player.y + (player.width / 2) < this.y + this.sizeY && this.side ) { 
                    console.log("HIT-platform");
                };

            };
        };
    };

    var nextoutput = 0;
    function PlatformUpdate() {
        if ((globaltimer / 100) % 1 === 0) {

            var platformheight = 100 + (Math.floor(outputSeed[0 + nextoutput] / 2) * 50);
            platforms.push(new Platform(1280 + 250, c.height, 100 + (outputSeed[0 + nextoutput] * 50), platformheight, "bottom"));
                       
            if (platformheight >= 250) { //CHECK IF HEIGHT IS HIGHER THAN 3 BLOCKS for BOTTOM
                platforms.push(new Platform(1280, c.height,200,150,"bottom"));
            };

            platforms.push(new Platform(1280, platformheight, 100 + (outputSeed[0 + nextoutput] * 50), platformheight, "top"));

            if (nextoutput < outputSeed.length - 2) {
                nextoutput += 1;
                
            } else {
                nextoutput = 0;
            };
            
        };

        if (platforms.length > 10) {
            platforms.splice(0, 2)
        };

        for (var i = 0; i < platforms.length; i++) {
            platforms[i].update();
            platforms[i].collisionCheck();
        }
       
    };

    
    //PLAYER
    function PlayerUpdate() { 
        player.velY += gravity;
        player.y += player.velY;

        if (player.y >= c.height - (player.height*1.5)) { //FLOOR
            player.y = c.height - (player.height*1.5);
            player.jumping = false;
            player.velY = 0;
        };


        // PLATFORM CHECK
        for (var i = 0; i < platforms.length; i++) {
           
            if (player.x + (player.width / 2) > platforms[i].x && player.x - (player.width / 2) < platforms[i].x + platforms[i].sizeX && player.death == false) {
                if (player.y + (player.height / 2) >= platforms[i].y && player.y + (player.height / 2) < platforms[i].y + 50 && platforms[i].side == "bottom") {
                    player.y = platforms[i].y - (player.height / 2);
                    player.jumping = false;
                    player.velY = 0;
                    angle = 0;
                };
                
                if (player.y + (player.height / 2) >= platforms[i].sizeY - 50 && player.y  < platforms[i].sizeY  && platforms[i].side == "top") {
                    player.velY = 3;
                };
            };
        };

        ctx.save();
        ctx.translate(player.x, player.y);

        if (angle < 358 && player.jumpcycle == true) {
            angle = (-Math.cos(rotationSpeed) + 1) * 180;
            rotationSpeed += 0.08;
        };

        if (angle > 358 ) {
            angle = 0;
            rotationSpeed = 0;
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

        backgroundUpdate();
         
        PlatformUpdate();

        TileUpdate();

        BoxUpdate();

        fgUpdate();

        ScoreUpdate();

        globaltimer++;

        requestAnimationFrame(Update);
    };


    window.addEventListener("load", function () {
        randomSeed();
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
            angle2 = (-Math.cos(rotationSpeed) + 1) * 180;
            console.log(angle2);
            rotationSpeed += 0.08;
        } else {
            
        };
        requestAnimationFrame(Update3);
    };

    function Update4() {
        if (angle2 < 358) {
            angle2 = (-Math.cos(rotationSpeed) + 1) * 180;
            console.log(angle2);
            rotationSpeed += 0.08;
        } else {

        };
        requestAnimationFrame(Update4);
    };

    var seed = 2;
    outputSeed = [];

    function randomSeed() {
        var x = Math.sin(seed);
        var x2 = Math.sin(seed+1)
        sNumber = x.toString().slice(3) + x2.toString().slice(3);
 
        for (var i = 0, len = sNumber.length; i < len; i += 1) {
             
            outputSeed.push(Math.floor(+sNumber.charAt(i) / 1.2));
        }

        console.log(outputSeed);
    }

});
