async function sendApiRequest() {
    const userInput = document.getElementById("input").value
    const inputBox = document.createElement("input")
    console.log(userInput)

    const giphyApiKey = "Bhx9WisWg50kcqriLhdZQJYiycqFewTV";
    const giphyApiUrl = `https://api.giphy.com/v1/gifs/search?q=${userInput}&rating=g&api_key=${giphyApiKey}`;

    await fetch(giphyApiUrl).then(function(data) {
        return data.json()
    })
    .then(function(json) {
        console.log(json.data[0].images.fixed_height.url)
        const imgPath = json.data[0].images.fixed_height.url
        const img = document.createElement("img")
        img.setAttribute("src:", imgPath)
        document.body.appendChild(img)
    })
  }



  document.getElementById("gifBtn").addEventListener("click", () => {
      sendApiRequest()
  })
