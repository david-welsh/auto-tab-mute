# Auto Tab Mute

## About

This is a chrome extension that automatically mutes background tabs if the current tab is playing audio. This allows for fast switching between different audio playing tabs without manually muting and unmuting. This function can be toggled on/off by a button added to the browser interface or by a keyboard shortcut (Alt-Shift-U by default).


## Build

`yarn install` to install dependencies

### Chrome

`yarn run dev:chrome` to start in development mode
`yarn run build:chrome` to build for distribution

#### In browser
Go to `chrome://extensions`
Enable `Developer Mode`
Click on `Load Unpacked Extension...`
Select Chrome from the `extension/` folder in the project folder

### Firefox

`yarn run dev:firefox` to start in development mode
`yarn run build:firefox` to build for distribution
