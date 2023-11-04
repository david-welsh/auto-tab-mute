#!/bin/bash

# Function to display usage
usage() {
    echo "Usage: $0 [-m | --major] [-i | --minor] [-b | --bugfix]"
    echo "  -m, --major    Create a major version release"
    echo "  -i, --minor    Create a minor version release (default)"
    echo "  -b, --bugfix   Create a bugfix (patch) version release"
    exit 1
}

# Default release type
release_type="minor"

# Parse command-line arguments
while [[ "$#" -gt 0 ]]; do
    case $1 in
        -m|--major) release_type="major" ;;
        -i|--minor) release_type="minor" ;;
        -b|--bugfix) release_type="patch" ;;
        *) usage ;;
    esac
    shift
done

# Bump the version according to the release type
version_bump=$(npm version $release_type --no-git-tag-version)

# Extract the new version number
new_version=${version_bump/v/}

echo "New version: $new_version"

# Build the extension
yarn install
yarn run build:chrome

# Commit the version bump and build files
git add package.json yarn.lock package-lock.json
git commit -m "Bump version to $new_version and build"

# Create the tag
git tag -a "v$new_version" -m "Release v$new_version"

# Push the changes and tags to GitHub
git push origin main --follow-tags