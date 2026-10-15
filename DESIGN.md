---
name: Keep
description: A quiet iOS notes index. Neutral surfaces, one red for destruction, and the note text as the content.
colors:
  paper: 'hsl(0 0% 100%)'
  ink: 'hsl(0 0% 9%)'
  ink-soft: 'hsl(0 0% 3.9%)'
  paper-soft: 'hsl(0 0% 98%)'
  mist: 'hsl(0 0% 96.1%)'
  graphite: 'hsl(0 0% 45.1%)'
  hairline: 'hsl(0 0% 89.8%)'
  focus: 'hsl(0 0% 63%)'
  signal: 'hsl(0 84.2% 60.2%)'
  night-raised: 'hsl(0 0% 14.9%)'
  night-graphite: 'hsl(0 0% 63.9%)'
  night-signal: 'hsl(0 70.9% 59.4%)'
  night-focus: 'hsl(300 0% 45%)'
typography:
  headline:
    fontFamily: 'System'
    fontSize: '1.875rem'
    fontWeight: 700
    lineHeight: '2.25rem'
    letterSpacing: '-0.025em'
  title:
    fontFamily: 'System'
    fontSize: '1rem'
    fontWeight: 600
    lineHeight: '1.25rem'
    letterSpacing: 'normal'
  body:
    fontFamily: 'System'
    fontSize: '1rem'
    fontWeight: 400
    lineHeight: '1.25rem'
    letterSpacing: 'normal'
  label:
    fontFamily: 'System'
    fontSize: '0.875rem'
    fontWeight: 500
    lineHeight: '1.25rem'
    letterSpacing: 'normal'
rounded:
  md: '8px'
  lg: '10px'
  xl: '12px'
  sheet: '20px'
spacing:
  '1': '4px'
  '1.5': '6px'
  '2': '8px'
  '3': '12px'
  '4': '16px'
  '5': '20px'
  '6': '24px'
components:
  button-primary:
    backgroundColor: '{colors.ink}'
    textColor: '{colors.paper-soft}'
    typography: '{typography.label}'
    rounded: '{rounded.md}'
    padding: '8px 16px'
    height: '40px'
  button-primary-active:
    backgroundColor: 'hsl(0 0% 9% / 0.9)'
    textColor: '{colors.paper-soft}'
    typography: '{typography.label}'
    rounded: '{rounded.md}'
    padding: '8px 16px'
    height: '40px'
  button-large:
    backgroundColor: '{colors.ink}'
    textColor: '{colors.paper-soft}'
    typography: '{typography.label}'
    rounded: '{rounded.md}'
    padding: '8px 24px'
    height: '44px'
  button-secondary:
    backgroundColor: '{colors.mist}'
    textColor: '{colors.ink}'
    typography: '{typography.label}'
    rounded: '{rounded.md}'
    padding: '8px 16px'
    height: '40px'
  button-outline:
    backgroundColor: '{colors.paper}'
    textColor: '{colors.ink-soft}'
    typography: '{typography.label}'
    rounded: '{rounded.md}'
    padding: '8px 16px'
    height: '40px'
  button-ghost:
    backgroundColor: 'transparent'
    textColor: '{colors.ink-soft}'
    typography: '{typography.label}'
    rounded: '{rounded.md}'
    padding: '8px 16px'
    height: '40px'
  button-destructive:
    backgroundColor: '{colors.signal}'
    textColor: 'hsl(0 0% 100%)'
    typography: '{typography.label}'
    rounded: '{rounded.md}'
    padding: '8px 16px'
    height: '40px'
  input:
    backgroundColor: '{colors.paper}'
    textColor: '{colors.ink-soft}'
    typography: '{typography.body}'
    rounded: '{rounded.md}'
    padding: '4px 12px'
    height: '40px'
  textarea:
    backgroundColor: 'transparent'
    textColor: '{colors.ink-soft}'
    typography: '{typography.body}'
    rounded: '{rounded.md}'
    padding: '8px 12px'
  note-card:
    backgroundColor: '{colors.paper}'
    textColor: '{colors.ink-soft}'
    typography: '{typography.title}'
    rounded: '{rounded.xl}'
    padding: '12px'
  composer-trigger:
    backgroundColor: '{colors.paper}'
    textColor: '{colors.graphite}'
    typography: '{typography.body}'
    rounded: '{rounded.lg}'
    padding: '12px 16px'
    height: '44px'
---

# Design System: Keep

## Overview

**Creative North Star: "The Quiet Index Card"**

Assumption: this name was not chosen in an interview. It describes the interface that is already shipping. Home is a white (or near-black) index. Each note is a small card. The words on the card are the colour. Chrome stays out of the way.

The system is the React Native Reusables new-york preset on a neutral base: achromatic surfaces, a hairline border, and a shadow so light it barely lifts the card. Density is comfortable on a phone, not compact. The only strong weight is the screen title. Everything else is body or label.

Dark mode is the same structure with the surfaces inverted, not a second palette. A fluent iPhone user should recognise a large title, a sheet for writing, and safe areas. The controls are the shared button and field components, not a custom iOS kit.

**Key Characteristics:**

- Monochrome surfaces. Hue is reserved for a destructive action.
- The note's own words are the card. No icon, no metadata row, no colour chip.
- Hairline borders do the separating. Shadows stay at the smallest step.
- One large left-aligned title per top-level screen.
- Writing happens in a sheet. Leaving the sheet is what saves.

## Colors

The palette is neutral. Light and dark reuse the same inks and papers; only the raised surface, the muted label, the focus ring, and the destructive red have a dark-specific value.

Google Keep's note colours (yellow, green, blue, and the rest) are a product intention in `PRODUCT.md`. They are not tokens. Do not paint cards with them until they exist here.

### Primary

- **Ink** (`colors.ink`): the primary button fill in light, and the primary label in dark. It is the control colour, not a brand wash.
- **Soft paper** (`colors.paper-soft`): the label on that primary button, and the primary fill in dark.

### Neutral

- **Paper** (`colors.paper`): light background, card, and popover.
- **Soft ink** (`colors.ink-soft`): light body text, and the dark background. The same value does both jobs.
- **Mist** (`colors.mist`): secondary, muted, and accent fills in light. Quiet buttons and pressed ghosts land here.
- **Graphite** (`colors.graphite`): secondary labels in light, including «Create a note...» and the empty-state line. It stays at this step, not a lighter tint.
- **Hairline** (`colors.hairline`): borders and input strokes in light.
- **Focus** (`colors.focus`): the light focus ring.
- **Night raised** (`colors.night-raised`): dark secondary fill, dark border, and dark input surface.
- **Night graphite** (`colors.night-graphite`): secondary labels in dark.
- **Night focus** (`colors.night-focus`): the dark focus ring. The hue channel is unused; the colour is grey.

### Named Rules

**The One Chromatic Rule.** Signal red (`colors.signal` in light, `colors.night-signal` in dark) is the only hue. It is the destructive button. It is not a link colour, a pin, or a note background.

## Typography

**Display Font:** none. There is no branded display face.
**Body Font:** System (San Francisco on iOS, the platform sans elsewhere)
**Label/Mono Font:** System for labels. The monospace face exists only on the `code` text variant.

**Character:** A plain system sans, tight on the screen title and normal everywhere else. Hierarchy comes from size and weight, not from a second family.

### Hierarchy

- **Headline** (700, 1.875rem, line-height 2.25rem, tracking -0.025em): the word «Keep» on home. Left aligned. One per top-level screen.
- **Title** (600, 1rem, line-height 1.25rem): the note card title, two lines at most.
- **Body** (400, 1rem, line-height 1.25rem): composer fields and the unknown-route message.
- **Label** (500, 0.875rem, line-height 1.25rem): button labels. Note body copy uses the same size at weight 400, up to eight lines.

The `Text` component also defines a centered 2.25rem extrabold heading. No shipping screen uses it.

### Named Rules

**The Left Title Rule.** The screen name sits on the left, at the headline size above. Do not center it, and do not put a second line above it.

## Layout

Phone width, inside the safe area. Home is a header band, then the composer trigger, then a two-column masonry of notes, newest first.

The page gutter on the header and the composer trigger is 24px. The list inset is 20px, with 4px between a column and its card. The header band has 16px of vertical padding and a bottom hairline. The trigger sits 16px under that band. The list starts 16px under the trigger. Cards stack with 8px between rows.

The composer is a form sheet at 85% and full height, with a 20px top radius and the system grabber. Its fields use a 16px page inset and 12px between title and body. The close control sits in a 16px footer inset.

The unknown route uses the same 24px gutter and 16px top padding as the header. It is a message, then the home link. It is not a second home.

There is no tab bar and no custom navigation bar. The stack is headerless.

## Elevation & Depth

Depth is tonal, with a hairline, plus the smallest shadow on cards, fields, and filled buttons. The shadow is a soft drop (`0 1px 2px` at 5% black), not a coloured halo and not a hard offset. Flat areas (the page, the ghost button) stay flat.

Dark mode does not add a heavier shadow. The raised surface (`colors.night-raised`) and the border do the work when the page and the card share the dark background.

### Shadow Vocabulary

- **Resting lift** (`box-shadow: 0 1px 2px rgb(0 0 0 / 0.05)`): cards, inputs, and filled buttons at rest.

### Named Rules

**The Hairline Rule.** A 1px border is the separator. Do not stack a second shadow style, and do not drop the border in favour of a larger shadow.

## Shapes

Corners are slightly rounded and consistent. Fields and buttons use 8px. The composer trigger uses 10px, which is the shared radius token. Note cards use 12px. The sheet uses 20px, set on the route, not on a card.

Borders are solid 1px hairlines. Cards are not clipped into circles, and rows are not grouped into an inset iOS list. The note is a card because the home layout is a masonry of notes, not a settings screen.

## Components

### Buttons

- **Shape:** gently rounded (8px), label at the label size, medium weight.
- **Primary:** Ink fill, soft-paper label, 16px horizontal padding, 40px tall. Pressed and hovered fill is ink at 90%. Disabled is the same button at 50% opacity.
- **Large:** the composer Close control. Same primary colours, 44px tall, 24px horizontal padding.
- **Secondary:** Mist fill, ink label.
- **Outline:** paper fill, hairline border, foreground label. Dark uses the raised surface.
- **Ghost:** no fill until pressed, then mist.
- **Destructive:** signal red fill, white label. Not used on a shipping screen.
- **Focus:** on web, a 3px ring at 50% of the focus colour. Native press feedback is the active background.

### Cards / Containers

- **Corner style:** 12px on the note card.
- **Background:** paper in light. In dark the card token matches the page, so the hairline is what shows the edge.
- **Shadow strategy:** the resting lift, plus the hairline.
- **Border:** 1px, the border token.
- **Internal padding:** 12px. Title and body are 6px apart. The shared card primitive's default padding is larger; the note card overrides it.
- **Content:** title up to two lines, body up to eight. A blank field is omitted. A note with neither is not shown.

### Inputs / Fields

- **Style:** 8px corners, 1px input border, 12px horizontal padding. The single-line field is 40px tall on the default size. The body field grows to fill the sheet.
- **Text:** body size, foreground colour. The placeholder is graphite, the same step as other secondary labels, in both appearances.
- **Focus:** web shows the 3px focus ring. An invalid field switches the border to signal red.
- **Disabled:** 50% opacity.
- **Error:** the components accept an invalid state. The composer does not show one. A failed save blocks the dismiss instead of painting the field.

### Composer trigger

The home control that opens the sheet. Paper fill, hairline, 10px corners, at least 44px tall, graphite label «Create a note...». It is the entry to the only task on the screen.

### Screen header

A bottom hairline, 24px horizontal padding, 16px vertical padding, and the headline. No button in the band.

## Do's and Don'ts

### Do:

- **Do** keep body and secondary text on graphite or night graphite. Those steps clear ordinary reading contrast on paper and on soft ink.
- **Do** give every control at least 44px of height. The composer trigger and Close already do.
- **Do** save when the sheet dismisses, and keep the grabber. The sheet is the composer.
- **Do** follow the system appearance. Light and dark are both first-class.

### Don't:

- **Don't** introduce a second hue, a gradient, a glass blur, or a display webfont. The index stays quiet.
- **Don't** colour a note with a Keep palette colour until that colour is a token in this file.
- **Don't** center the screen title or add a kicker above it.
- **Don't** replace the masonry card with an icon-and-heading tile. The card's content is the note.
- **Don't** invent a tab bar for a single index.
