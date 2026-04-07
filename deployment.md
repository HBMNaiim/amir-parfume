# Guide de Déploiement Complet — Amir Parfume

Ce guide explique étape par étape comment configurer la base de données sur Supabase, héberger le site gratuitement sur GitHub Pages, et comment mettre le site à jour par la suite.

---

## Étape 1 : Configurer la base de données (Supabase)

Supabase va stocker votre catalogue de parfums et recevoir les commandes de vos clients.

1. **Créer le projet** :
   - Allez sur [supabase.com](https://supabase.com) et créez un compte gratuit.
   - Cliquez sur **New Project**, sélectionnez une organisation, nommez le projet (ex: `Amir Parfume`), choisissez un mot de passe sécurisé et la région la plus proche de l'Algérie (ex: `Frankfurt` ou `Paris`).
   - Attendez quelques minutes que la base de données soit prête.

2. **Créer les tables** :
   - Dans le menu de gauche, cliquez sur **SQL Editor** puis sur **New query**.
   - Collez le code SQL suivant et cliquez sur **Run** :

```sql
-- Table des Produits
create table products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  brand text,
  description text,
  price numeric,
  promoPrice numeric,
  stock integer default 0,
  category text,
  volume text,
  image text,
  images text[],
  featured boolean default false,
  tags text[],
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Table des Commandes
create table orders (
  id uuid default gen_random_uuid() primary key,
  customer jsonb,
  items jsonb,
  total numeric,
  status text default 'pending',
  date timestamp with time zone default timezone('utc'::text, now()),
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Désactiver RLS (Row Level Security) temporairement pour simplifier l'accès
alter table products disable row level security;
alter table orders disable row level security;
```

1. **Récupérer les clés d'accès** :
   - Allez dans **Project Settings** (l'icône engrenage tout en bas à gauche) > **API**.
   - Cherchez **Project URL** et copiez l'adresse (ex: `https://xxxxxx.supabase.co`).
   - Cherchez **Project API keys**, copiez la clé **`anon` / `public`**.

2. **Connecter le site à Supabase** :
   - Ouvrez le fichier `js/data.js` de votre code local.
   - Remplacez la valeur de `SUPABASE_URL` par l'URL copiée.
   - Remplacez la valeur de `SUPABASE_KEY` par la clé copiée.

---

## Étape 2 : Déploiement sur Internet (GitHub Pages)

GitHub Pages est parfait car il est gratuit, très rapide, et s'intègre parfaitement avec le code source.

1. **Préparer GitHub** :
   - Créez un compte gratuit sur [github.com](https://github.com) si vous n'en avez pas.
   - En haut à droite, cliquez sur le **+** et choisissez **New repository**.
   - Nommez-le (ex: `amir-parfume`). Vous pouvez le laisser en **Public** (nécessaire pour GitHub Pages gratuit).
   - Ne cochez ni *Add a README file* ni *Add .gitignore*. Cliquez sur **Create repository**.

2. **Envoyer le code sur GitHub** :
   - Sur votre ordinateur, ouvrez un terminal (ou l'invite de commande) dans le dossier de votre site (le dossier `parfumerie`).
   - Tapez ces commandes une par une :

     ```bash
     git init
     git add .
     git commit -m "Premier déploiement"
     git branch -M main
     git remote add origin https://github.com/HBMNaiim/amir-parfume
     git push -u origin main
     ```

     *(N'oubliez pas de remplacer l'URL par l'URL que GitHub vous affiche sur la page de votre repository vide)*.

3. **Activer GitHub Pages** :
   - Sur GitHub, allez sur la page de votre repository, cliquez sur l'onglet **Settings**.
   - Dans le menu de gauche, descendez et cliquez sur **Pages**.
   - Dans la section **Build and deployment** :
     - Pour **Source**, choisissez **Deploy from a branch**.
     - Pour **Branch**, sélectionnez **main** (ou *master*) et laissez le dossier sur **/ (root)**.
     - Cliquez sur **Save**.
   - Patientez 1 ou 2 minutes. Si vous rafraîchissez la page, vous verrez un encart apparaître disant : *"Your site is live at <https://votre-pseudo.github.io/amir-parfume>"*.

C'est fait ! Votre site boutique est en ligne à l'URL fournie, et votre espace d'administration est accessible en ajoutant `/admin.html` à la fin de l'URL.

---

## Étape 3 : Comment faire les mises à jour ?

Lorsque vous voudrez modifier le code localement (changer de logo, modifier du texte dans `index.html`, ou ajuster du CSS) :

1. Faites la modification dans vos fichiers locaux sur votre ordinateur.
2. Ouvrez le terminal dans le dossier du projet.https://kzymjiccuvkctzwyyxyl.supabase.co
3. Exécutez ces 3 commandes pour envoyer la mise à jour sur GitHub :

   ```bash
   git add .
   git commit -m "Description de ma mise à jour"
   git push
   ```

4. C'est tout. GitHub Pages détectera automatiquement le changement et déploiera la nouvelle version sur internet. Cela prend la plupart du temps moins de 30 secondes.

**Note :** Pour *ajouter des parfums* ou *gérer les commandes*, vous n'avez pas besoin de mettre à jour le code ou de faire un `git push`. Tout se gère directement et instantanément depuis le panneau d'administration sécurisé en ligne sur votre site (page `/admin.html`).
