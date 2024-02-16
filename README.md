# Plato

A framework-agnostic Shadow Testing tool for the Frontend


## What is Shadow Testing?

![Rundown diagram of how shadow testing works. This will be explained below.](https://miro.medium.com/v2/resize:fit:1400/1*jqvZXpPO1kTJUu-fvk0fIQ.png)
Shadow Requests or Dark Launches (as used by Netflix) are more typical for backend APIs, and are similar to [canary releases](https://en.wikipedia.org/wiki/Feature_toggle#Canary_release),
except here the request gets duplicated and ran against the currently active and candidate APIs, then they get compared against each other to see if the new version is stable.

With Plato, the user's interactions with the website get recorded and replayed by an E2E testing framework (currently only playwright. to be extended.) against the candidate, we then take snapshots of the DOM in both versions and diff them.
(Well at least that's the rough idea)

## How it works?
tba

Essentially we record everything with a lightweight js script then send it to the backend which replays them both snapshots the dom and compares them then we show it on a report portal.

## Why Plato?

I wanted a name quick and the first cool thing I could think of [was Plato's cave](https://en.wikipedia.org/wiki/Allegory_of_the_cave)
