
/*
Open Food Facts:
https://fr.openfoodfacts.org/

API Specification
https://wiki.openfoodfacts.org/API/Read/Product#Name
 */

const offGet = async (food_ean) => {

    const url = `https://world.openfoodfacts.org/api/v0/product/${food_ean}.json`;

    console.log(`Fetching food ${food_ean}`)

    const food = await fetch(url)
        .then((response) => {
            if (!response.ok){
                throw new Error(`ERROR: HTTP status : ${response.status}`);
            } else {
                return response.json()
            }
        })
        .then((json) => {
            if (json.status === 0) {
                throw new Error(`Food ${food_ean} not found`);
                return null;
            } else {
                console.log(`Food ${food_ean} found`);
                return json;
            }
        })
        .catch(e => {console.log('ERROR: ' + e.message);
        });

    return food;
}


const offNorm = async (foodRaw) => {

    if (foodRaw){
        const food = {
            'Name':     foodRaw['product']['product_name'],
        }
        return food;
    } else {
        return null;
    }

}


const foodUpdate = async () => {
    foodIndex = document.getElementById('foodIndex').value;
    document.getElementById("food-name"     ).innerHTML = await (await offGet(foodIndex).then(offNorm).then(food => food.Name));
}

offGet(3017620425035).then( x => console.log(x) );
offGet(654654).then( x => console.log(x) );
