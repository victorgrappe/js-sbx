


const ndbGet = async (foodIndex) => {

    const pageNb    = 1;
    const apiKey    = 'TtX66x7P4HIdRX5FdN2I2UnyltuxAXNhddCgQsvr';
    const url       = `https://api.nal.usda.gov/fdc/v1/foods/search?query=${foodIndex}&pageSize=${pageNb}&api_key=${apiKey}`;

    console.log(`Fetching food ${foodIndex}`)

    const food = await fetch(url)
        .then((response) => {
            if (!response.ok){
                throw new Error(`ERROR: HTTP status : ${response.status}`);
            } else {
                return response.json()
            }
        })
        .then((json) => {
            if (json.foods.length === 0) {
                throw new Error(`Food ${foodIndex} not found`);
            } else if (json.foods.length > 1){
                throw new Error(`Food ${foodIndex} not unique`)
            } else {
                return json.foods[0];
            }
        })
        .catch(e => {console.log('ERROR: ' + e.message);
        });

    return food;
}


const ndbParse = async (foodRaw) => {

    nutr_l = foodRaw.foodNutrients

    console.log(nutr_l);

    food = {
        'Index':        foodRaw.ndbNumber,
        'Name':         foodRaw.description,
        'NameBinomial': foodRaw.scientificName,
        'Category':     foodRaw.foodCategory,
        'Nutr.Energy':  nutr_l.filter( nutr => nutr.nutrientId === 1062)[0],
    }
    return food;
}


const foodUpdate = async () => {
    foodIndex = document.getElementById('foodIndex').value
    document.getElementById("food").innerHTML = await (await ndbGet(foodIndex).then(ndbParse).then(food => food.Name));
}


ndbGet(12061).then( x => console.log(x));
// ndbGet(12061).then(ndbParse).then( x => console.log(x));
// ndbGet(11125).then(ndbParse).then( x => console.log(x));
// ndbGet(1234567890).then(ndbParse).then( x => console.log(x));

