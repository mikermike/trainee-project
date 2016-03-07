var app = angular.module("MyApp", []);

var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");


var gravity = 0.5;
var angle = 0;

var player = { x: c.width / 2, y: 50, width: 50, height: 50, velY: 0, speed: 10, jumping: true, jumpcycle:false};

var particles = new Array();
particlelife = 50;


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

    // background

    $scope.drawBG = function () {

    };

    // forground

    $scope.drawPlayer = function () {
      ctx.fillStyle = "#FF0000";
      ctx.fillRect(-(player.width / 2), -(player.height / 2), player.width, player.height);
      ctx.stroke();
    };

    $scope.drawFG = function () {
        $scope.drawPlayer();
    };

    function particle(x,y,vel,life,size,totalvel){
        this.x = x;
        this.y = y;
        this.vel = vel;
        this.life = life;
        this.size = size;
        this.totalvel = totalvel;
    };


    var particles = [];
    var maxParticles = 20;

    function addparticles(){
  //  if (particles.length > maxParticles) return;

      for (var i = 0;i < 10; i++){
        particles.push(new particle);
        particles[i].x= player.x + (Math.random() * 5) + 1;
        particles[i].y= player.y+(player.height/2) - (Math.random() * 10);
        particles[i].vel = (Math.random() * 0.5) + 1;
        particles[i].totalvel = particles[i].vel;
        particles[i].size = (Math.random() * 20) + 10;
      }
        console.log(particles);
        console.log(particles[0])
    };


    function drawparticles(){
     
       
        for (var i = 0; i < particles.length; i++) {
            var x = particles[i].x;
            var y = particles[i].y;
            var size = particles[i].size;
            var velocity = particles[i].totalvel;

            ctx.save();
            ctx.translate(x-=velocity, y);
            ctx.fillStyle = "#b83bff";
            ctx.fillRect(-size/2, -size/2, size, size);
            ctx.restore();
         
            particles[i].totalvel += particles[i].vel;
            particles[i].size /= 1.04;
        }

        particlelife += 1;
      };


    function update() {

        player.velY += gravity;
        player.y += player.velY;

        if (player.y >= c.height - player.height) {
            player.y = c.height - player.height;
            player.jumping = false;
          //  angle = 0;
           
       }

        ctx.clearRect(0, 0, c.width, c.height);

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
            
       $scope.drawPlayer();
         
       ctx.restore();

       drawparticles();

       // <<<<

    if(player.jumping == false){
        if (particlelife > 1){
            addparticles();
            particlelife = 0;
        }

    }
    

        requestAnimationFrame(update);
    };

    window.addEventListener("load", function () {
      // particles.push(new singleparticle(500,500+Math.random() * 30) + 1);
       // particles.push(new singleparticle(500,500+Math.random() * 30) + 1);
       // console.log(particles[0]);
        update();
      //  addparticles();
  

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
});