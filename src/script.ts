let TOLERANCE:number=5;
const TICK_SPEED : number=0.1;
let cN=300


// *************************UTILS*****************************************************
function delay(ms : number) : Promise<void>{
        return new Promise(resolve => setTimeout(resolve, ms));
}



interface Point{
    X:number,
    Y:number
}
// *********************UTILS_ENDED*********************************************************



// AABB collision detection system (Axis Aligned Box Bounding System(Kindaa!)
// ******************************COLLISION_DETECTION**************************************************************
let collided:boolean=false;
function collisionDetection(pointer : HTMLDivElement, lowerColumnsCoord: Point[], upperColumnsCoord: Point[]): number {
    
    let pointerCoord={
        X:pointer.getBoundingClientRect().x+pointer.getBoundingClientRect().width,
        Y:pointer.getBoundingClientRect().y+pointer.getBoundingClientRect().height
    };
    
         upperColumnsCoord.forEach((coordsColumn) => {
        if(Math.abs(pointerCoord.X-coordsColumn.X)<=TOLERANCE-1 && Math.abs(pointerCoord.Y-coordsColumn.Y)<=TOLERANCE-1){
            collided=true;
        }
    })
    
    lowerColumnsCoord.forEach((coordsColumn) => {
        
        if(Math.abs(pointerCoord.X-coordsColumn.X)<=TOLERANCE && Math.abs(pointerCoord.Y-coordsColumn.Y)<=TOLERANCE){
            collided=true;
        }

        
    })


    if(collided){
        return pointerCoord.X
    }
    collided=false;
    return -1;
}
// ************************************************COLLISION_DETECTION_ENDED******************************************





let DESTx : number =0;
let Xvelocity : number=30;
let Yvelocity : number = 0;

const input = document.querySelector("#Xvelocity") as HTMLInputElement;
input.addEventListener("input", () => {
    Xvelocity = parseInt(input.value);
});

const input2 = document.querySelector("#Yvelocity") as HTMLInputElement;
input2.addEventListener("input", () => {
    Yvelocity = -1*parseInt(input2.value);
});




// ******************************GEN_COLLOUMNS************************************************************
const genColoumns = (): void => {
    const gameInterface = document.querySelector("#gameInterface") as HTMLDivElement;
    if(isMobilePhone()){
        cN=100
    }
    for(let i = 0; i < cN; i++){
        
        const coloumnContainer = document.createElement("div");
        coloumnContainer.classList.add("coloumnContainer");
        
        const upperColumn = document.createElement("div");
        upperColumn.style.backgroundColor = "green";
        upperColumn.style.height = 150+Math.sin(i*0.1)*30+"px";
        upperColumn.classList.add("upper-coloumn");
        
        const lowerColumn = document.createElement("div");
        lowerColumn.style.backgroundColor = "green";
        lowerColumn.style.height = 150-Math.sin(i*0.1)*30+"px";
        lowerColumn.classList.add("lower-coloumn");
    
        upperColumn.classList.add("coloumn")
        lowerColumn.classList.add("coloumn")
    
        coloumnContainer.appendChild(upperColumn);
        coloumnContainer.appendChild(lowerColumn);
        gameInterface.appendChild(coloumnContainer);
        if(i==cN-1){
            DESTx=coloumnContainer.getBoundingClientRect().x
        }
    }

    
}
genColoumns();
// ************************************************GEN_COLLOUMNS_ENDED******************************************

const lowerColoumns : NodeListOf<HTMLDivElement> = document.querySelectorAll(".lower-coloumn")

let PATH_WIDTH = lowerColoumns[cN-1].getBoundingClientRect().x-lowerColoumns[0].getBoundingClientRect().x



// ***************COORDS OF COLOUMNS**************************************************************
let lowerColumnsCoord : Point[] = [];
let upperColumnsCoord : Point[] = [];

const getCoordsLower = () :void =>{
    const lowerColoumns : NodeListOf<HTMLDivElement> = document.querySelectorAll(".lower-coloumn");
    // console.log(lowerColoumns);
    lowerColoumns.forEach(lcoloumn => {
        const coord : Point = {X:lcoloumn.getBoundingClientRect().x,Y:lcoloumn.getBoundingClientRect().y};
        lowerColumnsCoord.push(coord);
    });
}

getCoordsLower();

const getCoordsUpper = () :void =>{
    const lowerColoumns : NodeListOf<HTMLDivElement> = document.querySelectorAll(".upper-coloumn");
    // console.log(lowerColoumns);
    lowerColoumns.forEach(ucoloumn => {
        const coord:Point = {
                                X:ucoloumn.getBoundingClientRect().x + ucoloumn.getBoundingClientRect().width,
                                Y:ucoloumn.getBoundingClientRect().y+ucoloumn.getBoundingClientRect().height
                            };
        upperColumnsCoord.push(coord);
    });
}

getCoordsUpper();
// ******************************COORDS OF COLOUMNS ENDED************************************************************



const movePointer = async() : Promise<void> => {
    const pointer = document.querySelector("#pointer") as HTMLDivElement;
    pointer.style.position="absolute";
    pointer.style.top="275px";
    pointer.style.left="10px";

    if(isMobilePhone()){
        pointer.style.top="300px";
        TOLERANCE=3;
    }
    

    let pointerX=pointer.getBoundingClientRect().x;
    let pointerY=pointer.getBoundingClientRect().y;
    
    while(pointerX <= DESTx){
        

        const result:number = collisionDetection(pointer, lowerColumnsCoord, upperColumnsCoord); 
        if(result !== -1){
            const scoreCard=document.querySelector("#user-score") as HTMLDivElement;
            const score:number=pointerX
            scoreCard.innerHTML="Your score: "+score;
            return;
        }

        pointer.style.left=parseInt(pointer.style.left)+TICK_SPEED*Xvelocity+"px";
        pointerX=pointer.getBoundingClientRect().x;
        pointer.style.top=parseInt(pointer.style.top)+TICK_SPEED*Yvelocity+"px";
        pointerY=pointer.getBoundingClientRect().y;
        await delay(100)
    }

    const scoreCard=document.querySelector("#user-score") as HTMLDivElement;
    scoreCard.innerHTML="Your score: "+pointerX;

}



// ***************************DEVICE_CHECK(CHAT_GPT_GENERATED)***************************

function isMobilePhone() {
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;

    // 1. User Agent Check (aggressive regex)
    const isMobileUA = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|rim)|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(userAgent) ||
                       /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|v)a|alco|amoi|an(d|on)|android|anni|applec|ap(ap|ti)0|aq(0|c)\.mp|as(cd|dc)|atoz|av(ne|ie)|bada|bigo|bird|bw\-(n|u)|c55o|c660|camg|capi|cell|chtm|cime|city|clko|co(mp|nd)|craw|da(is|eo)|dc\-s|devi|dica|dmob|do(c|og|w)|ec(ko|le)|ef(ca|us)|eg(ym|eu)|excq|ez00|ez60|ez70|ezmo|ezze|el(0d|at|te)|fly(p|_)|gamma|gl(ib|rd)|good|gos|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(|ht|tv)|tya)(o|o a|p\-)|hubc|ibi(h|a)|ibio|ic(47|92|ul)|gaka|gcom|gecko|gr(kg|kr)|go(\.w|od)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(|ht|tv)|tya)(o|o a|p\-)|hubc|ibi(h|a)|ibio|ic(47|92|ul)|id(ja|o|n)|inno|ipaq|iris|jata|java|jbro|jemu|jigs|kddi|keji|kgt(|wa)|klon|kpt |kwc|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50t|\bon|v)|lycos|leno|m1\-w|m3ga|m50\/|ma(te|er|k0)|me(nu|ve)|mi(o8|oa|ts)|mmef|mo(01|h|mm|f|to)|nbad|nand|ne(on|cr)|netf|nokia|nook|np(i|me)|od\-ev|oper|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|ga|ki)|phil|pl(ay|ta)|pm(p|un)|p0(x|x a|n|t)|pn\-2|po(ck|fe)|phone|py(mo|s)|qa\-a|qc(07|12|21|32|60|g\-|vi)|raks|rim9|ro(ve|sa)(on|te)|s55\/|s7(ad|go|ma)|sc(ad|er|ko)|sdg\-|se(b|am)|si(5u|7a)|shar|sie(\-(k|m)|75x)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(us|nd)|st(ca|v)a|t1(im|sh)|tb(ad|ap)|tc(ad|eg|h)|tdg\-|tel(i|m)|tim\-|tm(sa|un)|topl|ts(70|mp)|ui(f|go)|um(th|en)|vasi|vk(4|8)|vm(g|ty)|wg(nd|lw)|wm(h|k|ul)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(userAgent.substr(0, 4));

    // 2. Screen Size Check (common phone max width)
    // Using screen.width and screen.height for physical device screen resolution
    // Using window.innerWidth and window.innerHeight for current viewport size
    const screenWidth = Math.min(window.screen.width, window.screen.height); // Get the smaller dimension for portrait
    const isSmallScreen = screenWidth < 768; // Typical threshold for phones vs tablets/desktops

    // 3. Touch Capability Check
    const hasTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || ((navigator as any).msMaxTouchPoints > 0);

    // A common combination:
    // It's a mobile phone if it looks like a mobile UA AND has a small screen (likely portrait/phone sized) AND has touch.
    // Or, if it's a tablet UA but has a very small screen (might indicate a phone using a tablet UA).
    return (isMobileUA && isSmallScreen) || // Clearly a mobile UA on a small screen
           (isMobileUA && hasTouch);       // A mobile UA and has touch (covers some tablets too)
           // You might refine this further depending on your definition of "phone" vs "tablet"
}

if(isMobilePhone()){
    console.log("This is a mobile phone")
} 

const userBTN=document.querySelector(".USER")


userBTN?.addEventListener("click", () => {    
    movePointer()
})


// ***************************DEVICE_CHECK_ENDED*********************


// *************************************************************************
// **********************AI_PORTION*****************************************


class LayerDense{
    
    
    public inputSize: number;
    public outputSize: number;
    public weights: number[][]; // Weights matrix: inputSize rows, outputSize columns
    public biases: number[];

    constructor(inputSize : number, outputSize : number){
        this.inputSize = inputSize;
        this.outputSize = outputSize;
        this.weights = new Array(this.inputSize).fill(0).map(() => new Array(this.outputSize).fill((Math.random()*2)-1));
        this.biases = new Array(this.outputSize).fill((Math.random()*2)-1);

    }

    forwardPass(input : number[], wts:number[][], bia:number[]) : number[]{
        let output = new Array(this.outputSize).fill(0);
        for (let i = 0; i < this.inputSize; i++) {
            for (let j = 0; j < this.outputSize; j++) {
                output[j] += input[i] * wts[i][j];
            }
        }
        for (let i = 0; i < this.outputSize; i++) {
            output[i] += bia[i];
        }
        return output;
    }

    getParams():[number[][], number[]]{
        return [this.weights, this.biases];
    }
    
    resetParams():[number[][], number[]]{
        let new_wts = new Array(this.inputSize).fill(0).map(() => new Array(this.outputSize).fill(0));
        let new_bia = new Array(this.outputSize).fill(0);

        for (let i = 0; i < this.inputSize; i++) {
            for (let j = 0; j < this.outputSize; j++) {
                new_wts[i][j]=this.weights[i][j]+((Math.random()*2)-1)*0.05;
            }
        }

        for(let i=0;i<this.outputSize;i++){
            new_bia[i]=this.biases[i]+(Math.random()*2-1)*0.1;
        }

        return [new_wts, new_bia];
    }

}

class Activation_ReLU{
    forwardPass(input : number[]) : number[]{
        return input.map(x => Math.max(-100, x));
    }
}

class Activation_SoftMax{
    forwardPass(input : number[]) : number[]{
        const exps = input.map(x => Math.exp(x));
        const sum = exps.reduce((a, b) => a + b, 0);
        return exps.map(x => x / sum);
    }
}

const Layer1=new LayerDense(1, 15)
const Layer2=new LayerDense(15, 15)
const Layer3=new LayerDense(15, 1)

function output(x:number, layer1_wts:number[][], layer1_bia:number[], layer2_wts:number[][], layer2_bia:number[], layer3_wts:number[][], layer3_bia:number[]):number[]{

    const output1=Layer1.forwardPass([x], layer1_wts, layer1_bia)
    const output2=Layer2.forwardPass(new Activation_ReLU().forwardPass(output1), layer2_wts, layer2_bia)
    const output3=Layer3.forwardPass(new Activation_ReLU().forwardPass(output2), layer3_wts, layer3_bia)
    return output3
}

const aiBTN=document.querySelector(".AI")


const restart=() : void =>{
    const pointer = document.querySelector("#pointer") as HTMLDivElement;
    pointer.style.position="absolute";
    pointer.style.top="275px";
    pointer.style.left="10px";
}

const aiMovePointer = async() : Promise<void> => {
    const pointer = document.querySelector("#pointer") as HTMLDivElement;
    pointer.style.position="absolute";
    pointer.style.top="275px";
    pointer.style.left="15px";

    if(isMobilePhone()){
        pointer.style.top="300px";
        TOLERANCE=3;
    }
    

    let pointerX=pointer.getBoundingClientRect().x;
    let pointerY=pointer.getBoundingClientRect().y;
    let iteration:number=0;
    
    // console.log(DESTx);
    while(pointerX <= DESTx ){
        
        // console.log("L_1_wts: ", Layer1.weights)
        

        let result:number = collisionDetection(pointer, lowerColumnsCoord, upperColumnsCoord); 
        if(result !== -1 || (pointerY>=300 || pointerY<=230)){
            

            const scoreCard=document.querySelector("#ai-score") as HTMLDivElement;
            const iterCard=document.querySelector("#iter") as HTMLDivElement;
            iteration++;
            const current_score:number=pointerX
            scoreCard.innerHTML="AI score: "+current_score;
            iterCard.innerHTML="Iteration: "+iteration


            collided=false;
            restart();
            let test_wts1=Layer1.resetParams()[0];
            let test_bia1=Layer1.resetParams()[1];
            
            let test_wts2=Layer2.resetParams()[0];
            let test_bia2=Layer2.resetParams()[1];
            
            let test_wts3=Layer3.resetParams()[0];
            let test_bia3=Layer3.resetParams()[1];

            let testScorePromise:Promise<number>=tester(test_wts1, test_bia1, test_wts2, test_bia2, test_wts3, test_bia3)
            iteration++;
            let testScore:number=await testScorePromise
            console.log(testScore," ", current_score)
            
            iterCard.innerHTML="Iteration: "+iteration
            

            if(testScore>=current_score){
                // console.log("testScore>=current_score")
                Layer1.weights=test_wts1
                Layer1.biases=test_bia1

                Layer2.weights=test_wts2
                Layer2.biases=test_bia2

                Layer3.weights=test_wts3
                Layer3.biases=test_bia3
            }

            restart()

            // return

        }

        console.log("Back in the original code Block!!")

        pointer.style.backgroundColor="red"


        pointer.style.left=parseInt(pointer.style.left)+TICK_SPEED*Xvelocity+"px";
        pointerX=pointer.getBoundingClientRect().x;
        
        const factor=output(pointerX/50, Layer1.weights, Layer1.biases, Layer2.weights, Layer2.biases, Layer3.weights, Layer3.biases)
        // console.log("FACTOR: ",factor)
        pointer.style.top=parseInt(pointer.style.top)+TICK_SPEED*factor[0]*Xvelocity+"px";
        const slider=document.getElementById("Yvelocity") as HTMLInputElement;
        slider.value=(factor[0]*Xvelocity).toString();
        
        pointerY=pointer.getBoundingClientRect().y;
        await delay(20)
    }

    const scoreCard=document.querySelector("#user-score") as HTMLDivElement;
    scoreCard.innerHTML="Your score: "+pointerX;

}

const tester = async(test_wts1:number[][], test_bia1:number[], test_wts2:number[][], test_bia2:number[], test_wts3:number[][], test_bia3:number[]) : Promise<number> => {
    const pointer = document.querySelector("#pointer") as HTMLDivElement;
    pointer.style.backgroundColor="royalblue";
    pointer.style.position="absolute";
    pointer.style.top="275px";
    pointer.style.left="15px";

    if(isMobilePhone()){
        pointer.style.top="300px";
        TOLERANCE=3;
    }
    

    let pointerX=pointer.getBoundingClientRect().x;
    let pointerY=pointer.getBoundingClientRect().y;
    
    // console.log(DESTx);
    while(pointerX <= DESTx ){
        

        let result:number = collisionDetection(pointer, lowerColumnsCoord, upperColumnsCoord); 
        if(result !== -1 || (pointerY>=300 || pointerY<=230)){
            const current_score:number=pointerX

            collided=false;

            return current_score

        }

        pointer.style.left=parseInt(pointer.style.left)+TICK_SPEED*Xvelocity+"px";
        pointerX=pointer.getBoundingClientRect().x;
        
        const factor=output(pointerX/50, test_wts1, test_bia1, test_wts2, test_bia2, test_wts3, test_bia3)
        console.log("FACTOR: ",factor)
        pointer.style.top=parseInt(pointer.style.top)+TICK_SPEED*factor[0]*Xvelocity+"px";
        const slider=document.getElementById("Yvelocity") as HTMLInputElement;
        slider.value=(factor[0]*Xvelocity).toString();
        
        pointerY=pointer.getBoundingClientRect().y;
        await delay(20)
    }

    const scoreCard=document.querySelector("#user-score") as HTMLDivElement;
    scoreCard.innerHTML="Your score: "+pointerX;

    return 100;

}





aiBTN?.addEventListener("click", () => {
    aiMovePointer();
})















