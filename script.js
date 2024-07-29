// search all element by query selector method

const inputSlider=document.querySelector("[data-lengthSlider]");
const lengthDisplay=document.querySelector("[data-lenghtNumber]");
const passwordDisplay=document.querySelector("[data-passwordDisplay]");
const copyBtn=document.querySelector("[data-copy]");
const copyMsg=document.querySelector("[data-copyMsg]");
const uppercaseCheck=document.querySelector("#uppercase");
const lowercaseCheck=document.querySelector("#lowercase");
const numbersCheck=document.querySelector("#numbers");
const symbolsCheck=document.querySelector("#symbols");
const indicator=document.querySelector("[data-indicator]");
const generateBtn=document.querySelector(".generatButton");
const allCheckBox=document.querySelectorAll("input[type=checkbox]");

const symbols='!@#$%^&*()-_=+[]{}\|;:",./<>?`~';


// default password length 10
let password="";
let passwordLength=10;
let checkCount=0;

//set strenght circle to grey
setIndicator("#ccc");

//----------function implementation----------

//slider function default
function handleSlider(){
    inputSlider.value=passwordLength;
    lengthDisplay.innerText=passwordLength;

    //hw
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ( (passwordLength - min)*100/(max - min)) + "% 100%";
}
handleSlider();


//indicator color
function setIndicator(color){
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}


//create random integer
function getRandInteger(min,max){
    return Math.floor(Math.random()*(max-min)) + min;
}

function generateRandomNumber(){
    return getRandInteger(0,9);
}

function generateLowerCase(){
    return String.fromCharCode(getRandInteger(97,123));
}
function generateUpperCase(){
    return String.fromCharCode(getRandInteger(65,91));
}
function generateSymbols(){
    const randNum=getRandInteger(0,symbols.length);
    return symbols.charAt(randNum);
}

//strength calculate

function calcStrenght(){

    let hasUpper=false;
    let hasLower=false;
    let hasNum=false;
    let hasSym=false;

    if(uppercaseCheck.checked) hasUpper=true;
    if(lowercaseCheck.checked) hasLower=true;
    if(numbersCheck.checked) hasNum=true;
    if(symbolsCheck.checked) hasSym=true;


    if(hasUpper && hasLower && (hasNum || hasSym) && passwordLength>=8){
        setIndicator("#0f0");
    }
    else if((hasLower || hasUpper) && (hasNum || hasSym) && passwordLength>=6){
        setIndicator("#ff0");
    }
    else{
        setIndicator("#f00");
    }
}

//copy to clipboard

async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText="Copied";
    }
    catch(e){
        copyMsg.innerText="Failed";
    }

    //to make copy wala span visible
    copyMsg.classList.add("active");

    setTimeout( ()=>{
        copyMsg.classList.remove("active");
    },2000);
}

//suffle password function
function sufflePassword(array){
    //Fisher yates method
    for(let i=array.length -1; i>0; i--){
        //finding random j
        const j=Math.floor(Math.random() * (i+1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str="";
    array.forEach( (el)=> (str+=el));
    return str;
}

//--------we use eventlistener-------


//add event listener in check box

function handleCheckBoxChange(){
    checkCount=0;
    allCheckBox.forEach((checkbox)=>{
        if(checkbox.checked)
            checkCount++;
    });

    //special consition default
    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }

}
allCheckBox.forEach( (checkbox)=>{
    checkbox.addEventListener('change', handleCheckBoxChange);
})


//slider event listener
inputSlider.addEventListener('input',(e)=>{
    passwordLength = e.target.value;
    handleSlider();
});

//copy button event listener

copyBtn.addEventListener('click',()=>{
    if(passwordDisplay.value){ //password display >0 2nd logic
        copyContent();
    }
});

//generate password eventListener

generateBtn.addEventListener('click', ()=>{
    // none of the check box are selected
    
    if(checkCount==0) return;

    if(passwordLength < checkCount){
        passwordLength=checkCount;
        handleSlider();
    }

    //let's start the journey to find new password
    //remove old password
    password="";

    //let's put the stuff mentioned by checkboxes
    // if(uppercaseCheck.checked){
    //     password=generateUpperCase();
    // }
    // if(lowercaseCheck.checked){
    //     password=generateLowerCase()
    // }
    // if(numbersCheck.checked){
    //     password=generateRandomNumber();
    // }
    // if(symbolsCheck.checked){
    //     password=generateSymbols();
    // } 

    let funcArr=[];

    if(uppercaseCheck.checked)
        funcArr.push(generateUpperCase);
    if(lowercaseCheck.checked)
        funcArr.push(generateLowerCase);
    if(numbersCheck.checked)
        funcArr.push(generateRandomNumber);
    if(symbolsCheck.checked)
        funcArr.push(generateSymbols);

    //compulsory addition
    for(let i=0;i<funcArr.length;i++){
        password+=funcArr[i]();
    }

    //remaining addition
    for(let i=0; i<passwordLength-funcArr.length; i++){
        let randIndex = getRandInteger(0, funcArr.length);
        console.log("randIndex: " + randIndex);
        password+=funcArr[randIndex]();
    }

    //suffle the password
    password=sufflePassword(Array.from(password));

    //show in UI
    passwordDisplay.value=password;
    //calculate strength
    calcStrenght();

});



