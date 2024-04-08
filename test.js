async function tryGetAPI(){
    keys = '3d8b532b6amsh9d0a8e0a2b73df6p1748b4jsn711a2222c274';
    let options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': keys,
            'X-RapidAPI-Host': 'hockey1.p.rapidapi.com'
        }
    };
    try {
        const response = await fetch(url, options);
        const result = await response.json()
        console.log(await result.body);
        localStorage[url] = JSON.stringify(result);
        console.log(url);
        localStorage[url + 'day'] = day;
        localStorage[url + 'month'] = month;
        localStorage[url + 'year'] = year;
        counter1 = counter1 + 1;
        console.log(counter1);
        return result;
    } catch (error) {
        console.error(error);
    }
}

async function functionMain(){

    let counter = 0;
    const array1 = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];
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