# Medical Digital Twin

# UI Architecture

Version 1.0

---

# Philosophy

Medical Digital Twin is **not** a dashboard.

Medical Digital Twin is **not** an Electronic Health Record.

Medical Digital Twin is **not** a collection of medical modules.

Medical Digital Twin is a **living digital representation of a biological entity**.

The user does not navigate inside menus.

The user navigates inside the digital twin itself.

The Human Digital Twin is the primary user interface.

Every visual component exists only to help understand or interact with the Digital Twin.

---

# Core Principle

The Body is the Interface.

Everything else is an overlay.

The interface must disappear.

The Digital Twin must remain.

---

# Design Goals

The UI must always feel:

- alive
- fluid
- spatial
- contextual
- immersive
- simple

The user should never feel overwhelmed by information.

Information appears only when it is relevant.

---

# Inspiration

Medical Digital Twin combines ideas from:

- Apple Health
- VisionOS
- Unreal Engine Editor
- Google Earth
- OPE-SAR
- Flight Deck Interfaces
- Medical Imaging Workstations

without reproducing any of them.

---

# User Experience

The user should feel like observing a living body.

Not browsing software.

The application is a window into the Digital Twin.

The Digital Twin is always the center of the experience.

# 2. User Interface Layers

The Medical Digital Twin interface is composed of independent visual layers.

Each layer has a single responsibility.

No layer should know the internal implementation of another layer.

Communication between layers is performed through the Store and the Twin Runtime.

---

Layer 5

Dialogs

Purpose

Temporary interactions.

Examples

- Patient selector
- Search
- Settings
- Notifications
- File import
- DICOM explorer
- Simulation parameters

Characteristics

- Modal
- Temporary
- Highest z-index
- Never modifies the scene directly

---

Layer 4

Floating Panels

Purpose

Display contextual information.

Examples

- Organ information
- Laboratory results
- Imaging viewer
- Timeline
- Knowledge
- Medication
- Devices
- Environment

Characteristics

- Draggable
- Dockable
- Collapsible
- Contextual
- Non modal

Panels never own data.

They only display information coming from modules.

---

Layer 3

Interface Overlay

Purpose

Permanent interface.

Contains

- Header
- Bottom Navigation
- Dock
- Status Chips
- Search button
- Notifications
- Quick actions

Characteristics

Always visible.

Position fixed.

Never scrolls.

Independent from Babylon.

---

Layer 2

Interaction Layer

Purpose

Connect the user with the Digital Twin.

Responsibilities

- Organ selection
- Hover
- Picking
- Zoom
- Rotation
- Camera animation
- Highlight
- Layer visibility

The Interaction Layer never contains medical information.

It only manages interactions.

---

Layer 1

Digital Twin Scene

Purpose

Render the biological entity.

Current implementation

Babylon.js

Contains

- Camera
- Lights
- Environment
- Human model
- Anatomical layers
- Animations
- Effects

The Scene contains no business logic.

It is only responsible for rendering.

---

Rendering Order

Dialogs

↓

Floating Panels

↓

Header

↓

Bottom Navigation

↓

Interaction Layer

↓

Babylon Scene

↓

HTML Body

---

Core Rule

The Body HTML contains only the Scene.

Every other interface element is rendered as an overlay.

This architecture follows the same philosophy as OPE-SAR.

Map → Human Body

Leaflet → Babylon

Geographic Navigation → Anatomical Navigation

# 3. UI Components

Medical Digital Twin is built from reusable components.

Each component has a single responsibility.

Components never contain business logic.

Business logic belongs to modules.

Components display information.

---

# Component Categories

The UI is divided into six families.

- Layout
- Scene
- Navigation
- Floating Panels
- Widgets
- Dialogs

---

# Layout Components

These components are always present.

## Header

Purpose

Display the global state of the Digital Twin.

Examples

- Outdoor weather
- Internal body weather
- Recovery
- Time
- Moon phase
- UV
- Air Quality
- Connected devices

Characteristics

Always visible.

Compact.

Position fixed.

Never blocks the Digital Twin.

---

## Bottom Navigation

Purpose

Switch between major application modes.

Contains only icons.

No labels.

Always visible.

Floating.

Rounded.

Glass effect.

---

## Dock

Purpose

Provide quick access to frequently used tools.

Examples

- Search

- Timeline

- Layers

- Camera Reset

- Notifications

- AI Assistant

- Emergency Mode

Dock buttons may appear or disappear depending on context.

---

# Scene Components

## Human Renderer

The Babylon renderer.

Responsible only for displaying the Digital Twin.

No medical logic.

---

## Camera Controller

Controls

- Rotation

- Zoom

- Pan

- Focus

- Fly To

---

## Selection Manager

Responsible for

- Picking

- Hover

- Organ selection

- Highlight

- Multi-selection

Selection is propagated through the Store.

---

## Layer Manager

Controls scene visibility.

Examples

Skin

Muscles

Skeleton

Organs

Vessels

Lymphatic

Nervous System

Tumors

Dose Maps

Temperature

Perfusion

Simulation Layers

Layers never modify medical data.

They only affect rendering.

---

# Navigation Components

Navigation never relies on traditional menus when an anatomical interaction is possible.

Navigation methods

- Mouse
- Touch
- Keyboard
- Search
- Organ Selection
- Timeline
- Camera Presets

The preferred navigation method is always anatomical interaction.

---

# Floating Panels

Floating Panels are contextual windows.

They never exist permanently.

Examples

Patient Panel

Heart Panel

Brain Panel

Liver Panel

Imaging Panel

Medication Panel

Laboratory Panel

Simulation Panel

Knowledge Panel

Timeline Panel

Environment Panel

Characteristics

Floating

Dockable

Resizable

Collapsible

Movable

Glass UI

Panels may coexist.

They communicate only through the Store.

---

# Widgets

Widgets are lightweight contextual components.

Examples

Status Chip

Metric Card

Timeline Event

Warning Badge

Device Status

Connection Indicator

Progress Ring

Dose Gauge

Risk Indicator

Widgets never own data.

They display information received from modules.

---

# Dialogs

Dialogs temporarily interrupt interaction.

Examples

Settings

Import

Search

Preferences

Patient Selection

Simulation Wizard

Confirmation

Dialogs are modal.

Dialogs never communicate directly with Babylon.

# 4. Navigation

Medical Digital Twin does not use traditional software navigation.

The user navigates inside a biological entity.

The Digital Twin itself is the primary navigation interface.

Menus are secondary.

---

# Navigation Philosophy

Navigation must always feel natural.

Whenever possible, users interact directly with the Digital Twin.

Navigation should minimize context switching.

The user should never lose spatial awareness.

---

# Navigation Modes

Medical Digital Twin provides multiple complementary navigation modes.

Each mode accesses the same Digital Twin.

Only the interaction changes.

---

## 1. Anatomical Navigation

Primary navigation mode.

The user interacts directly with the biological model.

Examples

Click Heart

↓

Focus Heart

↓

Display Heart Information

Click Brain

↓

Focus Brain

↓

Display Brain Information

The Digital Twin becomes the menu.

---

## 2. Camera Navigation

The user freely explores the Digital Twin.

Supported interactions

Rotate

Pan

Zoom

Orbit

Fly To

Reset View

Center Selection

The camera must always move smoothly.

No abrupt transitions.

---

## 3. Layer Navigation

Users can reveal or hide anatomical layers.

Examples

Skin

Muscles

Skeleton

Organs

Blood Vessels

Lymphatic System

Nervous System

Tumors

Dose Maps

Simulation Layers

Layers only affect visualization.

They never modify data.

---

## 4. Lens Navigation

The Digital Twin remains identical.

Only the interpretation changes.

Examples

Anatomy Lens

Displays anatomical structures.

Physiology Lens

Displays physiological activity.

Imaging Lens

Displays CT, MRI, PET and Ultrasound.

Laboratory Lens

Displays laboratory values mapped to organs.

Medication Lens

Displays drug effects.

Devices Lens

Displays connected devices.

Environment Lens

Displays environmental influence.

Simulation Lens

Displays predictive simulations.

Timeline Lens

Displays temporal evolution.

Multiple lenses may be active simultaneously.

---

## 5. Temporal Navigation

The user may navigate through time.

Past

Present

Predicted Future

Simulation

The Digital Twin updates continuously.

The user does not change pages.

The body evolves.

---

## 6. Search Navigation

The search engine navigates directly to structures.

Examples

Heart

Left Kidney

Liver

Aorta

Femur

Insulin

Troponin

Pulmonary Artery

Search results may represent

Organs

Tissues

Laboratory Results

Medical Devices

Pathologies

Medications

Knowledge Articles

Selecting a result automatically moves the camera.

---

## 7. Guided Navigation

Medical workflows may guide navigation.

Examples

Cardiology Examination

Oncology Follow-up

Radiotherapy Planning

Emergency Assessment

Annual Check-up

The system automatically focuses relevant anatomical structures.

---

# Selection

Only one primary anatomical selection exists.

Store.selection.primary

Additional selections may exist.

Store.selection.secondary

Examples

Heart

+

Left Coronary Artery

+

LAD Stent

Selection is always propagated through the Store.

No component communicates directly with another component.

---

# Camera Behaviour

The camera is never teleported.

Transitions are animated.

Examples

Focus

Orbit

Zoom

Fade

Cross Section

Transparency

The Digital Twin always remains understandable.

---

# Spatial Awareness

The user must always know

Where they are

What they selected

Which lens is active

Which anatomical layer is visible

Which time period is displayed

Navigation should never disorient the user.

---

# Navigation Rules

Prefer anatomical interaction.

Prefer direct manipulation.

Avoid unnecessary menus.

Avoid deep navigation trees.

Keep the body visible whenever possible.

Never hide orientation.

The Human Digital Twin is always the navigation reference.

# Architecture Stability

Medical Digital Twin is a long-term project.

Architecture changes are extremely expensive.

Therefore the architecture must remain stable.

New features must integrate into the existing architecture.

They must not redefine it.

The architecture evolves only through major versions.

Version 1.x

Bug fixes

New features

New modules

No architectural changes.

Version 2.0

Architecture review.

Only if absolutely necessary.

# Architecture Principles

The following principles are immutable.

Every future development must respect them.

If a feature cannot respect these principles, the feature must be redesigned.

The architecture must not be modified.

---

## 1. The Digital Twin is the Application

The Human Digital Twin is the primary interface.

The user never leaves the Digital Twin.

The body is always the navigation reference.

---

## 2. Everything is Spatial

Every interaction should preserve spatial awareness.

Users should always know

- where they are
- what they selected
- what they are observing

Navigation must never become abstract.

---

## 3. Modules own the Data

Modules are responsible for

- importing
- processing
- validating
- storing
- exposing

their own data.

Modules never know how data is rendered.

---

## 4. The Scene owns the Rendering

The Babylon Scene is responsible only for rendering.

No business logic exists inside the renderer.

---

## 5. Layers organize the Scene

Everything displayed inside the Scene belongs to a Layer.

Examples

Anatomy

Imaging

Laboratory

Devices

Simulation

Knowledge

Timeline

Environment

Annotations

Future layers must integrate into the Layer system.

---

## 6. Lenses organize the View

Lenses never contain data.

A Lens is a visualization preset.

It activates

- Layers

- Camera

- Widgets

- Panels

- Rendering Options

without modifying the Digital Twin.

---

## 7. Overlays never belong to the Scene

Header

Bottom Navigation

Dock

Panels

Dialogs

Notifications

always exist outside Babylon.

They communicate only through the Store.

---

## 8. Store is the Communication Bus

Components never communicate directly.

Modules never communicate directly.

Everything passes through

Store

or

Twin Runtime.

---

## 9. Context before Navigation

Whenever possible

clicking

hovering

selecting

an anatomical structure

must replace menu navigation.

---

## 10. Progressive Disclosure

Never display unnecessary information.

Information appears only when needed.

The interface should become richer only when the user explores.

---

## 11. Digital Twin First

Every new feature must answer one question.

"Does it improve the Digital Twin?"

If not

it probably belongs somewhere else.

---

## 12. Architecture Stability

Architecture is frozen.

New features integrate into the architecture.

They do not redefine it.

Architecture changes require a major version.

Version 1.x

No architecture changes.

Version 2.x

Architecture review allowed.

# 17. Non Goals

Medical Digital Twin has a clearly defined scope.

The objective is not to replace existing medical software.

The objective is to provide a unified Digital Twin capable of integrating information coming from multiple sources into a single interactive biological representation.

The following items are explicitly outside the scope of the project.

---

## Medical Digital Twin is NOT an Electronic Health Record

Medical Digital Twin is not intended to replace the patient's medical record.

Existing Hospital Information Systems remain the source of truth for administrative and clinical documentation.

---

## Medical Digital Twin is NOT a PACS

Medical Digital Twin does not replace PACS systems.

PACS remain responsible for storing and distributing medical images.

Medical Digital Twin visualizes imaging data inside the Digital Twin.

---

## Medical Digital Twin is NOT a DICOM Viewer

The project may display DICOM images.

However, dedicated diagnostic viewers remain the reference for medical interpretation.

Medical Digital Twin provides contextual visualization.

---

## Medical Digital Twin is NOT a Treatment Planning System

Radiotherapy treatment planning systems remain responsible for

- contouring

- optimization

- dose calculation

- plan approval

Medical Digital Twin visualizes treatment information.

It does not calculate or approve treatments.

---

## Medical Digital Twin is NOT a Laboratory Information System

Laboratory systems remain responsible for

- sample management

- validation

- reporting

Medical Digital Twin contextualizes laboratory values.

---

## Medical Digital Twin is NOT a Device Manufacturer Platform

Connected devices remain managed by their manufacturers.

Medical Digital Twin aggregates and contextualizes measurements.

---

## Medical Digital Twin is NOT a Dashboard

The application is not built around charts.

It is not built around cards.

It is not built around menus.

The Digital Twin is the interface.

Charts, widgets and panels exist only to explain what is happening inside the Digital Twin.

---

## Medical Digital Twin is NOT a Collection of Independent Modules

Modules are implementation units.

Users never navigate between modules.

Users navigate inside the Digital Twin.

Modules provide information.

The Digital Twin integrates it.

---

## Medical Digital Twin is NOT a Static Anatomical Viewer

The body is alive.

The Digital Twin evolves continuously.

Time is a first-class dimension.

Physiology is a first-class dimension.

Environment is a first-class dimension.

Simulation is a first-class dimension.

---

## Medical Digital Twin is NOT Human-Specific

The architecture is designed for biological Digital Twins.

The first implementation targets humans.

The architecture shall support other biological entities without redesign.

Examples include

- mammals

- veterinary medicine

- laboratory animals

- isolated organs

- organoids

- experimental biological models

---

## Medical Digital Twin DOES

Medical Digital Twin

- integrates heterogeneous medical data

- represents biology spatially

- represents biology temporally

- contextualizes information

- supports exploration

- supports simulation

- supports education

- supports research

- supports clinical decision support

- supports precision medicine

while keeping the Digital Twin at the center of the user experience.

---

## Final Principle

Whenever a new feature is proposed, ask one question.

"Does this improve the Digital Twin?"

If the answer is yes,

the feature probably belongs inside Medical Digital Twin.

If the answer is no,

the feature probably belongs to another software.


# Final Vision

Medical Digital Twin aims to become the operating system of a biological Digital Twin.

Applications do not own the patient.

Modules do not own the patient.

Data do not own the patient.

The Digital Twin owns the representation.

Everything else is only another way of observing it.
