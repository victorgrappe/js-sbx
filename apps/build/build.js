

dot_dl= [
    {"key":"tomato", "j":10.0, "kg":1.0},
    {"key":"potato", "j":10.0, "kg":1.0},
    {"key":"tomato", "j":10.0, "kg":1.0},
    {"key":"tomato", "j":10.0, "kg":1.0},
    {"key":"tomato", "j":10.0, "kg":1.0},
]


fetch('./dot_dl.json')
.then(response => {
   return response.json();
})
.then(data => console.log(data));


const toHtml = async (dot_dl) => {

    let html = '';

    html += '<table>';

    html += '<thead>';
    html += '<td>key</td>';
    html += '<td>j</td>';
    html += '<td>kg</td>';
    html += '</thead>';

    const dotToHtml = (dot_d) => {
        let html = '';
        html += '<tbody>';
        html += '<tr>';
        html += `<td>${dot_d['key']}</td>`;
        html += `<td>${dot_d['j']}</td>`;
        html += `<td>${dot_d['kg']}</td>`;
        html += '</tr>';
        html += '</tbody>';
        return html;
    }
    html += dot_dl.map(dotToHtml).join('')

    html += '</table>';



    return html;
}



const refresh = async () => {
    console.log("Update ...");
    document.getElementById("dot_table").innerHTML = await (await toHtml(dot_dl));
    console.log("Updated !");
}

