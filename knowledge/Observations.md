# Observations

Version : 1.0.0

Status : Living Specification

---

# Définition

Une observation représente toute information mesurée, observée ou déduite concernant un individu.

Elle constitue l'interface entre le monde réel et le Medical Digital Twin.

Le Human Knowledge Model considère que toute connaissance du patient provient d'observations.

---

# Objectif

Les observations permettent de décrire l'état biologique d'un individu à un instant donné.

Le Medical Digital Twin utilise ces observations pour construire, mettre à jour et valider son modèle interne.

---

# Principe fondamental

Le Medical Digital Twin ne mesure jamais directement l'état biologique.

Il l'infère à partir des observations disponibles.

Les observations sont des preuves.

Le modèle est une interprétation de ces preuves.

---

# Les catégories d'observations

## Cliniques

Examen clinique

Signes

Symptômes

Interrogatoire

---

## Biologiques

Hématologie

Biochimie

Immunologie

Microbiologie

Génomique

Transcriptomique

Protéomique

Métabolomique

---

## Imagerie

Radiographie

Scanner

IRM

Échographie

TEP

SPECT

Photographie

Microscopie

---

## Physiologiques

ECG

EEG

EMG

EFR

Pression artérielle

Fréquence cardiaque

SpO₂

---

## Anatomopathologie

Biopsies

Pièces opératoires

Colorations

Immunohistochimie

---

## Fonctionnelles

Tests d'effort

Tests neuropsychologiques

Tests respiratoires

Tests moteurs

---

## Objets connectés

Montres

Balances

Capteurs

Glucose

Sommeil

Activité physique

---

## Environnementales

Température

Qualité de l'air

Rayonnement

Dosimétrie

Altitude

Pollution

---

# Caractéristiques

Chaque observation possède :

- un identifiant
- une date
- une heure
- une durée
- une méthode
- un instrument
- une unité
- une valeur
- une incertitude
- une qualité
- une source

---

# Les propriétés

Une observation peut être :

Quantitative

Qualitative

Continue

Ponctuelle

Directe

Indirecte

Calculée

Estimée

---

# Temporalité

Toute observation est datée.

Le MDT conserve l'historique complet des observations.

Il reconstruit les trajectoires biologiques au cours du temps.

---

# Incertitude

Toute observation possède une incertitude.

Cette incertitude peut provenir :

- de l'instrument

- de l'opérateur

- du patient

- de la méthode

- de l'environnement

Le MDT conserve cette information.

---

# Relations

Une observation peut :

MESURER

↓

Structure

---

MESURER

↓

Fonction

---

CONFIRMER

↓

Hypothèse

---

ALIMENTER

↓

Simulation

---

METTRE À JOUR

↓

Medical Digital Twin

---

# Fusion

Plusieurs observations peuvent être fusionnées afin d'améliorer la connaissance du système biologique.

Le MDT privilégie une approche multimodale.

---

# Simulation

Le Medical Digital Twin peut :

Prédire une observation future.

Comparer une observation simulée à une observation réelle.

Estimer une variable non directement mesurable.

---

# Philosophie

Le Human Knowledge Model distingue clairement :

La réalité biologique.

↓

Les observations.

↓

Le modèle numérique.

Les observations ne sont jamais la réalité.

Elles représentent une fenêtre partielle sur celle-ci.

Le rôle du Medical Digital Twin est d'intégrer ces observations afin de reconstruire l'état le plus probable de l'organisme.