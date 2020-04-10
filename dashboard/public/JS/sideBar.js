let trait = document.getElementsByClassName('trait');
let path = document.querySelectorAll('.path-base');
let all = document.querySelectorAll('.button-icon');
let content = document.getElementsByClassName('content');
let traitContent = document.getElementsByClassName('trait-content');

for (let i = 0; i < all.length; i++) {
    all[i].addEventListener('click', function (e) {

        let activePath = document.querySelectorAll('.path-active');
        let activeTrait = document.querySelectorAll('.trait-active');
        /// let currentContent = content.querySelector(this.getAttribute('href'));

        for (let y = 0; y < activePath.length; y++) {
            activePath[y].classList.replace('path-active', 'path');
            activeTrait[y].classList.replace('trait-active', 'trait-none');
        }

        for (let x = 0; x < content.length; x++) {
            content[x].classList.replace('show', 'hide');
            traitContent[0].classList.replace('show', 'hide');
        }

        if (path[i].className.baseVal === 'path-base path-active') {
            path[i].classList.replace('path-active', 'path');
            trait[i].classList.replace('trait-active', 'trait-none');
            traitContent.classList.replace('show', 'hide');
        } else {
            path[i].classList.replace('path', 'path-active');
            trait[i].classList.replace('trait-none', 'trait-active');
            if (i !== 0) {
                content[i - 1].classList.replace('hide', 'show');
                traitContent[0].classList.replace('hide', 'show');
                console.log(traitContent);
            }

        }

    })
}



/// Supprimer path-active de l'onglet Actif
/// Remplacer path par path-active sur l'onglet cliqué
/// Remplacer trait-active par trait-none sur l'onglet Actif
/// Remplacer trait-none par trait-actif sur l'onglet cliqué
