# Installation
- Cloner le projet
- Installer les dépendances:
    ```bash
    $ composer install
    $ yarn install
    ```
- Créer une copie locale de .env et compléter les informations nécessaires:
    - nom BDD, utilisateur et mot de passe BDD
- Si la base de données n'est pas déjà créée, le faire:
    ```bash
    $ php bin/console doctrine:database:create
    ```
- Créer les entités en base de données:
    ```bash
    $ php bin/console doctrine:migration:migrate
    ```
