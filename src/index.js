'use strict'

const input = document.querySelector('#select-cities'),
      dropdownList = document.querySelector('.dropdown-lists'),
      dropdownCol = document.querySelector('.dropdown-lists__col'),
      dropdownDefault = document.querySelector('.dropdown-lists__list--default'),
      dropdownSelect = document.querySelector('.dropdown-lists__list--select'),
      main = document.querySelector('.main');
// import request from "./modules/request.js";

const sortArr = (arr) => {
  let largerIndex;
  for( let i = 0; i < arr.length - 1; i++) {
    largerIndex = i;
    for( let j = i; j < arr.length; j++) {
      if (arr[largerIndex][1] < arr[j][1]) {
        largerIndex = j;
      }
    }
    if (i !== largerIndex) {
      let temp = arr[i];
      arr[i] = arr[largerIndex];
      arr[largerIndex] = temp;
    }
  }

  return arr;
};

const request = async() => {
  let data;
    await fetch('../../db_cities.js')
      .then(response => {
        // console.log(response.text());
        return response.text();
      })
      .then(response => {
        let json = response.slice(12);
        data = JSON.parse(json);
      })

    console.log(data);
      
    console.log(data.RU);
    let countries = data.RU.map(item => item.country);
    console.log(countries);

    const addFullList = (parent) => {
      data.RU.forEach((item) => {
        let countryBlock = document.createElement('div');
        countryBlock.classList.add('dropdown-lists__countryBlock');
        parent.append(countryBlock);
        let cities = item.cities.map(i => [i.name, +i.count]);

        // сортировка массива городов по количеству жителей
/*         let largerIndex;
        for( let i = 0; i < cities.length - 1; i++) {
          largerIndex = i;
          for( let j = i; j < cities.length; j++) {
            if (cities[largerIndex][1] < cities[j][1]) {
              largerIndex = j;
            }
          }
          if (i !== largerIndex) {
            let temp = cities[i];
            cities[i] = cities[largerIndex];
            cities[largerIndex] = temp;
          }
        } */

        let sortCities = sortArr(cities).slice(0, 3);
        
        console.log(sortCities);
        countryBlock.innerHTML = `<div class="dropdown-lists__total-line">
                                    <div class="dropdown-lists__country">${item.country}</div>
                                    <div class="dropdown-lists__count">${item.count}</div>
                                  </div>
                                  <div class="dropdown-lists__line">
                                    <div class="dropdown-lists__city">${sortCities[0][0]}</div>
                                    <div class="dropdown-lists__count">${sortCities[0][1]}</div>
                                  </div>
                                  <div class="dropdown-lists__line">
                                    <div class="dropdown-lists__city">${sortCities[1][0]}</div>
                                    <div class="dropdown-lists__count">${sortCities[1][1]}</div>
                                  </div>
                                  <div class="dropdown-lists__line">
                                    <div class="dropdown-lists__city">${sortCities[2][0]}</div>
                                    <div class="dropdown-lists__count">${sortCities[2][1]}</div>
                                  </div>`
      })
/*       parent.innerHTML = ` <div class="dropdown-lists__countryBlock">
                            <div class="dropdown-lists__total-line">
                              <div class="dropdown-lists__country">Россия</div>
                              <div class="dropdown-lists__count">144500000</div>
                            </div>
                            <div class="dropdown-lists__line">
                              <div class="dropdown-lists__city">Москва</div>
                              <div class="dropdown-lists__count">12615000</div>
                            </div>
                            <div class="dropdown-lists__line">
                              <div class="dropdown-lists__city">Москва</div>
                              <div class="dropdown-lists__count">12615000</div>
                            </div>
                            <div class="dropdown-lists__line">
                              <div class="dropdown-lists__city">Москва</div>
                              <div class="dropdown-lists__count">12615000</div>
                            </div>
                          </div>
                          <div class="dropdown-lists__countryBlock">
                            <div class="dropdown-lists__total-line">
                              <div class="dropdown-lists__country">Россия</div>
                              <div class="dropdown-lists__count">144500000</div>
                            </div>
                            <div class="dropdown-lists__line">
                              <div class="dropdown-lists__city">Москва</div>
                              <div class="dropdown-lists__count">12615000</div>
                            </div>
                            <div class="dropdown-lists__line">
                              <div class="dropdown-lists__city">Москва</div>
                              <div class="dropdown-lists__count">12615000</div>
                            </div>
                            <div class="dropdown-lists__line">
                              <div class="dropdown-lists__city">Москва</div>
                              <div class="dropdown-lists__count">12615000</div>
                            </div>
                          </div>
                          <div class="dropdown-lists__countryBlock">
                            <div class="dropdown-lists__total-line">
                              <div class="dropdown-lists__country">Россия</div>
                              <div class="dropdown-lists__count">144500000</div>
                            </div>
                            <div class="dropdown-lists__line">
                              <div class="dropdown-lists__city">Москва</div>
                              <div class="dropdown-lists__count">12615000</div>
                            </div>
                            <div class="dropdown-lists__line">
                              <div class="dropdown-lists__city">Москва</div>
                              <div class="dropdown-lists__count">12615000</div>
                            </div>
                            <div class="dropdown-lists__line">
                              <div class="dropdown-lists__city">Москва</div>
                              <div class="dropdown-lists__count">12615000</div>
                            </div>
                          </div>` */
    };

    const addCountryList = (textContent) => {
      dropdownDefault.style.display = 'none';
      let obj = data.RU.find(item => item.country === textContent);
      console.log(obj);
      dropdownSelect.style.display = 'block';
      dropdownSelect.innerHTML = `<div class="dropdown-lists__col">
                                    <div class="dropdown-lists__countryBlock">
                                      <div class="dropdown-lists__total-line">
                                        <div class="dropdown-lists__country">${obj.country}</div>
                                        <div class="dropdown-lists__count">${obj.count}</div>
                                      </div>
                                      
                                    </div>
                                  </div>`;
      obj.cities.forEach(item => {
        let dropdownLine = document.createElement('div');
        dropdownLine.classList.add('dropdown-lists__line');
        dropdownLine.innerHTML = `<div class="dropdown-lists__city">${item.name}</div>
                                  <div class="dropdown-lists__count">${item.count}</div>`
        dropdownSelect.append(dropdownLine);
      })

    };
    
    main.addEventListener('click', (event) => {
      let target = event.target;
      console.log(target.classList);
      if (target === input) {
        addFullList(dropdownCol);
        dropdownDefault.style.display = 'block';
      }

      if (target.classList.contains('dropdown-lists__total-line')) {
        addCountryList(target.children[0].textContent);
      } else if (target.classList.contains('dropdown-lists__country')) {
        addCountryList(target.textContent);
      }
    
      if (target.classList.contains('main')) {
        dropdownCol.innerHTML = '';
        dropdownSelect.innerHTML = '';
      }
    })

      
  };

request();


input.addEventListener('click',(event) => {
});

/* input.addEventListener('blur', (event) => {
  console.log(event.target);
  dropdownCol.innerHTML = '';
}) */

// console.log(data);
