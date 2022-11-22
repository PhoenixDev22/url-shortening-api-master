const navBarOverlay = document.querySelector(".header__navbar")
const toggleBtn = document.getElementById('toggleNavigation');
const navigationItems = document.getElementById('navigation-items')


const   t = document.querySelector("[data-toggle]"),
        e = t.getAttribute('aria-controls'),
        r = document.querySelector("#".concat(e))
        console.log(e, r)
 


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


const fadeInAll = [...document.querySelectorAll('.fade-in')];
const slidersX = [...document.querySelectorAll('.slide-in')];
const slidersY = [...document.querySelectorAll('.slide-up')];
const appearOptions= {
    root: null,
    threshold: 0,
    rootMargin: " 0px 0px -100px 0px"
}

const appearOnScrollobserver = new IntersectionObserver((entries,appearOnScrollobserver) => {
    entries.forEach(entry => {
        if(!entry.isIntersecting){
            return
        } else {
            entry.target.classList.add('appear')
            appearOnScrollobserver.unobserve(entry.target)
        }
    })
}, appearOptions)

// fadeInAll.forEach(ele => {
//     appearOnScrollobserver.observe(ele)
// })
slidersX.forEach(ele => {
    appearOnScrollobserver.observe(ele)
})
// slidersY.forEach(ele => {
//     appearOnScrollobserver.observe(ele)
// })

const submitBtn = document.getElementById('submitBtn')
const shortenform = document.getElementById('shortenForm')
const longLinkAnchor = document.querySelector('.long-link')
const shortLinkAnchor = document.querySelector('.short-link')



shortenform.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log(e.target.querySelector('input').value)
    fetchShortLink(e)
    
})

async function fetchShortLink(event) {
    const url =`https://api.shrtco.de/v2/shorten?url=${event.target.querySelector('input').value}`
    try {
        const result = await fetch(url);
        const data = await result.json();
        const shortLink = data.result.short_link;
        console.log(shortLink)
        createShortLinkBox(event, shortLink)
        document.querySelector('.input').value = ''
    } catch(error){
        console.log('Error is ', error)
    }
}
// Create the short link box dynamically 
const createShortLinkBox = function(event, value) {
    const formSection = document.querySelector('.form .row')
    const parentLinkBox = document.createElement('div');
    parentLinkBox.className = 'link__box'
    parentLinkBox.innerHTML = `
        <div class="long-link__box">
            <a href="#" class="long-link">${event.target.querySelector('input').value}</a>
        </div>

        <div class="short-link__box">
            <a href="#" class="short-link">${value}</a>
            <button id="copyBtn" type="button" class="btn js-copy-btn s-br">Copy</button>
        </div>`;
    formSection.appendChild(parentLinkBox)


    const copyBtnAll = [...document.querySelectorAll('.js-copy-btn')]
    copyBtnAll.forEach(ele => {
       

        ele.addEventListener('click', (e) => {
            copyBtnAll.forEach(ele => {
                ele.textContent = 'Copy'
                ele.style.backgroundColor = 'hsl(180, 66%, 49%)'
            })
            copyTextToclipborad(value)
            e.target.textContent = "Copied!"
            e.target.style.backgroundColor = 'hsl(257, 27%, 26%)'
        })
    }) 
}

//   https://stackoverflow.com/questions/65837788/copy-to-clipboard-using-textarea-and-document-execcommandcopy-is-a-problem-wh 
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


