






const getRandomUser = (gender) => {
    // const url = 'https://randomuser.me/api';
    const url = 'https://httpbin.org/post';
    // const url = 'https://randomuser.me/api/?gender=female';
    // const url = 'https://randomuser.me/api';

    const data = {
        gender: 'male',
    }
    const request = new Request(url, {
        method: 'POST',
        body: data,
        headers: new Headers()
    });
    fetch(url)
    .then((resp) => resp.json())
    .then(function(data) {
      console.log(data);
      // let authors = data.results;
      // let author = authors[0];
      // console.log(author.name.first)
      console.log("[SUCCESS]");
    })
    .catch(function() {
      console.log("[FAIL]");
    });

}



getRandomUser();

// const url = 'https://randomuser.me/api/?results=10';




// https://randomuser.me/documentation
// https://www.digitalocean.com/community/tutorials/how-to-use-the-javascript-fetch-api-to-get-data-fr



let title = document.getElementById('title');




