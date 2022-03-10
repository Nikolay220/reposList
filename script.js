document.querySelector(".repos-list").addEventListener("click",function(evt){
    if(evt.target.classList.contains("close-btn"))
        evt.target.parentElement.remove();
});

function clearPromptsList(){
    let promptsList = document.querySelector('.search-container__prompts-list');
    if(promptsList) promptsList.remove();
}

function clearSearchField(){
    let searchField = document.querySelector('.search-container__text-field');
    searchField.value = "";
}

function addRepoItemToDOM(itemObj){
    let reposList=document.querySelector(".repos-list");
    let reposListItem = document.createElement('li');
    reposListItem.classList.add("repos-list__item");
    reposListItem.insertAdjacentHTML("afterbegin",`
        Name: ${itemObj.name}<br>
        Owner: ${itemObj.owner.login}<br>
        Stars: ${itemObj.stargazers_count}
        <span class="close-btn"></span>`
    );
    reposList.appendChild(reposListItem);    
}
function addPromptsToDOM(serverResponse){
    let searchContainer = document.querySelector(".search-container");
    if(serverResponse.total_count)
    {
        let promptsList = document.createElement('ul');
        promptsList.className = "search-container__prompts-list prompts-list list";
        serverResponse.items.reduce(function(acc, curVal){
            let promptItem = document.createElement('li');
            promptItem.classList.add("prompts-list__item");
            promptItem.textContent = curVal.name;
            promptItem.addEventListener('click',function(){
                addRepoItemToDOM(curVal);
                clearPromptsList();
                clearSearchField();
            });
            acc.appendChild(promptItem);
            return acc;
        },promptsList);
        searchContainer.appendChild(promptsList);
    }
}

function searchFieldHandler(evt,searchField,timeoutId){
    let currentValue = evt.target.value;
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function(){
        fetch(`https://api.github.com/search/repositories?q=${currentValue}&per_page=5`)
        .then( response => response.json())
        .then(res=> {
            clearPromptsList();
            addPromptsToDOM(res);                
        })
        .catch(err => {console.log(err)});
    },300);
}

function debounce(){
    let searchField = document.querySelector('.search-container__text-field');
    let timeoutId;
    searchField.addEventListener("keyup", function (evt){
        searchFieldHandler(evt,searchField,timeoutId);
    });
};

debounce();
