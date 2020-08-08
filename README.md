# Dashboard

Ce projet est un Dahboard comprenant des widgets pour les services Twitter, Youtube, Spotify et Steam.

## Installation

Pour déployer ce projet, vous aurez besoin d'installer docker ainsi que docker-compose.
Une fois que ceci est fait, rendez-vous dans le dossier ./dashboard/ et lancez la commande suivante dans votre interpréteur bash:

```bash
docker-compose up --build
```

Le projet est alors accessible dans votre navigateur sur 127.0.0.1:3000

## Description

Une fois sur la page du Dashboard, la première étape consiste à se connecter. 
Si vous n'avez pas de compte, il vous sera possible de vous inscrire.

Une fois connecté, vous aurez accès à différents services via la barre de menu à gauche.
Chacun de ses services propose plusieurs widgets qu'il vous sera possible de positionner
selon vos gouts au niveau de la partie dédiée au formatage de votre dashboard.

Chacun des services proposés par notre dashboard propose de s'y connecter afin de pouvoir
utiliser pleinement les fonctionnalités de tous les widgets qu'ils proposent. Afin de pouvoir 
vous connecter à un service, il vous faudra vous rendre sur l'icone engrenage du menu et vous
connecter au service via le compte correspondant à celui-ci.

Notre Dashboard propose les 4 services suivants :
- Spotify
- Steam
- Twitter
- Youtube

Les widgets correspondants à chacuns des services sont listés ci-après.
Un widget marqué d'une astérisque correspond à un widget qui nécéssite l'authentification à son service.

Spotify : 
- (*) Widget qui affiche une des playlists de l'utilisateur connecté
- (*) Widget qui affiche les tops musiques/artistes écoutés et qui, quand on clique affiche un lecteur également

Steam : 
- Widget qui affiche le nombre de joueur sur un jeu spécifié
- Widget qui affiche le prix de la bibliothèque d'un utilisateur que l'on aura renseigné

Twitter : 
- Widget qui affiche les Tweets d'un utilisateur que l'on renseigne
- (*) Widget qui affiche un compteurs (qui se rafraichit toutes les 5 secondes) de followers
- (*) Widget qui affiche les données d'un compte (followers , abonnements, certifié ou non, le @ + un bouton follow)

Youtube :
- (*) Widget qui affiche un compteur d'abonné
- (*) Widget qui affiche des stats spécifiques de la chaîne youtube de l'utilisateur

## Auteurs

Baptiste DUMONT, Damien RADATOVIC, Mathieu REBOUL

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-2-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->
## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/DamienRadatovic"><img src="https://avatars0.githubusercontent.com/u/55408621?v=4" width="100px;" alt=""/><br /><sub><b>Radatovic Damien</b></sub></a><br /><a href="#design-DamienRadatovic" title="Design">🎨</a> <a href="https://github.com/Layerzfr/Epitech_dashboard/commits?author=DamienRadatovic" title="Code">💻</a> <a href="https://github.com/Layerzfr/Epitech_dashboard/commits?author=DamienRadatovic" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://github.com/mathieurbl"><img src="https://avatars1.githubusercontent.com/u/47533125?v=4" width="100px;" alt=""/><br /><sub><b>mathieurbl</b></sub></a><br /><a href="https://github.com/Layerzfr/Epitech_dashboard/commits?author=mathieurbl" title="Code">💻</a> <a href="https://github.com/Layerzfr/Epitech_dashboard/commits?author=mathieurbl" title="Tests">⚠️</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
