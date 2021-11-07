//alert(div.offsetLeft)//distance from left
//alert(div.offsetWidth)//Width
//alert(div.offsetLeft + div.offsetWidth)//distance of Right
//let doit = setInterval(move, 90)

//Variable declaration section
let box = document.getElementById('box')
let boxWidth = box.offsetWidth
let boxLeft = box.offsetLeft
let dino = document.getElementById('dino')
let score = document.getElementById('score')
let realScore = 0
let highScore = document.getElementById('highScore')
let highestScore = 0
let spaceClicked = true // to prevent from again jumping while it is jumping
let gameAlreadyOver = false // to prevent the other obstacle from moving
let doit;

//Function to jump the dino
function jump() {
    if(spaceClicked) {
        spaceClicked = false
        let margin = 0, flag=false	//margin tells the speed, flag tells whether jumping limit is touched
        let dinoHeight = dino.offsetHeight * 2 // how up to jump
        let jumpingDiv = setInterval(jumpDiv, 75) // 75 is how fast it will jump
        function jumpDiv(){ //Function to move the div
            if(margin > dinoHeight) flag = true
            if(margin < 0) {
                clearInterval(jumpingDiv)
                spaceClicked = true //now u can do it again
                //dino.style.marginBottom = 0 + "px"
            } else {
                dino.style.marginBottom = margin + "px"
            }
            margin +=  flag ? -20 : 20//20 right here effects the speed
        }
    }
}

document.body.onkeyup = function(e) {
	if(e.keyCode == 32 || e.keyCode == 38) { //spacebar or uparrow
		jump()
	}
}

//Video Streaming and All
let video = document.getElementById('video')
let model
let canvas = document.getElementById('canvas')
let ctx = canvas.getContext('2d')

const videoStream = () => {
    navigator.mediaDevices.getUserMedia({ // getUserMedia is a API and takes an object as an argument 
        video: {width: 350, height: 250},
        audio: false // make it true if u also want audio
    })
    .then((stream) => { // and this returns a stream object which is a media stream object
        video.srcObject = stream 
    })
}
const detectFaces = async () => { // this is function is asynchronus
    const prediction = await model.estimateFaces(video, false) // 1st arg is input, 2nd is if we want to return tensor or not So her we dont want tensor we want actual values of coordinates
    ctx.drawImage(video, 0, 0, 350, 250)
    // a line to tell the limit
    ctx.beginPath();
    ctx.lineWidth = '2'
    ctx.strokeStyle = 'red'
    ctx.moveTo(0, 100);
    ctx.lineTo(350, 100);
    ctx.stroke();

    prediction.forEach(pred => { // pred corresponds to 1 face
        // plot nose point, its in landmark array
        ctx.fillStyle = 'yellow'
        ctx.fillRect(pred.landmarks[2][0], pred.landmarks[2][1], 5, 5)
        if(pred.landmarks[2][1] < 100) jump() // if limit touched jump
    })
}
videoStream()
video.addEventListener('loadeddata', async () =>{ // After the data is loaded then canvas is called, else it will not show
    model = await blazeface.load()
    setInterval(detectFaces, 40) // 1000/24frames = 40
})

/* Game Functions */
//Function to start the game
function start(){
	gameAlreadyOver = false
	spaceClicked = true
	realScore = 0
	score.innerHTML = realScore
	document.getElementById("dino").getElementsByTagName("img")[0].src="jumper.jpeg";
	let obs = document.getElementsByClassName('obs') // remove all obs if any
	while(obs[0]) {
		obs[0].parentNode.removeChild(obs[0])
	}
	doit = setInterval(move, 3000)
}

function move(){// Function for creating and moving
	let div = document.createElement('div')
	div.className += 'obs'
	let img = document.createElement('img')
	img.src = 'logo.png'
	img.id = 'pic'
	div.appendChild(img)
	document.getElementById('box').append(div)
	let margin = div.offsetWidth//initialize it with the width of the div
	let movingDiv = setInterval(moveDiv, 90) // 90 is how fast next obstacle will come

	function moveDiv(){ //Function to move the div
		if(gameOver()) {
			gameAlreadyOver = true
			document.getElementById("dino").getElementsByTagName("img")[0].src="fail.png";
			clearInterval(movingDiv)
			clearInterval(doit)
			// Update high score
			if(realScore > highestScore) {
				highestScore = realScore
				highScore.innerHTML = 'Highest Score : ' + highestScore
			}
		}
		if(!gameAlreadyOver) {
			if(margin > boxWidth) {
				clearInterval(movingDiv)
				document.getElementById('box').removeChild(div)
			} else {
				div.style.marginRight = margin + "px"
			}
			margin += 20 //20 right here effects the speed
			realScore++
			score.innerHTML = realScore
		}
	}
	function gameOver(){ // Game over condition
		// returns 1 if game is really over, 0  means nothing go on with interval	
		return dino.offsetTop > div.offsetTop-div.offsetHeight && div.offsetLeft >= dino.offsetLeft && div.offsetLeft <= dino.offsetLeft+dino.offsetWidth ? 1 : 0;
	}
}