Uchini (Unused Sass Finder)
=================

# Installation
```sh-session
npm i -g uchini
```

# Usage
```sh-session
uchini ls --scss path/to/scss --content 'path/**/*.html' --output output.json
```

`output.json` is like this:

```json
[
  {
    "selector": ".header",
    "positions": [
      "frontend/stylesheets/_layout.scss:20:2"
    ]
  },
  {
    "selector": ".card",
    "positions": [
      "frontend/stylesheets/_card.scss:1:0"
    ]
  }
]
```
