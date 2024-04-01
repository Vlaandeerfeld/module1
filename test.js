async function functionMain(){

    let counter = 0;
    const array1 = [0, 1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];
    async function function1(){
        counter++;
        if (counter < 10){
            for (let x = 0; x < 10; x++){
                console.log(x);
                return(x);
            }
        }
        else{
            console.log("in here");
        }
    }

    const promise2 = array1.map(element => {
        const promise1 = function1();
        console.log(element);
        return Promise.resolve(promise1);
    });

    const output = await Promise.all(promise2);
    console.log(output);
}
functionMain();