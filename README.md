# Auto Tab Mute

## About

This is a web extension that automatically mutes background tabs if the current tab is playing audio. This allows for fast switching between different audio playing tabs without manually muting and unmuting. This function can be toggled on/off by a button added to the browser interface or by a keyboard shortcut (Alt-Shift-U by default).

## Build

`yarn install` to install dependencies

### Chrome

`yarn run build:chrome` to build

#### In browser
Go to `chrome://extensions`
Enable `Developer Mode`
Click on `Load Unpacked Extension...`
Select Chrome from the `extension/` folder in the project folder


## Release

A release script is provided that will update the version and push a tag. 

```
./release.sh
```

By default, this will increment the minor version, flags `-m` or `--major` and `-b` or `--bugfix` can be used to increment the respective version numbers.

The GitHub workflow will then build the project and create the release.

Output from that is still uploaded manually to the Chrome developer store.