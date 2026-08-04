# Ontology

Version : 2.0.0

Status : Living Specification

---

# Objectif

L'ontologie décrit les objets fondamentaux du Human Knowledge Model ainsi que leurs relations.

Elle définit le vocabulaire universel utilisé par le Medical Digital Twin.

Le code implémente cette ontologie.

---

# Les cinq concepts fondamentaux

Toute connaissance du MDT appartient à l'une des catégories suivantes.

## 1. Entity

Une entité existe.

Exemples :

- Homo sapiens
- Cœur
- Rein
- Cellule
- Gène
- Molécule
- Tumeur
- Médicament

---

## 2. Attribute

Un attribut décrit une entité.

Exemples :

- masse
- volume
- longueur
- couleur
- température
- pression
- âge
- sexe
- concentration

---

## 3. Relation

Une relation relie deux entités.

Exemples :

Heart PART_OF Cardiovascular System

Kidney FILTERS Blood

Gene ENCODES Protein

Tumor LOCATED_IN Lung

---

## 4. Process

Un processus représente une évolution.

Exemples :

- respiration
- circulation
- digestion
- croissance
- cicatrisation
- inflammation
- vieillissement
- division cellulaire

---

## 5. Observation

Une observation décrit un état du modèle.

Exemples :

- IRM
- Scanner
- PET
- Radiographie
- ECG
- EEG
- Prise de sang
- Biopsie

Une observation possède toujours :

- une date
- une méthode
- une qualité
- une incertitude

---

# Les niveaux d'organisation

Universe

↓

Living Entity

↓

Homo sapiens

↓

System

↓

Organ

↓

Region

↓

Tissue

↓

Cell

↓

Organelle

↓

Protein

↓

Molecule

↓

Atom

---

# Les principales relations

## Composition

HAS

PART_OF

CONTAINS

BELONGS_TO

---

## Anatomie

CONNECTED_TO

ARTICULATES_WITH

SUPPLIED_BY

DRAINS_TO

INNERVATED_BY

LOCATED_IN

SURROUNDED_BY

---

## Physiologie

PRODUCES

CONSUMES

SECRETES

ABSORBS

FILTERS

REGULATES

CONTROLS

INFLUENCES

---

## Génétique

CONTAINS

ENCODES

EXPRESSES

REGULATES

MUTATES_TO

---

## Biochimie

BINDS_TO

ACTIVATES

INHIBITS

INTERACTS_WITH

CATALYZES

---

## Pathologie

CAUSES

ASSOCIATED_WITH

COMPLICATES

SPREADS_TO

REPAIRS

---

## Observation

OBSERVED_BY

MEASURED_BY

DETECTED_BY

QUANTIFIED_BY

CONFIRMED_BY

---

## Thérapeutique

TREATED_BY

TARGETED_BY

OPERATED_BY

IRRADIATED_BY

MONITORED_BY

---

## Simulation

SIMULATED_BY

PREDICTED_BY

ESTIMATED_BY

OPTIMIZED_BY

---

# Les propriétés d'une Entity

Toute entité possède :

- id
- name
- definition
- category
- attributes
- relations
- processes
- observations

---

# Les propriétés d'une Relation

Toute relation possède :

- source
- target
- type
- direction
- justification scientifique
- niveau de preuve
- références

---

# Les propriétés d'une Observation

Toute observation possède :

- sujet
- méthode
- appareil
- opérateur
- date
- unité
- précision
- incertitude
- valeur

---

# Les propriétés d'un Process

Tout processus possède :

- état initial
- déclencheur
- mécanisme
- durée
- résultat
- interactions

---

# Règles

Une entité ne peut exister sans définition scientifique.

Une relation doit toujours être orientée.

Une observation ne modifie jamais directement le modèle.

Une simulation ne remplace jamais une observation.

Une connaissance doit être traçable vers une source scientifique.

Toute information est versionnée.

---

# Philosophie

Le Human Knowledge Model est un graphe scientifique vivant.

Le Medical Digital Twin n'est qu'une implémentation informatique de ce graphe.

L'ontologie constitue le langage commun entre :

- médecins
- biologistes
- physiciens
- développeurs
- chercheurs
- intelligence artificielle