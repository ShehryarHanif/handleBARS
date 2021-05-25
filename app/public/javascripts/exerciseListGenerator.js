function elementsCreator(type, ...children){
    const node = document.createElement(type);

    if(children){
        for (let i = 0; i < children.length; i++){
            if (typeof children[i] !== "string"){
                node.appendChild(children[i]);
            } else{
                node.appendChild(document.createTextNode(children[i]));
            }
          }
    }

    return node;
}

function dataFiller(data){
    const exercisesData = data["results"];

    const exercisesDropList = document.querySelector("#exercisesEntryList");

    for(let i = 0; i < exercisesData.length; i++){
        const exerciseObject = exercisesData[i];

        exercisesDropList.appendChild(elementsCreator("option", exerciseObject["name"]));
    }
}

async function listFiller(){
    await fetch("https://wger.de/api/v2/exerciseinfo.json/?language=2&limit=226")
        .then(res => res.json())
            .then(data => dataFiller(data));

    const loadingDisclaimer = document.querySelector(".temporaryFormDisplay");

    loadingDisclaimer.style["display"] = "none";
    
    // const exerciseForm = document.querySelector(".exerciseForm");
    
    // exerciseForm.style["display"] = "block";
}

function main(){
    listFiller();
}

document.addEventListener("DOMContentLoaded", main);