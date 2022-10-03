const fetchData = async (searchTerm) => {
    const response = await axios.get('http://www.omdbapi.com/', {
        params: {
            apikey: '55de8aaa',
            s: searchTerm
        }
    });
    console.log(response.data);
};

const input = document.querySelector('input');

let timeoutID;
const onInput = event => {
    if (timeoutID) {
        clearTimeout(timeoutID);
    }    
    timeoutID = setTimeout(() =>  {
        fetchData(event.target.value);
    }, 500)
};
input.addEventListener('input', onInput);