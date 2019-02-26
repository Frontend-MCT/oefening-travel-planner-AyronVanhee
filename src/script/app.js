console.log('Welcome there! 🅱🅱🅱')

let countryHolder, amountholder;
const localKey = 'travel-planner';

const addItem = key =>{
    let countries = getAllItems();
    countries.push(key);
    localStorage.setItem(localKey, JSON.stringify(countries));
    countItems();
}; 

const removeItem = key=>{
  const index = getAllItems().indexOf(key);
  let savedCountries = getAllItems();
  savedCountries.splice(index,1);
  localStorage.setItem(localKey, JSON.stringify(savedCountries));
}; 

const updateCounter = ()=>{
    document.querySelector('.js-amount').innerHTML = countItems();
}


const getAllItems = () =>{
  //  if(localStorage.hasItem(localKey)){
      //  return localStorage.getItem(localKey);
    //}else{
        //return [];
    //}

    return JSON.parse(localStorage.getItem(localKey)) || []    
};

const countItems = () => {
    return getAllItems().length;
};


const hasItem = key =>{
    return getAllItems().includes(key);
}; 

const fadeAndRemoveNotification = notification => {

    notification.addEventListener('transitionend', function(){

        console.log('Done');
        document.querySelector('.js-notification-holder').removeChild(notification);
    });

 
notification.classList.add('u-fade-out');

}

const showNotification= element => {
    let notification = document.createElement('div');
    notification.classList.add('c-notification');

    notification.innerHTML =`<h2 class="c-notification__header">You have selected ${element.dataset.countryName}.</h2>
    <button class="c-notification__action">Undo</button>
</div>`;

    document.querySelector('.js-notification-holder').append(notification);
    setTimeout(() => {
        fadeAndRemoveNotification(notification);

    }, 1500);

}

const addListenersToCountries = function(classSelector) {
    const countries = document.querySelectorAll(classSelector);
    for (const country of countries) {
        country.addEventListener('click', function() {
            console.log();

            console.log('je klikt op een land', this);
            const countryKey = this.getAttribute('for');
            if(hasItem(countryKey)){
                removeItem(countryKey);
            }else{
                addItem(countryKey); //for heeft de correcte en unieke key
                showNotification(country);
            }
            updateCounter();

        }) ;   
    }
}

const showCountries = data => {
    console.log(data);
    //#1 loop the data
    let countries ='';

    document.querySelector('.js-amount').innerHTML = countItems();

    for (const c of data){
    //#2 build an html string for each country
    countries += `
        <article>
                        <input id="${c.cioc}-${c.alpha2Code}" class="o-hide c-country-input" type="checkbox"  ${hasItem(c.cioc + '-' + c.alpha2Code) ? 'checked="checked"' : ''} />
                        <label for="${c.cioc}-${c.alpha2Code}" class="c-country js-country" data-country-name="${c.name}">
                            <div class="c-country-header">
                                <h2 class="c-country-header__name">${c.name}</h2>
                                <img class="c-country-header__flag" src="${c.flag}" alt="The flag of ${c.name}.">
                            </div>
                            <p class="c-country__native-name">${c.nativeName}</p>
                        </label>
                </article>`;
    }
   
    countryHolder.innerHTML = countries;

    addListenersToCountries('.js-country');
};


const fetchCountries = region => {
    fetch(`https://restcountries.eu/rest/v2/region/${region}`)
        .then(r => r.json())
        .then(data => showCountries(data))
        .catch(err => console.error(`An error occured, ${err}`));


};

const enableListeners = () => {
    //#1 get some buttons
    const regionButtons = document.querySelectorAll('.js-region-select');

    //#2 listen to the clicks 
    for(const button of regionButtons){
        button.addEventListener('click', function(){
                    
        //#2.1 look up the data property
        const region= this.getAttribute('data-region');


         //#2.2 get data from the api
         fetchCountries(region);

    });
}

countryHolder = document.querySelector('.js-country-holder')

//alsways start with europe
fetchCountries('europe');
};

const responsive = () =>{
    const sidebarResponsive = document.querySelector('.c-sidebar')
    const responsiveButton = document.querySelector('.js-responsive')
    responsiveButton.addEventListener('click', function(){
            if(sidebarResponsive.className == "c-sidebar"){
                console.log("het werkt klikken")
                sidebarResponsive.className += " responsive";
            }else{
                console.log("het werkt klikken ook")
                sidebarResponsive.className = "c-sidebar";
            }

    })
}

const reset = () =>{
    const resetButton = document.querySelector('.js-reset')
    resetButton.addEventListener('click', function(){
        console.log("alles wordt verwijdert")
        localStorage.removeItem(localKey)
        updateCounter();
    })

}


const init = () => {
    console.log('Init( dus de dom is geladen 🙌) ....');
    enableListeners();
    responsive();
    reset();
};

document.addEventListener('DOMContentLoaded', init);
