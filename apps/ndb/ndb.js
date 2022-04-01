


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
        .catch(e => {console.log('ERROR: ' + e.message);});

    return food;
}


const ndbNorm = async (foodRaw) => {

    const nutRaw_dl = foodRaw.foodNutrients;
    const unitNameMap = {
        'kJ':   {'Unit': 'J',   'Multiplier':  1000.0,      },
        //'KCAL': {'Unit': 'J',   'Multiplier':  4.184,       },
        'IU':   {'Unit': 'IU',  'Multiplier':  1.0,         },
        'G':    {'Unit': 'kg',  'Multiplier':  0.001,       },
        'MG':   {'Unit': 'kg',  'Multiplier':  0.000001,    },
        'UG':   {'Unit': 'kg',  'Multiplier':  0.000000001, },
    }
    const nutUnitOrder = ['J', 'IU', 'kg',];
    const nut_dl = nutRaw_dl
        .filter(nut_d => nut_d.unitName !== 'KCAL')
        .map(nut_d => ({
            'Index':    nut_d.nutrientId,
            'Name':     nut_d.nutrientName,
            'Value':    unitNameMap[nut_d.unitName]['Multiplier'] * nut_d.value * 10,
            'Unit':     unitNameMap[nut_d.unitName]['Unit'],
        }))
        .sort((a, b) => - (a.Value - b.Value))
        .sort((a, b) => nutUnitOrder.indexOf(a.Unit) - nutUnitOrder.indexOf(b.Unit) )
    ;
    const food = {
        'Index':            foodRaw.ndbNumber,
        'Description':      foodRaw.description,
        'Binomen':          foodRaw.scientificName,
        'Category':         foodRaw.foodCategory,
        'Energy (J/kg)':    nut_dl.filter( nut_d => nut_d.Index === 1062)[0]['Value'],
        'Energy (kJ/100g)': nut_dl.filter( nut_d => nut_d.Index === 1062)[0]['Value'] / 10000,
        'Nutriments':       nut_dl,
    }
    return food;
}

const foodToHtml = async (food) => {

    let html = "";

    html += '<ul>';
    html += `<li>Index: ${food['Index']}</li>`;
    html += `<li>Description: ${food['Description']}</li>`;
    html += `<li>Binomen: ${food['Binomen']}</li>`;
    html += `<li>Category: ${food['Category']}</li>`;
    html += `<li>Energy : ${food['Energy (J/kg)']} J/kg OR ${food['Energy (kJ/100g)']} kJ/100g</li>`;
    html += '</ul>';

    html += '<table>';

    html += '<thead>';
    html += '<td>Index</td>';
    html += '<td>Name</td>';
    html += '<td>Value</td>';
    html += '<td>Unit</td>';
    html += '</thead>';

    const nutToHtml = (nut) => {
        let html = "";
        html += '<tbody>';
        html += '<tr>';
        html += `<td>${nut['Index']}</td>`;
        html += `<td>${nut['Name']}</td>`;
        html += `<td>${nut['Value']}</td>`;
        html += `<td>${nut['Unit']}</td>`;
        html += '</tr>';
        html += '</tbody>';
        return html;
    }
    html += food['Nutriments'].map(nutToHtml).join('')

    html += '</table>';

    return html;
}


const foodUpdate = async () => {
    foodIndex = document.getElementById('foodIndex').value;
    document.getElementById("food-name"     ).innerHTML = await (await ndbGet(foodIndex).then(ndbNorm).then(food => food.Description));
    document.getElementById("food-detail"   ).innerHTML = await (await ndbGet(foodIndex).then(ndbNorm).then(foodToHtml));
}


ndbGet(12061).then( x => console.log(x));
// ndbGet(12061).then(ndbParse).then( x => console.log(x));
ndbGet(12061).then(ndbNorm).then( x => console.log(x));
ndbGet(12061).then(ndbNorm).then( x => console.log(x));
// ndbGet(11125).then(ndbParse).then( x => console.log(x));
// ndbGet(1234567890).then(ndbParse).then( x => console.log(x));

