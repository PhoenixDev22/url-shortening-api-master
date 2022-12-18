const navBarOverlay = document.querySelector(".header__navbar")
const toggleBtn = document.getElementById('toggleNavigation');
const navigationItems = document.getElementById('navigation-items')

function toggleNavigation() {
    navigationItems.hasAttribute("data-visible") 
    ? toggleBtn.setAttribute("aria-expanded", true)
    : toggleBtn.setAttribute("aria-expanded", false);

    navigationItems.toggleAttribute("data-visible");
    toggleBtn.classList.toggle("toggle");
    navigationItems.classList.toggle("appear");
    document.body.classList.toggle("disable-scroll");
    navBarOverlay.toggleAttribute("data-overlay");
}

function closeNavigation() {  
    navigationItems.removeAttribute("data-visible")
    toggleBtn.classList.remove("toggle")
    navigationItems.classList.remove("appear")
    document.body.classList.remove("disable-scroll")
    navBarOverlay.removeAttribute("data-overlay")  
}

toggleBtn.addEventListener('click', toggleNavigation)

// Close the Navigation when it's clicked outside the navigation menu
window.addEventListener('click', (event) => {
    if(event.target.closest('#navigation-items') ||  event.target.closest('#toggleNavigation')) return
    closeNavigation()
})

// Add Escape Key to close mobile navigation 
window.addEventListener('keydown', (event) => {
    if(!navigationItems.hasAttribute('data-visible')) return
    event.key === "Escape" && closeNavigation()
})

// let resizeTimer;
// window.addEventListener('resize', () => {
//     document.body.classList.add('resize-animation-stopper');
//     clearTimeout(resizeTimer);
//     resizeTimer = setTimeout(() => {
//         document.body.classList.remove('resize-animation-stopper')
//     }, 400);
// })

// const fadeInAll = [...document.body.querySelectorAll('.fade-in')];
// const slidersX = [...document.body.querySelectorAll('.slide-in')];
// const slidersY = [...document.body.querySelectorAll('.slide-up')];
// const appearOptions= {
//     root: document.body,
//     threshold: 0,
//     rootMargin: " 0px 0px -100px 0px"
// }

// const appearOnScrollobserver = new IntersectionObserver((entries,appearOnScrollobserver) => {
//    console.log(entries)
//     entries.forEach(entry => {
//         console.log(entry)
//         if(!entry.isIntersecting){
//             return
//         } else {
//             entry.target.classList.add('appear')
//             appearOnScrollobserver.unobserve(entry.target)
//         }
//     })
// }, appearOptions)

// slidersX.forEach(ele => {
//     appearOnScrollobserver.observe(ele)
// })

const submitBtn = document.getElementById('submitBtn')
const shortenform = document.getElementById('shortenForm')
const longLinkAnchor = document.querySelector('.long-link')
const shortLinkAnchor = document.querySelector('.short-link')

// 
shortenform.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = e.target.querySelector('input')
    const isValid = validateUrl(input.value)

    if(isValid) {
        input.removeAttribute('data-invalid')
        document.body.querySelector('.error').removeAttribute('data-invalid')
        fetchShortLink(e) 
    } else {
        input.setAttribute('data-invalid', '')
        document.querySelector('.error').setAttribute('data-invalid', '') 
        document.querySelector('.input').value = '';
        input.focus()
    }   
})

// Validate an Url 
function validateUrl(url) {
    const reg = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
    return  reg.test(url)? true: false;
}

async function fetchShortLink(event) {
    const longLink = event.target.querySelector('input').value;
    const url =`https://api.shrtco.de/v2/shorten?url=${longLink}`;
    let storage = JSON.parse(localStorage.getItem('links'));
    console.log(storage)
  
    try {
        const result = await fetch(url);
        const data = await result.json();
        const shortLink = data.result.full_short_link3;
   
        createShortLinkBox(longLink , shortLink);
        if (storage === null ) {
            storage = []
        }
        storage.push({
            original__link: longLink, 
            short__link:shortLink
        });
     
        localStorage.setItem("links", JSON.stringify(storage));
      
    } catch(error){
        console.log('Error is ', error);
    }
    event.target.querySelector('.input').value = '';
}


// Create the short link box dynamically 
const createShortLinkBox = function(longLink, shortLink) {
    const formSection = document.querySelector('.form .row')
    const parentLinkBox = document.createElement('div');
    parentLinkBox.className = 'link__box'
    parentLinkBox.insertAdjacentHTML("beforeend", `
        <div class="long-link__box">
            <a href="#" class="long-link">${longLink}</a>
        </div>

        <div class="short-link__box">
            <a href="#" class="short-link">${shortLink}</a>
            <button id="copyBtn" type="button" class="btn js-copy-btn s-br">Copy</button>
        </div>

        <button class="close-btn" type="button"><svg width="32" height="31" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style="pointer-events: none"><g fill="#fff" fill-rule="evenodd"><path d="m2.919.297 28.284 28.284-2.122 2.122L.797 2.419z"/><path d="M.797 28.581 29.081.297l2.122 2.122L2.919 30.703z"/></g></svg></button>`);

    formSection.appendChild(parentLinkBox)

    // Close button on each created box
    const allcloseBtn = document.querySelectorAll('.close-btn')
    allcloseBtn.forEach(ele => {
        ele.addEventListener('click', (e) => {
            e.target.closest('.link__box').remove()
            console.log(e.target.closest('.link__box'))
        })
    })

    const copyBtnAll = [...document.querySelectorAll('.js-copy-btn')]
    copyBtnAll.forEach(ele => {
       
        ele.addEventListener('click', (e) => {
            copyBtnAll.forEach(ele => {
                ele.textContent = 'Copy'
                ele.style.backgroundColor = 'hsl(180, 66%, 49%)'
            })
            copyTextToclipborad(shortLink)
            e.target.textContent = "Copied!"
            e.target.style.backgroundColor = 'hsl(257, 27%, 26%)'
        })

    }) 
}
document.addEventListener("DOMContentLoaded", () => {
    const storage = JSON.parse(localStorage.getItem('links'))
    for(ele in storage){
        createShortLinkBox(storage[ele].original__link, storage[ele].short__link)
    }
})

//   Found https://stackoverflow.com/questions/65837788/copy-to-clipboard-using-textarea-and-document-execcommandcopy-is-a-problem-wh 
function copyTextToclipborad(text) {
    var textarea = document.createElement("textarea");
    textarea.value = text;
    
    // avoid Scrolling to bottom
    textarea.style.top = "0";
    textarea.style.left = "0";
    textarea.style.position = "fixed";

    document.body.appendChild(textarea)
    textarea.focus();
    textarea.select();

    try {
        var msg = document.execCommand('copy') ? 'successful' : 'unsuccessful';
        console.log('Fallback: copying text command was ' + msg)
    } catch (error) {
        console.error('Fallback: oops, unable to copy ', error)
    }
    document.body.removeChild(textarea)
}


