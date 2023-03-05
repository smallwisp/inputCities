'use strict'

const input = document.querySelector('#select-cities'),
      label = document.querySelector('label'),
      closeBtn = document.querySelector('.close-button'),
      btn = document.querySelector('.button'),
      dropdownList = document.querySelector('.dropdown-lists'),
      dropdownCol = document.querySelector('.dropdown-lists__col'),
      dropdownDefault = document.querySelector('.dropdown-lists__list--default'),
      dropdownSelect = document.querySelector('.dropdown-lists__list--select'),
      dropdownAutocomplete = document.querySelector('.dropdown-lists__list--autocomplete'),
      main = document.querySelector('.main');
// import request from "./modules/request.js";

input.value = '';

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

btn.classList.add('disabled');

const request = async() => {
  let clearLocalStorage = confirm('Очистить localStorage?');
  if (clearLocalStorage) {
    localStorage.clear();
  }
  let chooseLang = prompt('Choose your language:', 'RU, EN, DE');
  localStorage.setItem('language', chooseLang);

  let usingLang = localStorage.getItem('language');

  let data;
    await fetch('../../db_cities.js')
      .then(response => {
        return response.text();
      })
      .then(response => {
        let json = response.slice(12);
        data = JSON.parse(json);
      })

    // используем язык из localStorage

    localStorage.setItem('dataLang', JSON.stringify(data[usingLang]));

    // функции добавления списков

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
        dropdownLine.innerHTML = `<div class="dropdown-lists__city">Ничего не найдено!</div>`;
        parent.append(dropdownLine);
      }
      console.log(findValue);
    };

    // блок основных действий
    
    main.addEventListener('click', (event) => {
      let target = event.target;
      if (target === input) {
        label.textContent = '';
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

      if (target.classList.contains('dropdown-lists__city')) {
        input.value = target.textContent;
        closeBtn.style.display = 'block';
        data.RU.forEach(item => {
          item.cities.forEach(i => {
            if (i.name === input.value) {
              btn.href = i.link
            }
          });
        });
        
      }
      
      if (target.classList.contains('close-button')) {
        input.value = '';
        dropdownCol.innerHTML = '';
        closeBtn.style.display = 'none';
      }
      
      if (input.value) {
        btn.classList.remove('disabled');
        console.log(input.value);
      } else {
        btn.classList.add('disabled');
      }
    
    })
    
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

      if (value === '') {
        dropdownColAutocomplete.innerHTML = '';
        addFullList(dropdownCol);
      }
    });
    
    
};
  
request();
  
  
  
