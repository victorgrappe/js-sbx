
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

        const nut_dl_old = foodRaw['product']['nutriments'];
        const nut_kl_dup = Object.keys(nut_dl_old)
            .map(food_k => food_k.split('_')[0]);
        const nut_kl = [...new Set(nut_kl_dup)];

        const unitNameMap = {
            'kJ':   {'Unit': 'J',   'Multiplier':  1000.0,      },
            //'kcal': {'Unit': 'J',   'Multiplier':  4.184,       },
            'kg':   {'Unit': 'IU',  'Multiplier':  1.0,         },
            'g':    {'Unit': 'kg',  'Multiplier':  0.001,       },
            'mg':   {'Unit': 'kg',  'Multiplier':  0.000001,    },
            'µg':   {'Unit': 'kg',  'Multiplier':  0.000000001, },
            'l':    {'Unit': 'kg',  'Multiplier':  0.1,         },
            'ml':   {'Unit': 'kg',  'Multiplier':  0.0001,      },
        }
        const nutUnitOrder = ['kJ', 'kg', 'g', 'mg', 'µg', 'l', 'ml',];
        const nut_dl = nut_kl
            .map(nut_k => ({
                'Key':      nut_k,
                'Label':    nut_dl_old[`${nut_k}_label`]    ? nut_dl_old[`${nut_k}_label`]      : null,
                'Serving':  nut_dl_old[`${nut_k}_serving`]  ? nut_dl_old[`${nut_k}_serving`]    : null,
                'Value':    nut_dl_old[`${nut_k}_value`]    ? nut_dl_old[`${nut_k}_value`]      : null,
                '100g':     nut_dl_old[`${nut_k}_100g`]     ? nut_dl_old[`${nut_k}_100g`]       : null,
                'Unit':     nut_dl_old[`${nut_k}_unit`]     ? nut_dl_old[`${nut_k}_unit`]       : null,
            }))
            .filter(nut_d =>   nut_d['Unit'] !== 'kcal')
            .filter(nut_d => !!nut_d['Unit'])
            .filter(nut_d => !!nut_d['Value'])
            .map(nut_d => ({
                'Key':          nut_d['Key'],
                'Value':        unitNameMap[nut_d['Unit']]['Multiplier'] * nut_d['100g'] * 10,
                'Unit':         unitNameMap[nut_d['Unit']]['Unit'],
            }))
            .sort((a, b) => - (a.Value - b.Value))
            .sort((a, b) => nutUnitOrder.indexOf(a.Unit) - nutUnitOrder.indexOf(b.Unit) )
        ;
        const food = {
            'Name':             foodRaw['product']['product_name'],
            'Quantity':         foodRaw['product']['quantity'],
            'URL':              foodRaw['product']['url'],
            'Labels':           foodRaw['product']['labels'],
            'Brands':           foodRaw['product']['brands'],
            'Brands.Tags':      foodRaw['product']['brands_tags'],
            'Categories':       foodRaw['product']['categories'],
            'Categories.Tags':  foodRaw['product']['categories_tags'],
            'Categories.Main':  foodRaw['product']['main_category'],
            'Categories.Hier':  foodRaw['product']['main_category'],
            'Energy (J/kg)':    nut_dl.filter( nut_d => nut_d.Key === 'energy')[0]['Value'],
            'Energy (kJ/100g)': nut_dl.filter( nut_d => nut_d.Key === 'energy')[0]['Value'] / 10000,
            'Nutriments':       nut_dl,

        }
        return food;
    } else {
        return null;
    }

}


const foodToHtml = async (food) => {

    let html = "";

    html += '<ul>';
    html += `<li>Name:             ${food['Name']}</li>`;
    html += `<li>Quantity:         ${food['Quantity']}</li>`;
    html += `<li>URL:              ${food['URL']}</li>`;
    html += `<li>Labels:           ${food['Labels']}</li>`;
    html += `<li>Brands:           ${food['Brands']}</li>`;
    html += `<li>Categories:       ${food['Categories']}</li>`;
    html += `<li>Categories.Tags:  ${food['Categories.Tags']}</li>`;
    html += `<li>Categories.Main:  ${food['Categories.Main']}</li>`;
    html += `<li>Energy :          ${food['Energy (J/kg)']} J/kg OR ${food['Energy (kJ/100g)']} kJ/100g</li>`;
    html += '</ul>';

    html += '<table>';

    html += '<thead>';
    html += '<td>Key</td>';
    html += '<td>Value</td>';
    html += '<td>Unit</td>';
    html += '</thead>';

    const nutToHtml = (nut) => {
        let html = "";
        html += '<tbody>';
        html += '<tr>';
        html += `<td>${nut['Key']}</td>`;
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
    document.getElementById("food-name"     ).innerHTML = await (await offGet(foodIndex).then(offNorm).then(food => food.Name));
    document.getElementById("food-detail"   ).innerHTML = await (await offGet(foodIndex).then(offNorm).then(foodToHtml));
}

offGet(3017620425035).then( x => console.log(x) );
