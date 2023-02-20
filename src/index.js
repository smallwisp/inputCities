'use strict'

const input = document.querySelector('#select-cities'),
      dropdownList = document.querySelector('.dropdown-lists'),
      dropdownCol = document.querySelector('.dropdown-lists__col'),
      dropdownDefault = document.querySelector('.dropdown-lists__list--default'),
      dropdownSelect = document.querySelector('.dropdown-lists__list--select'),
      dropdownAutocomplete = document.querySelector('.dropdown-lists__list--autocomplete'),
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

    const addFullList = (parent) => {
      data.RU.forEach((item) => {
        let countryBlock = document.createElement('div');
        countryBlock.classList.add('dropdown-lists__countryBlock');
        parent.append(countryBlock);
        let cities = item.cities.map(i => [i.name, +i.count]);

        let sortCities = sortArr(cities).slice(0, 3);
        
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
        dropdownCol.innerHTML = '';
        addFullList(dropdownCol);
        dropdownDefault.style.display = 'block';
        dropdownSelect.style.display = 'none';
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

    const addAutocomplete = (parent, value) => {
      let citiesArr = [];
      data.RU.forEach((item) => {
        item.cities.forEach(i => {
          citiesArr.push(i.name);
          if (i.name.toLowerCase().startsWith(value)) {
            let dropdownLine = document.createElement('div');
            dropdownLine.classList.add('dropdown-lists__line');
            dropdownLine.innerHTML = `<div class="dropdown-lists__city">${i.name}</div>
                                      <div class="dropdown-lists__count">${i.count}</div>`
            parent.append(dropdownLine);
          } 
        });
      })

      let findValue = citiesArr.filter(item => item.toLowerCase().startsWith(value));
      if (findValue.length === 0) {
        let dropdownLine = document.createElement('div');
            dropdownLine.classList.add('dropdown-lists__line');
            dropdownLine.innerHTML = `<div class="dropdown-lists__city">Нихуя нет!</div>`;
            parent.append(dropdownLine);
      }
      console.log(findValue);
    };
      
    input.addEventListener('input',(event) => {
      let value = event.target.value;
      dropdownCol.innerHTML = '';
      dropdownSelect.innerHTML = '';
      dropdownAutocomplete.style.display = 'block';
      let countryBlock = document.createElement('div');
      countryBlock.classList.add('dropdown-lists__countryBlock');

      const dropdownColAutocomplete = document.querySelector('.dropdown-lists__col');
      
      dropdownColAutocomplete.append(countryBlock);
      addAutocomplete(countryBlock, value);



    });
  };

request();



