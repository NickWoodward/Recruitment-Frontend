import gsap from 'gsap';

export default class Select {
  constructor({
    select, 
    modifiers = [], 
    selectIcon = true,
    animations: [animateOut, animateIn] = []
  }) {
      this.sourceSelect = select
      // this.placeholder = this.sourceSelect.querySelector(`[disabled="disabled"]`)?.value
      this.placeholder = this.sourceSelect.querySelector('.placeholder')?.value;
      this.selectOptions = getFormattedOptions(select.querySelectorAll("option"))
      this.customSelect = document.createElement("div")
      this.customLabel = document.createElement("span")
      this.customOptions = document.createElement("ul")
      this.customClassModifiers = modifiers;
      this.customIcon = selectIcon;
      this.svgWrapper;
      this.animateIn = animateIn;
      this.animateOut = animateOut;

      setupCustomElement(this)

      select.style.display = "none"
      select.after(this.customSelect)
    }
  
    get selectedOption() {
      const selected = this.selectOptions.find(option => option.selected);
      return selected;
    }
  
    get selectedOptionIndex() {
      const selectedIndex = this.selectOptions.indexOf(this.selectedOption)

      return selectedIndex
    }

    // These listen for events from external controls (next/prev buttons etc)
    addCustomSelectListeners(selectName) {
      const changeValueEvents = [];

      if(selectName === 'companies') {
        changeValueEvents.push('companiesChange');
      }
      if(selectName === 'company-jobs') {
        changeValueEvents.push('companyJobsForwards');
        changeValueEvents.push('companyJobsBackwards');
      }
      if(selectName === 'company-contacts') {
        changeValueEvents.push('companyContactsChange');
      }
      if(selectName === 'company-addresses') {
        changeValueEvents.push('companyAddressesChange');
      }
      if(selectName == 'jobs') {
        changeValueEvents.push('jobsChange');
      }
      changeValueEvents.forEach(event => {
        // ++ is because of zero index, not because it's moving the page forwards or backwards
        this.customSelect.addEventListener(event, e => {this.selectValue(`${++e.detail.page}`)});
      });

    } 
  
    selectValue(value, group) {
      const newSelectedOption = this.selectOptions.find(option => {
        return option.value === value && option.group === group
      })
      // console.log({value}, {newSelectedOption});
      if(!newSelectedOption) return;

      // Placeholder class removed from label when any option selected
      if(this.customLabel.classList.contains("placeholder")) this.customLabel.classList.remove("placeholder")

      const prevSelectedOption = this.selectedOption
      prevSelectedOption.selected = false
      prevSelectedOption.element.selected = false
  
      newSelectedOption.selected = true
      newSelectedOption.element.selected = true
      this.customLabel.innerText = newSelectedOption.label
      
      // If the selected option doesn't equal the placeholder, remove the selected class
      if(prevSelectedOption.value !== this.placeholder){
       // Remove selected class from the option
        this.customOptions
          .querySelector(`[data-value="${prevSelectedOption.value}"][data-group="${prevSelectedOption.group}"]`)
          .classList.remove("selected")
        
        // Remove the selected class from the svg
        if(this.customIcon) {  
          // SVG Wrapper
          const iconWrapper = this.customOptions
            .querySelector(`[data-value="${prevSelectedOption.value}"][data-group="${prevSelectedOption.group}"]`).children[0];

          iconWrapper.classList.remove('selected');
          gsap.set(iconWrapper, {autoAlpha: 0});
          }
      }
        
      const newCustomElement = this.customOptions.querySelector(
        `[data-value="${newSelectedOption.value}"][data-group="${newSelectedOption.group}"]`
      );
      newCustomElement.classList.add("selected")
      if(this.customIcon){
        newCustomElement.children[0].classList.add('selected');
        gsap.set(newCustomElement.children[0], {autoAlpha: 1});
      }
      newCustomElement.scrollIntoView({ block: "nearest" })

    }
}
  
  function setupCustomElement(select) {
    select.customSelect.classList.add("custom-select-container")
    if(select.customClassModifiers.length > 0) {
      select.customClassModifiers.forEach(modifier => select.customSelect.classList.add(`custom-select-container--${modifier}`))
    }
    select.customSelect.tabIndex = 0
  
    select.customLabel.classList.add("custom-select-value")
    if(select.customClassModifiers.length > 0) {
      select.customClassModifiers.forEach(modifier => select.customLabel.classList.add(`custom-select-value--${modifier}`))
    }

    // Placeholder removed when any option selected
    select.customLabel.classList.add("placeholder")

    select.customLabel.innerText = select.selectedOption.label
    select.customSelect.append(select.customLabel)
  
    select.customOptions.classList.add("custom-select-options")
    if(select.customClassModifiers.length > 0) {
      select.customClassModifiers.forEach(modifier => select.customOptions.classList.add(`custom-select-options--${modifier}`))
    }

    let group;

    select.selectOptions.forEach((option, index) => {
      if(select.placeholder && index === 0) return

      const optionElement = document.createElement("li")
      optionElement.classList.add("custom-select-option")
      if(select.customClassModifiers.length > 0) {
        select.customClassModifiers.forEach(modifier => optionElement.classList.add(`custom-select-option--${modifier}`))
      }

      optionElement.classList.toggle("selected", option.selected);
      optionElement.dataset.value = option.value;
      optionElement.dataset.group = option.group;

      const titleElement = document.createElement('div');
      titleElement.classList.add('custom-select-title');
      titleElement.innerText = option.label;

      if(select.customIcon) {
        select.svgWrapper = document.createElement('div');
        select.svgWrapper.className = 'custom-select-svg-wrapper';

        const selectedSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        const path1 = document.createElementNS("http://www.w3.org/2000/svg", 'path');
        selectedSvg.setAttribute("aria-hidden","true");
        selectedSvg.setAttribute('viewBox', '0 0 512 512');


        selectedSvg.setAttribute('class', 'custom-select-svg');
        selectedSvg.classList.toggle("selected", option.selected);

        path1.setAttribute('d', `M461.6,109.6l-54.9-43.3c-1.7-1.4-3.8-2.4-6.2-2.4c-2.4,0-4.6,1-6.3,2.5L194.5,323c0,0-78.5-75.5-80.7-77.7
        c-2.2-2.2-5.1-5.9-9.5-5.9c-4.4,0-6.4,3.1-8.7,5.4c-1.7,1.8-29.7,31.2-43.5,45.8c-0.8,0.9-1.3,1.4-2,2.1c-1.2,1.7-2,3.6-2,5.7
        c0,2.2,0.8,4,2,5.7l2.8,2.6c0,0,139.3,133.8,141.6,136.1c2.3,2.3,5.1,5.2,9.2,5.2c4,0,7.3-4.3,9.2-6.2L462,121.8
        c1.2-1.7,2-3.6,2-5.8C464,113.5,463,111.4,461.6,109.6z`);
        path1.setAttribute('fill', '#000000');

        selectedSvg.appendChild(path1);
        select.svgWrapper.appendChild(selectedSvg);

        // Set all icons to hidden initially
        gsap.set(select.svgWrapper, { autoAlpha: 0 })

      }

      optionElement.addEventListener("click", () => {
        
        select.selectValue(option.value, option.group)
        select.customOptions.classList.remove("show")
        // select.customSelect.dispatchEvent(new Event('change', { bubbles: true }));

        if(select.animateOut) select.animateOut(select.customOptions)
      })

      // Add option groups if present
      if(option.group) {
        let customGroup = option.group.charAt(0).toUpperCase() + option.group.slice(1)

        if(group !== customGroup) {
            group = option.group.charAt(0).toUpperCase() + option.group.slice(1)
            const groupElement = document.createElement('div')
            const groupLabel = document.createElement('div')
            
            groupElement.classList.add('custom-select-group')
            groupLabel.classList.add('custom-select-group-label')
            groupLabel.innerText = group

            groupElement.append(groupLabel);
            select.customOptions.append(groupElement)
        }
      }

      if(select.customIcon) {
        optionElement.append(select.svgWrapper)
      }

      optionElement.append(titleElement);
      select.customOptions.append(optionElement)


    })
    select.customSelect.append(select.customOptions);

    // Set the customOptions to autoAlpha 0
    if(select.animateIn) gsap.set(select.customOptions, { autoAlpha:0 })
  
    select.customLabel.addEventListener("click", () => {
      select.customOptions.classList.toggle("show")
      const makeVisible = select.customOptions.classList.contains("show");

      if(makeVisible && select.animateIn) {
        select.animateIn(select.customOptions);
      } else if(select.animateOut){
        select.animateOut(select.customOptions);
      }

    })
  
    select.customSelect.addEventListener("blur", () => {
      // If it loses focus AND isn't already hidden (from other methods eg closing via clicking an option)
      if(select.customOptions.classList.contains("show")){
        select.customOptions.classList.remove("show")

        if(select.animateOut) {
          select.animateOut(select.customOptions);
        }
      }
    })
  
    let debounceTimeout
    let searchTerm = ""
    select.customSelect.addEventListener("keydown", e => {
      switch (e.code) {
        case "Space":
          select.customOptions.classList.toggle("show")
          break
        case "ArrowUp": {
          if(select.selectedOptionIndex === 1) return
          const prevOption = select.selectOptions[select.selectedOptionIndex - 1]
          if (prevOption) {
            select.selectValue(prevOption.value, prevOption.group)
          }
          break
        }
        case "ArrowDown": {
          const nextOption = select.selectOptions[select.selectedOptionIndex + 1]
          if (nextOption) {
            select.selectValue(nextOption.value, nextOption.group)
          }
          break
        }
        case "Enter":
        case "Escape":
          select.customOptions.classList.remove("show")
          break

        //// Search functionality not working
        // default: {
        //   clearTimeout(debounceTimeout)
        //   searchTerm += e.key
        //   debounceTimeout = setTimeout(() => {
        //     searchTerm = ""
        //   }, 500)

        //   const searchedOption = select.selectOptions.find(option => {
        //     const result = option.label.toLowerCase().startsWith(searchTerm)
        //     return option.label.toLowerCase().startsWith(searchTerm)
        //   })
        //   if (searchedOption) {
        //     select.selectValue(searchedOption.value)
        //   }
        // }
      }
    })
  }
  
  function getFormattedOptions(optionElements) {
    return [...optionElements].map(optionElement => {
      return {
        value: optionElement.value,
        group: optionElement.dataset.group,
        label: optionElement.label,
        selected: optionElement.selected,
        element: optionElement,
      }
    })
  }

