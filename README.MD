Pour pouvoir estimer la bibliothèque Steam, j'ai du extraire une grosse partie des données directement sur Steam.
Ca m'a pris environ 38h donc pour éviter de devoir refaire la même chose, j'ai extrait les données de mon ordi en JSON.

Pour pouvoir réutiliser ce fichier ( sur le logiciel mongodb compass):


Sur la gauche, à côté de la ligne "dashboard", cliquer sur le (+)

marquer "steams" puis "create collection"

Ensuite on selectionne la nouvelle table crée et en haut il y a un onglet "add Data", cliquer dessus puis sur "import file" et charger le fichier json steam_db_extract_part1 puis steam_db_extract_part2

