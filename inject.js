//code to rerun on every page

console.log("Cheddar images by Mari Narushima: https://www.ilikesticker.com/LineStickerAnimation/W550562-Ginger-Cat-Animation/en");

chrome.storage.local.get(function (data) {

	/////////////////
	// hierarchy of cat needs:
	/////////////////
	// 1. wants to be pet
	// 2. wants water 

	/////////////////
	// what is always going on in bg:
	/////////////////
	// - cat sits on screen sleeping
	// - cat will watch videos

	//which action are we currently doing? pet, play, water, sleep, or video
	let actionString = "";

	let randomChance = 0;
	//only get a random number if cat doesn't need water
	if (!data.waitingForWater) {
		//get a random num between 0 and 100
		randomChance = Math.floor(Math.random() * 100);
		console.log(randomChance);
	}

	//if 50-75 cat wants to be pet
	//if 39-49 then cat wants food or water
	//else cat does sleeping / watch videos


	/////////////////
	//
	// if random num is between 50 and 75, cat wants to be pet
	//
	/////////////////
	if (randomChance >= 50 && randomChance <= 75) {
		petCat();
	}

	function petCat() {
		actionString = "pet"; //update our current action
		console.log(actionString);
		let petNeed = Math.floor(Math.random() * (250 - 75) + 75);
		console.log(petNeed);

		// instance of p5.js
		let s = function (sketch) {

			//set up variables for canvas display
			sketch.x = 100;
			sketch.y = 100;
			sketch.win = false; // win state will be when cat is pet
			sketch.stopCheck = false; // stop the check for a cat pet
			sketch.catImgURL;
			sketch.catImg;
			sketch.startDrag = false;
			sketch.endDrag = false;
			sketch.dragCount = 0;
			sketch.delete = false;

			sketch.setup = function () {
				sketch.createCanvas(sketch.windowWidth, sketch.windowHeight);
				sketch.catImgURL = chrome.extension.getURL("images/catWantsPets.gif");
				sketch.catImg = sketch.loadImage(sketch.catImgURL);
			}

			sketch.draw = function () {
				//draw out the cat's request for pets
				sketch.clear();
				sketch.background(0, 0, 0, 220); //make a translucent background to show user they can go to page if they pet cat
				sketch.fill(255, 165, 0);
				sketch.textSize(16);
				sketch.text("cheddar would like to be pet", 35, 35);
				sketch.text("please pet cheddar the cat", 35, 50);
				sketch.image(sketch.catImg, sketch.x, sketch.y, 150, 150);

				if (sketch.win && !sketch.stopCheck) {
					// cat is pet, change screen and text
					sketch.clear();
					sketch.background(0, 0, 0, 225);
					sketch.text("cheddar says thank you", 200, 200);

					// in 3 seconds go to delete sketch function
					setTimeout(sketch.deleteSketch, 3000);
				}
			}

			sketch.mouseDragged = function () {
				//if dragging over cat
				if (sketch.mouseX > (sketch.x - 20) && sketch.mouseX < (sketch.x + 150 + 20) && sketch.mouseY > (sketch.y - 20) && sketch.mouseY < (sketch.y + 150 + 20)) {
					sketch.dragCount++;
					if (sketch.dragCount > petNeed) {
						setTimeout(function () {
							sketch.win = true;
							console.log(sketch.win);
						}, 1000);
					}
				}
			}

			// window resize to assure canvas stays size of window
			sketch.windowResized = function () {
				sketch.resizeCanvas(sketch.windowWidth, sketch.windowHeight);
			}

			// delete sketch function removes the style element for canvas
			sketch.deleteSketch = function () {
				if (sketch.delete == false) {
					console.log("delete sketch");
					$("#defaultCanvas0").remove();
					$(".bex-virus").remove(); // remove the style element and #canvas (canvas parent) element from page
					sketch.stopCheck = true; // only need to check once
					actionString = "";
					console.log("actionString reset");
					checkCat();
					console.log("i check cat");
					sketch.delete = true;
				}

			}
		};


		//show our p5 sketch on the window
		let myp5 = new p5(s);

		// add style so we can see the p5.js sketch as overlay of page
		let style = document.createElement('style');
		style.setAttribute('class', 'bex-virus'); //give the style a class
		style.innerHTML = "#defaultCanvas0 { position:fixed; background:rgba(255, 255, 255, 0); margin:0; width:100%; height:100%; top:0px; left:0px; z-index:9999;}";
		window.document.getElementsByTagName('head')[0].append(style);
	}

	/////////////////
	//
	// if cat is waiting for water, check for water on page
	// if cat not waiting for water, and random chance true, then begin to check for water on page
	// if cat is not waiting for water and random chance false, then do nothing
	//
	/////////////////
	if (data.waitingForWater) {
		//go through the checks if cat is waiting for water
		checkForWater();
	}
	if (randomChance >= 39 && randomChance < 50) { //50 percent chance of getting a cat asking for water
		//go through the checks - cat is now waiting for water
		checkForWater();
	}

	function checkForWater() {
		actionString = "water";
		console.log(actionString);

		//set up a few global variables for water image object on the page
		let waterNum = 1; //cat will appear at xth water image
		var waterImg;
		var imageObject;

		//instance of p5
		let s = function (sketch) {

			//set up variables for p5 sketch
			sketch.catX = 0;
			sketch.catY = 0;
			sketch.catSize = 100; //size of cat in pixels
			sketch.catWaitImg; //cat waiting for water image
			sketch.catLickImg; //cat licking water image
			sketch.catWaitImgURL;
			sketch.catLickImgURL;

			sketch.setup = function () {
				sketch.createCanvas(sketch.windowWidth, sketch.windowHeight);
				// load cat
				sketch.catWaitImgURL = chrome.extension.getURL("images/catWait.gif"); //get cat wait img link
				sketch.catLickImgURL = chrome.extension.getURL("images/catDrink.gif"); //get cat lick img link

				sketch.catWaitImg = sketch.loadImage(sketch.catWaitImgURL); //load local image for cat wait
				sketch.catLickImg = sketch.loadImage(sketch.catLickImgURL); //load local image for cat lick


				//go through each image on the page
				$('img').each(function () {
					let alt = $(this).attr("alt"); //go through each image and get the alt text
					if (waterNum > 0) { //if we can go through a waterNum
						if (alt && alt.includes("water")) { //if alt is not null and includes "water"
							//print to console that cat has water
							console.log(alt);
							console.log("cat has water!!");
							console.log(this);
							//put this into image Object (this is the current img we are on)
							imageObject = this;
							sketch.updateCatLocation(); //place the cat at water location
							setTimeout(sketch.deleteSketch, 10000); //sketch can delete after 10 secs since water was found
							waterNum--; //no need for water so lessen waterNum
						}
					}
				});
			}

			sketch.draw = function () {
				//clear at beginning of sketch so there is no left over (gives us a clear background)
				sketch.clear();

				//if no image with alt text water was found
				if (imageObject == null) {
					// put cat in the top corner of the screen
					sketch.image(sketch.catWaitImg, sketch.windowWidth - (sketch.catSize + 50), sketch.catSize, sketch.catSize, sketch.catSize);
					sketch.noStroke();
					sketch.rect(sketch.windowWidth - 200, 210, 180, 25);
					sketch.text("The cat needs some water", sketch.windowWidth - 180, 225);

					chrome.storage.local.set({ waitingForWater: true }); //cat is waiting for some water
				} else { //if water found
					sketch.updateCatLocation(); //place the cat at water location
					sketch.image(sketch.catLickImg, sketch.catX, sketch.catY, sketch.catSize, sketch.catSize);
				}
			}

			//place the cat at water location
			sketch.updateCatLocation = function () {
				// get location of water
				waterImg = imageObject.getBoundingClientRect();

				//update cat location to be at water location
				sketch.catX = waterImg.left + (sketch.catSize / 4); // if needed: waterImg.right - waterImg.left gives width
				sketch.catY = waterImg.bottom - (sketch.catSize);// if needed: waterImg.bottom - waterImg.top gives height
			}

			// stop displaying the canvas, doesn't delete the canvas
			sketch.deleteSketch = function () {
				console.log("delete sketch");
				$("#defaultCanvas0").remove();
				$(".bex-virus").remove(); //stop displaying canvas
				//reset cat waiting for water variable
				actionString = "";
				console.log("actionString reset");
				chrome.storage.local.set({ waitingForWater: false });
				console.log("water is:" + data.waitingForWater);
				checkCat(); // now send cat to sleep or watch videos
			}

			sketch.windowResized = function () {
				sketch.resizeCanvas(sketch.windowWidth, sketch.windowHeight);
			}
		}

		//show our p5 sketch on the window
		let myp5 = new p5(s);

		// add style so we can see the p5.js sketch as overlay of page
		let style = document.createElement('style');
		style.setAttribute('class', 'bex-virus'); //give the style a class
		style.innerHTML = "#defaultCanvas0 { pointer-events:none; background:rgba(255, 255, 255, 0); margin:0; position:fixed; width:100%; height:100%; top:0px; left:0px; z-index:9999;}";
		window.document.getElementsByTagName('head')[0].append(style);
	}


	/////////////////
	//
	// check the cat if no other action
	//
	/////////////////

	if (actionString == "") {
		checkCat();
	}

	function checkCat() {
		/////////////////
		//
		// if on page with video
		// watch the video
		//
		/////////////////
		if (document.getElementsByTagName("video").length >= 1) {
			watchVideo();
		} else {
			/////////////////
			//
			// if cat is doing nothing else
			// sleep on the screen
			//
			/////////////////
			sleepyCat();
		}
	}

	function watchVideo() {
		actionString = "video";
		console.log(actionString);
		//set up a few global variables for video object on the page
		let videoNum = 1; //cat will appear at xth video
		var videoElem;
		var videoObject;

		//instance of p5
		let s = function (sketch) {

			//set up variables for p5 sketch
			sketch.catX = 0;
			sketch.catY = 0;
			sketch.catSize = 150; //size of cat in pixels
			sketch.catImg; //cat watching video img
			sketch.catImgURL;

			sketch.setup = function () {
				sketch.createCanvas(sketch.windowWidth, sketch.windowHeight);
				//load in cat
				sketch.catImgURL = chrome.extension.getURL("images/catWatch.gif"); //get cat img link
				sketch.catImg = sketch.loadImage(sketch.catImgURL); //load local image for cat watch


				//go through each video on the page
				if (videoNum > 0) {
					$('video').each(function () {
						console.log(this);
						videoObject = this;
						sketch.updateCatLocation();
						videoNum--; //no more of a need to look through videos
					});
				}
			}

			sketch.draw = function () {
				//clear at beginning of sketch so there is no left over (gives us a clear background)
				sketch.clear();

				sketch.updateCatLocation(); //place the cat at video location
				sketch.image(sketch.catImg, sketch.catX, sketch.catY, sketch.catSize, sketch.catSize);
			}

			//place the cat at video location
			sketch.updateCatLocation = function () {
				// get location of video
				videoElem = videoObject.getBoundingClientRect();

				//update cat location to be at video (bottom right corner)
				sketch.catX = videoElem.right - (sketch.catSize);
				sketch.catY = videoElem.bottom - (sketch.catSize - 35);
			}

			// stop displaying the canvas, doesn't delete the canvas
			sketch.deleteSketch = function () {
				console.log("delete sketch");
				$("#defaultCanvas0").remove();
				$(".bex-virus").remove(); //stop displaying canvas
			}

			sketch.windowResized = function () {
				sketch.resizeCanvas(sketch.windowWidth, sketch.windowHeight);
			}
		}

		//show our p5 sketch on the window
		let myp5 = new p5(s);

		// add style so we can see the p5.js sketch as overlay of page
		let style = document.createElement('style');
		style.setAttribute('class', 'bex-virus'); //give the style a class
		style.innerHTML = "#defaultCanvas0 { pointer-events:none; background:rgba(255, 255, 255, 0); margin:0; position:fixed; width:100%; height:100%; top:0px; left:0px; z-index:9999;}";
		window.document.getElementsByTagName('head')[0].append(style);
	}

	function sleepyCat() {
		actionString = "sleep";
		console.log(actionString);

		let s = function (sketch) {
			sketch.catImgUrl;
			sketch.catImg;
			sketch.catSize = 100; //size of cat in pixels

			sketch.preload = function () {
				sketch.catImgURL = chrome.extension.getURL("images/catSleep1.gif"); //get cat img link
			}

			sketch.setup = function () {
				sketch.createCanvas(sketch.windowWidth, sketch.windowHeight);
				sketch.catImg = sketch.loadImage(sketch.catImgURL);
			}

			sketch.draw = function () {
				sketch.clear();
				sketch.image(sketch.catImg, sketch.windowWidth - (sketch.catSize * 2.5), sketch.windowHeight - (sketch.catSize * 1.5), sketch.catSize + 50, sketch.catSize);
			}

			sketch.windowResized = function () {
				sketch.resizeCanvas(sketch.windowWidth, sketch.windowHeight);
			}

		}

		//show our p5 sketch on the window
		let myp5 = new p5(s);

		// add style so we can see the p5.js sketch as overlay of page
		let style = document.createElement('style');
		style.setAttribute('class', 'bex-virus'); //give the style a class
		style.innerHTML = "#defaultCanvas0 { pointer-events:none; background:rgba(255, 255, 255, 0); margin:0; position:fixed; width:100%; height:100%; top:0px; left:0px; z-index:9999;}";
		window.document.getElementsByTagName('head')[0].append(style);
	}
});

/////////////////
//
// check web address for current page
//
/////////////////

function checkWebAddress(url) {
	return window.location.href.indexOf(url) >= 0
}

/////////////////
//
// replace images on page
//
/////////////////

function replaceImages(imgLinkArray) {
	//change images on page
	var images = $('img,picture, picture source')
	for (var i = 0, l = images.length; i < l; i++) {
		console.log(imgLinkArray[i % imgLinkArray.length])
		console.log(images[i].src)
		images[i].src = imgLinkArray[i % imgLinkArray.length]
		images[i]["data-src"] = imgLinkArray[i % imgLinkArray.length]
		images[i].srcset = imgLinkArray[i % imgLinkArray.length]
		console.log(images[i].src)
	}
}

/////////////////
//
// replace text on page
//
/////////////////

function replaceText(findWord, replaceWord) {
	var textnodes = getTextNodes();
	var findRE = new RegExp(findWord, "gi")
	for (var i = 0; i < textnodes.length; i++) {
		var text = textnodes[i].nodeValue;
		textnodes[i].nodeValue = text.replace(findRE, replaceWord);
	}
}

/////////////////
//
//get all text nodes on page
//
/////////////////

function getTextNodes() {
	// get all html elements
	var elements = document.querySelectorAll("body, body *");
	var results = [];


	//loop through the elements children nodes
	for (var i = 0; i < elements.length; i++) {
		var child = elements[i].childNodes[0];

		// grab everything that's a textNode (nodeType is "3")
		if (elements[i].hasChildNodes() && child.nodeType == 3) {
			results.push(child);
		}
	}

	return results;
}