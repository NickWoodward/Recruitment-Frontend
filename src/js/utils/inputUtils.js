export const clearInput = (input) => {
  input.value = '';
}
export const setInput = (input, value) => {
  input.value = value;
}

export const createAutoCompleteList = (inputName) => {
  const autoCompleteList = document.createElement('DIV');
  autoCompleteList.setAttribute('id', `autocomplete-list--${inputName}`);
  autoCompleteList.setAttribute('class', `autocomplete-items autocomplete-list--${inputName}`);

  return autoCompleteList;
}

export const createAutoCompleteItem = (id, item, value) => {
  const index = item.toUpperCase().indexOf(value.toUpperCase());

  const element = document.createElement('DIV');
  element.setAttribute('class', 'autocomplete-item');
  element.setAttribute('data-id', id);

  element.innerHTML = `${item.substr(0, index)}<strong>${item.substr(index, value.length)}</strong>${item.substr(index+value.length)}`;
  
  /*insert a input field that will hold the current array item's value:*/
  element.innerHTML += `<input type='hidden' value='${item}' data-id=${id}>`;

  return element;
}

export const isAutoCompleteMatch = (item, value) => {
  return item.toUpperCase().indexOf(value.toUpperCase()) !== -1;
}

export const removeActive = (suggestions) => {
  // A function to remove the "active" class from all autocomplete items
  for (let i = 0; i < suggestions.length; i++) {
    suggestions[i].classList.remove("autocomplete-active");
  }
}

export const closeAllLists = (element, input) => {

  // Close all autocomplete lists in the document, except the one passed as an argument
  const lists = document.getElementsByClassName("autocomplete-items");
  for (let i = 0; i < lists.length; i++) {
    if (element != lists[i] && element != input) {
      lists[i].parentNode.removeChild(lists[i]);
    }
  }
}

// REF https://www.w3schools.com/howto/howto_js_autocomplete.asp

// export const autoComplete = (inp, arr) => {
//     /*the autocomplete function takes two arguments,
//     the text field element and an array of possible autocompleted values:*/
//     var currentFocus;
//     /*execute a function when someone writes in the text field:*/
//     inp.addEventListener("input", function(e) {
//         var a, b, i, val = this.value;
//         /*close any already open lists of autocompleted values*/
//         closeAllLists();
//         if (!val) { return false;}
//         currentFocus = -1;
//         /*create a DIV element that will contain the items (values):*/
//         a = document.createElement("DIV");
//         a.setAttribute("id", this.id + "autocomplete-list");
//         a.setAttribute("class", "autocomplete-items");
//         /*append the DIV element as a child of the autocomplete container:*/
//         this.parentNode.appendChild(a);
//         /*for each item in the array...*/
//         for (i = 0; i < arr.length; i++) {

//           /*check if the item starts with the same letters as the text field value:*/
//           // if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
//           if(arr[i].toUpperCase().indexOf(val.toUpperCase()) !== -1) {
//             var index = arr[i].toUpperCase().indexOf(val.toUpperCase());
//             // console.log(index);
//             /*create a DIV element for each matching element:*/
//             b = document.createElement("DIV");
//             b.setAttribute("class", "autocomplete-item");
//             /*make the matching letters bold:*/
//             // console.log(`Value: ${arr[i]} - Start: ${arr[i].substr(0, index)} - Match: ${arr[i].substr(index, val.length)}`);

//             b.innerHTML = `${arr[i].substr(0, index)}<strong>${arr[i].substr(index, val.length)}</strong>${arr[i].substr(index+val.length)}`;
//             // b.innerHTML += arr[i].substr(val.length);
//             /*insert a input field that will hold the current array item's value:*/
//             b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
//             /*execute a function when someone clicks on the item value (DIV element):*/
//                 b.addEventListener("click", function(e) {
//                 /*insert the value for the autocomplete text field:*/
//                 inp.value = this.getElementsByTagName("input")[0].value;
//                 /*close the list of autocompleted values,
//                 (or any other open lists of autocompleted values:*/
//                 closeAllLists();
//             });
//             a.appendChild(b);
//           }
//         }
//     });
//     /*execute a function presses a key on the keyboard:*/
//     inp.addEventListener("keydown", function(e) {
//         var x = document.getElementById(this.id + "autocomplete-list");
//         if (x) x = x.getElementsByTagName("div");
//         if (e.keyCode == 40) {
//           /*If the arrow DOWN key is pressed,
//           increase the currentFocus variable:*/
//           currentFocus++;
//           /*and and make the current item more visible:*/
//           addActive(x);
//         } else if (e.keyCode == 38) { //up
//           /*If the arrow UP key is pressed,
//           decrease the currentFocus variable:*/
//           currentFocus--;
//           /*and and make the current item more visible:*/
//           addActive(x);
//         } else if (e.keyCode == 13) {
//           /*If the ENTER key is pressed, prevent the form from being submitted,*/
//           e.preventDefault();
//           if (currentFocus > -1) {
//             /*and simulate a click on the "active" item:*/
//             if (x) x[currentFocus].click();
//           }
//         }
//     });
//     function addActive(x) {
//       /*a function to classify an item as "active":*/
//       if (!x) return false;
//       /*start by removing the "active" class on all items:*/
//       removeActive(x);
//       if (currentFocus >= x.length) currentFocus = 0;
//       if (currentFocus < 0) currentFocus = (x.length - 1);
//       /*add class "autocomplete-active":*/
//       x[currentFocus].classList.add("autocomplete-active");
//     }
//     function removeActive(x) {
//       /*a function to remove the "active" class from all autocomplete items:*/
//       for (var i = 0; i < x.length; i++) {
//         x[i].classList.remove("autocomplete-active");
//       }
//     }
//     function closeAllLists(elmnt) {
//       /*close all autocomplete lists in the document,
//       except the one passed as an argument:*/
//       var x = document.getElementsByClassName("autocomplete-items");
//       for (var i = 0; i < x.length; i++) {
//         if (elmnt != x[i] && elmnt != inp) {
//         x[i].parentNode.removeChild(x[i]);
//       }
//     }
//   }
//   /*execute a function when someone clicks in the document:*/
//   document.addEventListener("click", function (e) {
//       closeAllLists(e.target);
//   });
//   } 