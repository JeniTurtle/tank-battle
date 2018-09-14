	var can = document.getElementById("myCanvas");
	var cxt = can.getContext("2d");
	
	
	var tankColor = new Array("#FFFFFF", "#CCCCCC");
	var heroColor = new Array("#DED284","#F1F26E");
	var enemyColor = new Array("#00A2B5","#00FEFE");

	//坦克对象
	function Tank(tankX,tankY,direct) {
		this.tankX = tankX;
		this.tankY = tankY;
		this.direct = direct;
		this.color = tankColor;
		this.speed = 5;
		this.isLive = true;
	}
	
	// 英雄对象，继承坦克
	function Hero(tankX, tankY, direct) {
		this.tank = Tank;
		this.tank(tankX,tankY,direct);
		this.color = heroColor;
		this.speed = 2;

		this.moveUp = function() {
			if(this.tankY - this.speed > 0)
				this.tankY -= this.speed;
		}
		this.moveDown = function() {
			if(this.tankY + this.speed < can.clientHeight-30)
				this.tankY += this.speed;
		}
		this.moveLeft = function() {
			if(this.tankX - this.speed >= 5)
				this.tankX -= this.speed;
		}
		this.moveRight = function() {
			if(this.tankX + this.speed < can.clientWidth-25)
				this.tankX += this.speed;
		}

		this.shotEnemy = function() {
    		    if(this.isLive) {
			var heroBullet = null;
			switch(this.direct) {
				case 1 :
					heroBullet = new Bullet(this.tankX+9,this.tankY-1,this.direct);
					break;
				case 2 :
					heroBullet = new Bullet(this.tankX+9,this.tankY+29,this.direct);
					break;
				case 3 :
					heroBullet = new Bullet(this.tankX-6,this.tankY+14,this.direct);
					break;
				case 4 :
					heroBullet = new Bullet(this.tankX+24,this.tankY+14,this.direct);
					break;
			}
			heroBullets.push(heroBullet);
			heroBullet.timer = window.setInterval("heroBullets["+(heroBullets.length-1)+"].run()", 50);
		    }
		    flashTankMap();
		}
	}

	// 敌人对象，继承坦克
	function Enemy(tankX,tankY,direct) {
		this.tank = Tank;
		this.tank(tankX,tankY,direct);
		this.color = enemyColor;
		this.count = 0;	
		this.speed = 2;	
		this.bulletIsLive = true;

		this.run=function run(){
			
			//判断敌人的坦克当前方向
			switch(this.direct){
				
				case 1:
					if(this.tankY > 0)
						this.tankY -= this.speed;
					else 
						this.direct=Math.round(Math.random()*3) + 1;
					break;
				case 2:
					if(this.tankY + 30 < 300)
						this.tankY += this.speed;
					else
						this.direct=Math.round(Math.random()*3) + 1;
					break;
				case 3:
					if(this.tankX > 0)
						this.tankX -= this.speed;
					else
						this.direct=Math.round(Math.random()*3) + 1;
					break;
				case 4:
					if(this.tankX + 30 < 400)
						this.tankX += this.speed;
					else
						this.direct=Math.round(Math.random()*3) + 1;
					break;
			}
			// 改变方向
			if(this.count > Math.random()*400){
				this.direct=Math.round(Math.random()*3) + 1;// 随机生成 1,2,3,4
				this.count=0;
				this.bulletIsLive = false;
			}
			this.count++;

			// 判断条件，发出子弹
			if(this.bulletIsLive == false) {

				switch(this.direct) {
					case 1 :
					case 2 :
						if(hero.tankX < this.tankX+10 < hero.tankX+30 ) {
							if(this.tankY > hero.tankY)
								this.direct = 1;
							else
								this.direct = 2;
							this.shotHero();
						}		
						break;
					case 3 :
					case 4 :
						if(hero.tankY < this.tankY+10 < hero.tankY+30) {
							if(this.tankX > hero.tankX)
								this.direct = 3;
							else
								this.direct = 4;
							this.shotHero();
						}
						break;
				}
				
				this.shotHero();
				this.bulletIsLive = true;	
			}
		}

		this.shotHero = function() {
			switch(this.direct){
				case 1 :
					enemyBullet = new Bullet(this.tankX+9,this.tankY-1,this.direct);
					break;
				case 2 :
					enemyBullet = new Bullet(this.tankX+9,this.tankY+29,this.direct);
					break;
				case 3 :
					enemyBullet = new Bullet(this.tankX-6,this.tankY+14,this.direct);
					break;
				case 4 :
					enemyBullet = new Bullet(this.tankX+24,this.tankY+14,this.direct);
					break;
			}
			enemyBullets.push(enemyBullet);
			enemyBullet.timer = window.setInterval("enemyBullets["+(enemyBullets.length-1)+"].run()", 50);
		}
	}
	
	//定义一个爆炸类
	function Bomb(bombX, bombY){
		this.bombX = bombX;
		this.bombY = bombY;
		this.isLive = true; // 爆炸状态，默认true;
		
		this.blood = 9; // 爆炸阶段

		this.bloodDown = function(){
			if(this.blood > 0){
				this.blood--;
			}else{
				this.isLive = false;
			}
		}
	}	



	// 子弹对象
	function Bullet(bulletX,bulletY,direct) {
		this.bulletX = bulletX;
       		this.bulletY = bulletY;
		this.direct = direct;
		this.speed = 5;
		this.timer = null;
		this.isLive = true;		

		this.run = function() {
			isHitHero();
			isHitEnemy();
			if(this.bulletY < 0 || this.bulletY > can.clientHeight || this.bulletX < 0 || this.bulletX > can.clientWidth || !this.isLive) {
				this.isLive = false;
				window.clearInterval(this.timer);		
			} else {
				switch(this.direct) {
					case 1 :
						this.bulletY -= this.speed;
						break;	
					case 2 :
						this.bulletY += this.speed;
						break;
					case 3 :
						this.bulletX -= this.speed;
						break;
					case 4 :
						this.bulletX += this.speed;
						break;
				}
			}
			//document.getElementById("aa").innerText = "X坐标:"+this.bulletX+"，Y坐标:"+this.bulletY;
		}
	}
 	
	// 绘制英雄子弹
	function makeHeroBullet(color) {
		for(var i=0; i<heroBullets.length; i++) {
			if(heroBullets[i].isLive) {
				cxt.fillStyle = color;
				cxt.fillRect(heroBullets[i].bulletX, heroBullets[i].bulletY, 2, 2);
			}
		}
	}

	// 绘制敌人子弹
	function makeEnemyBullet(color){
		for(var i=0; i<enemyBullets.length; i++){
			if(enemyBullets[i].isLive){
				cxt.fillStyle = color;
				cxt.fillRect(enemyBullets[i].bulletX, enemyBullets[i].bulletY, 2, 2);
			}
		}
	}

	// 绘制坦克
	function makeTank(tank) {
	    
            if(tank != null && tank.isLive) {
	
	    	switch(tank.direct) {
			// 上	
			case 1 :
				cxt.fillStyle = tank.color[0];
				cxt.fillRect(tank.tankX,tank.tankY,5,30);

				cxt.fillRect(tank.tankX+15,tank.tankY,5,30);
		
				cxt.fillRect(tank.tankX+6,tank.tankY+5,8,20);
		
				cxt.beginPath();
				cxt.arc(tank.tankX+10,tank.tankY+15,4,0,2*Math.PI);
				cxt.closePath();
				cxt.fillStyle = tank.color[1];
				cxt.lineWidth = 1;
				cxt.strokeStyle = "#000000";
				cxt.stroke();
				cxt.fill();
	
				cxt.beginPath();
				cxt.moveTo(tank.tankX+10,tank.tankY+15);
				cxt.lineTo(tank.tankX+10,tank.tankY);
				cxt.closePath();
				cxt.strokeStyle = tank.color[1];
				cxt.lineWidth = 3;
				cxt.stroke();

				break;
			// 下
			case 2 :
				cxt.fillStyle = tank.color[0];
				cxt.fillRect(tank.tankX,tank.tankY,5,30);

				cxt.fillRect(tank.tankX+15,tank.tankY,5,30);
		
				cxt.fillRect(tank.tankX+6,tank.tankY+5,8,20);
		
				cxt.beginPath();
				cxt.arc(tank.tankX+10,tank.tankY+15,4,0,2*Math.PI);
				cxt.closePath();
				cxt.fillStyle = tank.color[1];
				cxt.lineWidth = 1;
				cxt.strokeStyle = "#000000";
				cxt.stroke();
				cxt.fill();
	
				cxt.beginPath();
				cxt.moveTo(tank.tankX+10,tank.tankY+15);
				cxt.lineTo(tank.tankX+10,tank.tankY+30);
				cxt.closePath();
				cxt.strokeStyle = tank.color[1];
				cxt.lineWidth = 3;
				cxt.stroke();

				break;
			// 左
			case 3 :
				cxt.fillStyle = tank.color[0];
				cxt.fillRect(tank.tankX-5,tank.tankY+5,30,5);

				cxt.fillRect(tank.tankX-5,tank.tankY+20,30,5);
		
				cxt.fillRect(tank.tankX,tank.tankY+11,20,8);
		
				cxt.beginPath();
				cxt.arc(tank.tankX+10,tank.tankY+15,4,0,2*Math.PI);
				cxt.closePath();
				cxt.fillStyle = tank.color[1];
				cxt.lineWidth = 1;
				cxt.strokeStyle = "#000000";
				cxt.stroke();
				cxt.fill();
	
				cxt.beginPath();
				cxt.moveTo(tank.tankX+10,tank.tankY+15);
				cxt.lineTo(tank.tankX-5,tank.tankY+15);
				cxt.closePath();
				cxt.strokeStyle = tank.color[1];
				cxt.lineWidth = 3;
				cxt.stroke();

				break;
			// 右
			case 4 :
				cxt.fillStyle = tank.color[0];
				cxt.fillRect(tank.tankX-5,tank.tankY+5,30,5);

				cxt.fillRect(tank.tankX-5,tank.tankY+20,30,5);
		
				cxt.fillRect(tank.tankX,tank.tankY+11,20,8);
		
				cxt.beginPath();
				cxt.arc(tank.tankX+10,tank.tankY+15,4,0,2*Math.PI);
				cxt.closePath();
				cxt.fillStyle = tank.color[1];
				cxt.lineWidth = 1;
				cxt.strokeStyle = "#000000";
				cxt.stroke();
				cxt.fill();
	
				cxt.beginPath();
				cxt.moveTo(tank.tankX+10,tank.tankY+15);
				cxt.lineTo(tank.tankX+25,tank.tankY+15);
				cxt.closePath();
				cxt.strokeStyle = tank.color[1];
				cxt.lineWidth = 3;
				cxt.stroke();

				break;
	    	}
	    }
	}

	// 判断英雄子弹，是否击中了敌人
	function isHitEnemy(){
	
		for(var i=0;i<heroBullets.length;i++){
			
			var heroBullet=heroBullets[i];

			if(heroBullet.isLive){ 
				
				for(var j=0;j<enemyTanks.length;j++){
					
					var enemyTank=enemyTanks[j];
						
					switch(enemyTank.direct){
						case 1: 
						case 2:
							if(heroBullet.bulletX >= enemyTank.tankX && heroBullet.bulletX <= enemyTank.tankX+20 && heroBullet.bulletY >= enemyTank.tankY && heroBullet.bulletY <= enemyTank.tankY+30){			
								enemyTank.isLive = false;	
								//创建一颗炸弹
								var bomb=new Bomb(enemyTank.tankX, enemyTank.tankY);

								//然后把该炸弹放入到bombs数组中
								bombs.push(bomb);	

								enemyTanks.splice(j,1);
								heroBullet.isLive = false;	
							}
							break;
						case 3:
						case 4:
							if(heroBullet.bulletX >= enemyTank.tankX && heroBullet.bulletX <= enemyTank.tankX+30 && heroBullet.bulletY >= enemyTank.tankY && heroBullet.bulletY <= enemyTank.tankY+20){
								enemyTank.isLive = false;
								//创建一颗炸弹
								var bomb=new Bomb(enemyTank.tankX, enemyTank.tankY);

								//然后把该炸弹放入到bombs数组中
								bombs.push(bomb);
	
								enemyTanks.splice(j,1);
								heroBullet.isLive = false;
							}
							break;
					}
				}
			}
			
		}
		
	}
	
	// 判断敌人子弹是否击中英雄
	function isHitHero(){
	
		for(var i=0;i<enemyBullets.length;i++){
			
			var enemyBullet=enemyBullets[i];

			if(enemyBullet.isLive && hero.isLive){ 
						
				switch(hero.direct){
					case 1: 
					case 2:
						if(enemyBullet.bulletX >= hero.tankX && enemyBullet.bulletX <= hero.tankX+20 && enemyBullet.bulletY >= hero.tankY && enemyBullet.bulletY <= hero.tankY+30){				
							hero.isLive = false;
							//创建一颗炸弹
							var bomb=new Bomb(hero.tankX, hero.tankY);

							//然后把该炸弹放入到bombs数组中
							bombs.push(bomb);
	
							enemyBullet.isLive = false;
						}	
						break;

					case 3:
					case 4:
						if(enemyBullet.bulletX >= hero.tankX && enemyBullet.bulletX <= hero.tankX+30 && enemyBullet.bulletY >= hero.tankY && enemyBullet.bulletY <= hero.tankY+20){
							hero.isLive = false;
							//创建一颗炸弹
							var bomb=new Bomb(hero.tankX, hero.tankY);

							//然后把该炸弹放入到bombs数组中
							bombs.push(bomb);
	
							enemyBullet.isLive = false;
						}
						break;
				}
			}
		}
	}

	// 绘制爆炸 
	function makeBomb(){
	
		for(var i=0;i<bombs.length;i++){
	
			//取出一颗炸弹
			var bomb = bombs[i];
			if(bomb.isLive){
				var img = new Image();

				if(bomb.blood > 6){ 
					img.src = "bomb_1.gif";
					var x = bomb.bombX;
					var y = bomb.bombY;
					img.onload=function(){
						cxt.drawImage(img,x,y,30,30);
					}
				}else if(bomb.blood > 3){
					img.src = "bomb_2.gif";
					var x = bomb.bombX;
					var y = bomb.bombY;
					img.onload=function(){
						cxt.drawImage(img,x,y,30,30);
					}
				}else {
					img.src = "bomb_3.gif";
					var x = bomb.bombX;
					var y = bomb.bombY;
					img.onload=function(){
						cxt.drawImage(img,x,y,30,30);
					}
				}
	
				//减血
				bomb.bloodDown();
				if(bomb.blood <= 0){
					bombs.splice(i,1);
	
				}
			}
		}
	}

	// 移动所有敌人坦克
	function moveEnemyTank() {
		for(var i=0; i<enemyTanks.length; i++) {
			enemyTanks[i].run();
		}
	}



















