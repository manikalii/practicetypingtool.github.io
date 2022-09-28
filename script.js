/**
 * calling main function when document is loaded
 */
/*
showing typing speed data constant start
*/
const typing_speed_span = document.querySelector(".typing_speed span");
const keypresssound = new Audio("./assets/sound/keypresssound.mp3");
/**
 * /// showing typing speed data constant end
 */
/**
 * geting settings for keypress sound on/off from local storage
 */
let localkeypresssound = localStorage.getItem("keypresssound");
/**
 * gettting pervious typing spped from localstorage
 */
let current_words_per_minute = localStorage.getItem("words_per_minute");

/**
 * Initializing the tool main funciton by on window load event so that thre is no problem with any data 
 * loading problem
 */
window.addEventListener("load", function () {
    typing_practicing_tool();
});
if (current_words_per_minute) {
    typing_speed_span.innerText = current_words_per_minute < 10 ? "0"+ current_words_per_minute: current_words_per_minute;
}
window.addEventListener("load", function () {
    let scaleton = document.querySelector(".scaleton");
    setTimeout(() => {
        scaleton.style.visibility = "hidden";
        scaleton.style.display = "none";
    }, 1000);
});
/**
 * call the main function when window resized
 */

window.addEventListener("resize", function () {
    typing_practicing_tool();
});
// main function called typing_practicing_tool

let numOfWordsTyped = 0;
let starting_time = 0;
let ending_time = 0;
function typing_practicing_tool() {
    let totypecontent = document.querySelector('#totypecontent');
    let text = generateTextForTeyping();
    let typingIndicator = document.querySelector(".typingIdicator");
    let textArr = text.trim().split("");
    totypecontent.innerHTML = "";
    textArr.forEach(function (text, index) {
        if (text == " ") {
            text = "<i class='spaceIcon'></i>";
        }
        totypecontent.innerHTML += `<span id="${index}">${text}</span>`;
    })
    let havetomatchkey = 0;
    let numberofWrongChars = 0;

    let typedWrong = {
        key: null
    }
    /**
 *  updating cursor position when keydonwn and makeing sure the presed key is correct
 * other wise the cursor should no go forward so that user cant skip the chars
     */
    updateTypingCursorPosition(typingIndicator, totypecontent.children[havetomatchkey]);

    window.addEventListener('keydown', function (e) {

        animateKey(e);
        console.log(e.keyCode)
        if (e.key === textArr[havetomatchkey]) {
            
            
            if (e.keyCode == 32) {
                numOfWordsTyped++;
            }
            if (havetomatchkey === 0) {
                numOfWordsTyped = 0;
                tracktime("start");
            }
            if (havetomatchkey == textArr.length - 1) {
                numOfWordsTyped += 1;
                let time = tracktime("end");
                calculateTypingSpeed(numOfWordsTyped, time);
                starting_time = 0;
                ending_time = 0;
            }
            if (typedWrong.key != null) {
                numberofWrongChars++;
                totypecontent.children[typedWrong.key].classList.add("wrong");
                totypecontent.children[havetomatchkey].classList.add("typed");
                updateTypingCursorPosition(typingIndicator, totypecontent.children[havetomatchkey], 'end');
                typedWrong.key = null;
            } else {
                totypecontent.children[havetomatchkey].classList.add("typed");
                updateTypingCursorPosition(typingIndicator, totypecontent.children[havetomatchkey], 'end');
            }
            havetomatchkey++;
            if (havetomatchkey == textArr.length) {
                setTimeout(() => {
                    typing_practicing_tool();
                }, 1000);
            }
        } else {
            if (e.keyCode != 16 && e.keyCode != 20) {
                typedWrong.key = havetomatchkey;
            }
        }
    });
}

// typing_practicing_tool();

/**
 * 
 * Creating nedded functions 
 * 
 */
/**
 * function to update typing cusror position
 * @param {*} cursorElement 
 * @param {*} posElement 
 * @param {*} startig 
 */
function updateTypingCursorPosition(cursorElement, posElement, startig = "") {
    if (startig != "") {
        
        cursorElement.style.left = posElement.offsetLeft + posElement.clientWidth + "px";
    } else {
        
        cursorElement.style.left = posElement.offsetLeft + "px";
    }
    cursorElement.style.top = posElement.offsetTop + "px";
    cursorElement.style.height = posElement.clientHeight + "px";
}

/**
 * function to generate Text based on user 
 */

function generateTextForTeyping(specialChar = "") {
    let localcapitalize = localStorage.getItem('capitalize');
    let localspecialchar = localStorage.getItem("specialchar");
    let specialChars = ["#", "$", "%", "^", "&", "*", "(", ")", "@", "!", "~", "+", "-", "}", "{", "]", "[", "|", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    let foundArr = "";
    let normal = [
        "lorem ipsum, dolor sit amet consectetur adipisicing elit. Iusto consectetur enim, dolorem perferendis veritatis quaerat incidunt nemo accusamus dolore nam",
        "quisque sodales cursus mauris, eugiat ut. utbus. aliquam venenatis egestas velit sed euismod. vivamus quis orci eros.",
        "lorem ipsum, dolor sit amet consectetur adipisicing elit. Iusto consectetur enim, dolorem perferendis veritatis quaerat incidunt nemo accusamus dolore nam",
        "quisque sodales cursus maurisem. aliquam erat volutpat. cras eget rhoncus risus, vitae dictum nibh. interdum et malesuada fames ac ante ipsum primis in faucibus. aliquam venenatis egestas velit sed euismod. vivamus quis orci eros.",
        "lorem ipsum, dolor sit amet consectetur adipisicing elit. Iusto consectetur enim, dolorem perferendis veritatis quaerat incidunt nemo accusamus dolore nam",
        "quisque sodales cursus mauris, ac liquam erat volutpat. cras eget rhoncus risus, vitae dictum nibh. interdumprimis in faucibus. aliquam venenatis egestas velit sed euismod. vivamus quis orci eros.",
    ];

    let capitalize = [];
    let withspecialChar = [];
    let capAndSpecialChar = [];
    
    if (localcapitalize && localcapitalize == "true" && localspecialchar != "true") {
        normal.forEach(str => {
            let temarr = [];
            let wordsarr = str.split(" ");
            wordsarr.forEach(word => {
                let capitalizedword = word[0].toUpperCase() + word.slice(1);
                temarr.push(capitalizedword);
            });
            let temstr = temarr.join(" ");
            capitalize.push(temstr);
        });
        foundArr = capitalize;
    } else if (localspecialchar && localspecialchar == "true" && localcapitalize != "true") {
        normal.forEach(str => {
            let tmparr = [];
            let wordsar = str.split(" ");
            wordsar.forEach(wrd => {
                let temword = wrd + specialChars[Math.floor(Math.random() * (specialChars.length - 1))];
                tmparr.push(temword);
            });
            let temsrt = tmparr.join(" ");
            withspecialChar.push(temsrt);
        });
        foundArr = withspecialChar;
    } else if (localcapitalize && localcapitalize == "true" && localspecialchar && localspecialchar == 'true') {
        let capitalizedTempArr = [];
        normal.forEach(str => {
            let temarr = [];
            let wordsarr = str.split(" ");
            wordsarr.forEach(word => {
                let capitalizedword = word[0].toUpperCase() + word.slice(1);
                temarr.push(capitalizedword);
            });
            let temstr = temarr.join(" ");
            capitalizedTempArr.push(temstr);
        });
        capitalizedTempArr.forEach(str => {
            let tmparr = [];
            let wordsar = str.split(" ");
            wordsar.forEach(wrd => {
                let temword = wrd.trim() + specialChars[Math.floor(Math.random() * (specialChars.length - 1))];
                tmparr.push(temword);
            });
            let temsrt = tmparr.join(" ");
            capAndSpecialChar.push(temsrt);
        });
        foundArr = capAndSpecialChar;
        
    } else {
        foundArr = normal;
    }
    
    let randomInd = Math.ceil(Math.random() * foundArr.length - 1);
    
    return foundArr[randomInd];
}



/**
 * Create Buttons for keyboard
 */
function createButtonForKeyboard() {
    let keyboard_inner = document.querySelector(".keyboard_inner");

    for (let i = 0; i < 53 + 8; i++) {
        let key = document.createElement("div");
        key.setAttribute("class", "key");
        key.setAttribute("id", "key_" + (i + 1));
        keyboard_inner.appendChild(key)

    }
    let allKeys = document.querySelectorAll(".key");
    allKeys.forEach(function (key, index) {
        key.addEventListener("mousedown", function (e) {
            e.target.classList.add("active");
        });
        key.addEventListener("mouseup", function (e) {
            allKeys.forEach((key) => {
                key.classList.remove("active")
            })
        });
        if (index == 0) {
            key.innerHTML = "~";
        }
        if (index == 1) {
            key.innerHTML = "1";
        }
        if (index == 2) {
            key.innerHTML = "2";
        }
        if (index == 3) {
            key.innerHTML = "3";
        }
        if (index == 4) {
            key.innerHTML = "4";
        }
        if (index == 5) {
            key.innerHTML = "5";
        }
        if (index == 6) {
            key.innerHTML = "6";
        }
        if (index == 7) {
            key.innerHTML = "7";
        }
        if (index == 8) {
            key.innerHTML = "8";
        }
        if (index == 9) {
            key.innerHTML = "9";
        }
        if (index == 10) {
            key.innerHTML = "0";
        }
        if (index == 11) {
            key.innerHTML = "-";
        }
        if (index == 12) {
            key.innerHTML = "+";
        }
        if (index == 13) {
            key.innerHTML = "Back";
        }
        if (index == 14) {
            key.innerHTML = "Tab";
        }
        if (index == 15) {
            key.innerHTML = "Q";
        }
        if (index == 16) {
            key.innerHTML = "W";
        }
        if (index == 17) {
            key.innerHTML = "E";
        }
        if (index == 18) {
            key.innerHTML = "R";
        }
        if (index == 19) {
            key.innerHTML = "T";
        }
        if (index == 20) {
            key.innerHTML = "Y";
        }
        if (index == 21) {
            key.innerHTML = "U";
        }
        if (index == 22) {
            key.innerHTML = "I";
        }
        if (index == 23) {
            key.innerHTML = "O";
        }
        if (index == 24) {
            key.innerHTML = "P";
        }
        if (index == 25) {
            key.innerHTML = "{";
        }
        if (index == 26) {
            key.innerHTML = "}";
        }
        if (index == 27) {
            key.innerHTML = "Enter";
        }
        if (index == 28) {
            key.innerHTML = "Caps";
        }
        if (index == 29) {
            key.classList.add('a');
            key.innerHTML = "A";
        }
        if (index == 30) {
            key.innerHTML = "S";
        }
        if (index == 31) {
            key.innerHTML = "D";
        }
        if (index == 32) {
            key.innerHTML = "F";
        }
        if (index == 33) {
            key.innerHTML = "G";
        }
        if (index == 34) {
            key.innerHTML = "H";
        }
        if (index == 35) {
            key.innerHTML = "J";
        }
        if (index == 36) {
            key.innerHTML = "K";
        }
        if (index == 37) {
            key.innerHTML = "L";
        }
        if (index == 38) {
            key.innerHTML = ";";
        }
        if (index == 39) {
            key.innerHTML = "'";
        }
        if (index == 40) {
            key.innerHTML = "\\";
        }
        if (index == 41) {
            key.innerHTML = "Shift";
        }
        if (index == 42) {
            key.innerHTML = "Z";
        }
        if (index == 43) {
            key.innerHTML = "X";
        }
        if (index == 44) {
            key.innerHTML = "C";
        }
        if (index == 45) {
            key.innerHTML = "V";
        }
        if (index == 46) {
            key.classList.add("b");
            key.innerHTML = "B";
        }
        if (index == 47) {
            key.innerHTML = "N";
        }
        if (index == 48) {
            key.innerHTML = "M";
        }
        if (index == 49) {
            key.innerHTML = ",";
        }
        if (index == 50) {
            key.innerHTML = ".";
        }
        if (index == 51) {
            key.innerHTML = "/";
        }
        if (index == 52) {
            key.innerHTML = "Shift";
        }
        if (index == 53) {
            key.innerHTML = "Ctrl";
        }
        if (index == 54) {
            key.innerHTML = "<i class='fa-brands fa-windows'></i>";
        }
        if (index == 55) {
            key.innerHTML = "Alt";
        }
        if (index == 57) {
            key.innerHTML = "Alt";
        }
        if (index == 58) {
            key.innerHTML = "<i style='pointer-events:none' class=\"fa-brands fa-windows\"></i>";
        }
        if (index == 59) {
            key.innerHTML = "<i class=\"fa-sharp fa-solid fa-paste\"></i>";
        }
        if (index == 60) {
            key.innerHTML = "Ctrl";
        }
    });
}
/**
 * calling function for creating all the keyboard button
 */
createButtonForKeyboard();

/**
 * animatate key function---
 * whenever press any key the keyboard should indicat that the button was clicked
 * here i am checkign which button is clicked. Accordingo to that i set the active class to that
 * perticuler button
 */
function animateKey(e) {
    if (localkeypresssound && localkeypresssound == "true") {
        keypresssound.play();
    }
    let allkey = document.querySelectorAll(".key");
    let caps_lock = document.getElementById("key_29");
    window.addEventListener("keyup", function () {
        allkey.forEach((key) => {
            key.classList.remove('active')
        })
    })
    if (e.key == 'A' || e.key == 'a') {
        document.querySelector('.a').classList.add('active');
    }
    if (e.key == 'B' || e.key == 'b') {
        document.querySelector('.b').classList.add('active');
    }
    if (e.keyCode == 67 || e.key == 'c') {
        document.querySelector('#key_45').classList.add('active');
    }
    if (e.keyCode == 68 || e.key == 'd') {
        document.querySelector('#key_32').classList.add('active');
    }
    if (e.keyCode == 69 || e.key == 'e') {
        document.querySelector('#key_18').classList.add('active');
    }
    if (e.keyCode == 70) {
        document.querySelector('#key_33').classList.add('active');
    }
    if (e.keyCode == 71) {
        document.querySelector('#key_34').classList.add('active');
    }
    if (e.keyCode == 72) {
        document.querySelector('#key_35').classList.add('active');
    }
    if (e.keyCode == 73) {
        document.querySelector('#key_23').classList.add('active');
    }
    if (e.keyCode == 74) {
        document.querySelector('#key_36').classList.add('active');
    }
    if (e.keyCode == 75) {
        document.querySelector('#key_37').classList.add('active');
    }
    if (e.keyCode == 76) {
        document.querySelector('#key_38').classList.add('active');
    }
    if (e.keyCode == 77) {
        document.querySelector('#key_49').classList.add('active');
    }
    if (e.keyCode == 78) {
        document.querySelector('#key_48').classList.add('active');
    }
    if (e.keyCode == 79) {
        document.querySelector('#key_24').classList.add('active');
    }
    if (e.keyCode == 80) {
        document.querySelector('#key_25').classList.add('active');
    }
    if (e.keyCode == 81) {
        document.querySelector('#key_16').classList.add('active');
    }
    if (e.keyCode == 82) {
        document.querySelector('#key_19').classList.add('active');
    }
    if (e.keyCode == 83) {
        document.querySelector('#key_31').classList.add('active');
    }
    if (e.keyCode == 84) {
        document.querySelector('#key_20').classList.add('active');
    }
    if (e.keyCode == 85) {
        document.querySelector('#key_22').classList.add('active');
    }
    if (e.keyCode == 86) {
        document.querySelector('#key_46').classList.add('active');
    }
    if (e.keyCode == 87) {
        document.querySelector('#key_17').classList.add('active');
    }
    if (e.keyCode == 88) {
        document.querySelector('#key_44').classList.add('active');
    }
    if (e.keyCode == 89) {
        document.querySelector('#key_21').classList.add('active');
    }
    if (e.keyCode == 90) {
        document.querySelector('#key_43').classList.add('active');
    }
    if (e.keyCode == 32) {
        document.querySelector("#key_57").classList.add("active");
    }
    if (e.keyCode == 13) {
        document.querySelector("#key_28").classList.add("active");
    }
    if (e.keyCode == 20) {
        document.querySelector("#key_29").classList.add("active");
    }
    if (e.keyCode == 8) {
        document.querySelector("#key_14").classList.add("active");
    }
    if (e.keyCode == 221) {
        document.querySelector("#key_27").classList.add("active");
    }
    if (e.keyCode == 219) {
        document.querySelector("#key_26").classList.add("active");
    }
    if (e.keyCode == 91) {

        document.querySelector("#key_55").classList.add("active");
    }
    if (e.keyCode == 92) {

        document.querySelector("#key_59").classList.add("active");
    }
    if (e.keyCode == 9) {

        document.querySelector("#key_15").classList.add("active");
    }
    if (e.keyCode == 188) {

        document.querySelector("#key_50").classList.add("active");
    }
    if (e.keyCode == 190) {

        document.querySelector("#key_51").classList.add("active");
    }
    if (e.keyCode == 51) {

        document.querySelector("#key_4").classList.add("active");
    }
    if (e.keyCode == 52) {

        document.querySelector("#key_5").classList.add("active");
    }
    if (e.keyCode == 53) {

        document.querySelector("#key_6").classList.add("active");
    }
    if (e.keyCode == 54) {

        document.querySelector("#key_7").classList.add("active");
    }
    if (e.keyCode == 55) {

        document.querySelector("#key_8").classList.add("active");
    }
    if (e.keyCode == 56) {

        document.querySelector("#key_9").classList.add("active");
    }
    if (e.keyCode == 57) {

        document.querySelector("#key_10").classList.add("active");
    }
    if (e.keyCode == 48) {

        document.querySelector("#key_11").classList.add("active");
    }
    if (e.keyCode == 189) {

        document.querySelector("#key_12").classList.add("active");
    }
    if (e.keyCode == 187) {

        document.querySelector("#key_13").classList.add("active");
    }
    if (e.keyCode == 186) {

        document.querySelector("#key_39").classList.add("active");
    }
    if (e.keyCode == 191) {

        document.querySelector("#key_52").classList.add("active");
    }
    if (e.keyCode == 192) {

        document.querySelector("#key_1").classList.add("active");
    }
    if (e.keyCode == 49) {

        document.querySelector("#key_2").classList.add("active");
    }
    if (e.keyCode == 50) {

        document.querySelector("#key_3").classList.add("active");
    }
    if (e.keyCode == 222) {

        document.querySelector("#key_40").classList.add("active");
    }
    if (e.keyCode == 220) {

        document.querySelector("#key_41").classList.add("active");
    }
    if (e.keyCode == 17) {
        if (e.code == "ControlRight") {
            document.querySelector("#key_61").classList.add("active");

        } else {

            document.querySelector("#key_54").classList.add("active");
        }
    }
    if (e.keyCode == 18) {

        if (e.code == "AltRight") {
            document.querySelector("#key_58").classList.add("active");

        } else {
            document.querySelector("#key_56").classList.add("active");

        }
    }
    if (e.keyCode == 16) {

        if (e.code == "ShiftRight") {
            document.querySelector("#key_53").classList.add("active");
        }
        else {
            document.querySelector("#key_42").classList.add("active");
        }
    }
}

/**
 * calculaticing typing spped--
 * when ever user attamped the first char of the string then, timer will start counting the time in second
 * and when the user is on the last char then we call function clalled calculateTypingSpeed with two argument those are like 1. words, 2.taken time
 * 
 */

function tracktime(start) {
    if(start=="start")
    {
        starting_time = new Date().getTime();
        console.log("starting time")
    }
    if(start == "end")
    {
        //    console.log(new Date().getTime())
        ending_time = new Date().getTime();
        let time_in_second  = (ending_time / 1000) - (starting_time / 1000);
        return time_in_second;
    }
}
function calculateTypingSpeed(words, time) {
    let time_in_minutes = time / 60;
    let words_per_minute = words / time_in_minutes;
    words_per_minute = Math.ceil(words_per_minute);
    if (!current_words_per_minute) {
        localStorage.setItem("words_per_minute", words_per_minute);
    } {
        localStorage.setItem("words_per_minute", words_per_minute);
    }
    typing_speed_span.innerText = words_per_minute < 10 ? "0"+ words_per_minute: words_per_minute;
}