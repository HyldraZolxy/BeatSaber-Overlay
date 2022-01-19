<div id="top"></div>
<div align="center">
    <h3 align="center">
        BeatSaber-Overlay | Work with
        <a href="https://github.com/opl-/beatsaber-http-status/releases"><strong>HTTPStatus</strong></a> & <a href="https://github.com/kOFReadie/BSDataPuller/releases"><strong>DataPuller</strong></a> !
    </h3>
    <p align="center">
        <br />
        <img src="https://overlay.hyldrazolxy.fr/preview/Overlay_BS_New_Light.gif" alt="liveDemo" />
        <br />
        <br />
        <a href="https://overlay.hyldrazolxy.fr/?setup=true">View Demo</a>
        -
        <a href="https://github.com/HyldraZolxy/BeatSaber-Overlay/issues">Report Bug</a>
        -
        <a href="https://github.com/HyldraZolxy/BeatSaber-Overlay/issues">Request Feature</a>
    </p>
</div>

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li>
      <a href="#options">Options</a>
    </li>
    <li>
      <a href="#roadmap">Roadmap</a>
    </li>
    <li>
      <a href="#contact">Contact</a>
    </li>
  </ol>
</details>

## Getting Started

To use the Overlay, it is necessary to follow the instructions below to ensure that it will work properly

### Prerequisites

1. You will need to download **one** of the two plugins that will be used for the overlay to connect to your game
- [HTTPStatus Plugin](https://github.com/opl-/beatsaber-http-status/releases)
- [DataPuller Plugin](https://github.com/kOFReadie/BSDataPuller/releases)

**YOU HAVE TO INSTALL THE DEPENDENCIES OF THE PLUGINS !**

2. You will need a Stream software
- [OBS](https://obsproject.com/)
- [StreamLabs](https://streamlabs.com/)
- [Other software (All recommended by Twitch)](https://help.twitch.tv/s/article/recommended-software-for-broadcasting?language=en_US)

### Installation

1. Install your stream software, I'm not going to show you how, you're a big boy ;3

2. Put the previously downloaded plugin in your Beat Saber folder `Beat Saber\Plugins\`
    ```sh
    Beat Saber\Plugins\BeatSaberHTTPStatus.dll
    Or
    Beat Saber\Plugins\DataPuller.dll
    ```
3. You can create a new source "Browser" in your stream software and put this url in it
    ```sh
    https://overlay.hyldrazolxy.fr/
    ```
4. Finally, you can put additional options to the url, refer to the chapter options, by default, the overlay displays only the current map
For the first option in the url, you must use ?, for the others &
    ```sh
    Exemple:
    https://overlay.hyldrazolxy.fr/?FirstOption=value&SecondOption=value&ThirdOption=value&etc.....
    ```

<p align="right">(<a href="#top">back to top</a>)</p>

## Options

### `playerId`

If you want to display the player card, you must add an option the player ID

```sh
playerId=YOUR_SCORESABER_ID

Exemple:
playerId=76561198235823594

Full link exemple:
https://overlay.hyldrazolxy.fr/?playerId=76561198235823594
```

### `scale`

If you want to increase or decrease the size of the overlay, you can use the scale option for that

```sh
scale=VALUE

Exemple:
scale=1.5

Full link exemple:
https://overlay.hyldrazolxy.fr/?scale=1.5
```

### `setup`

If you want to see how the overlay will look on your stream

**DO NOT USE IN PRODUCTION**

```sh
setup=VALUE

Exemple:
setup=true

Full link exemple:
https://overlay.hyldrazolxy.fr/?setup=true
```

### `ip`

If you use a dual setup for stream, you can set the ip of the machine where Beat Saber is running so that the overlay of the stream machine can access the plugin data

```sh
ip=VALUE

Exemple:
ip=192.168.1.6

Full link exemple:
https://overlay.hyldrazolxy.fr/?ip=192.168.1.6
```

### `debug`

If you have problems, you can use the Overlay on a web browser with the console open to see the debug messages and find the cause of the problem

**DO NOT USE IN PRODUCTION**

```sh
debug=VALUE

Exemple:
debug=true

Full link exemple:
https://overlay.hyldrazolxy.fr/?debug=true
```

### `skin`

For future use ;3

```sh
skin=VALUE

Exemple:
skin=NameOfSkin

Full link exemple:
https://overlay.hyldrazolxy.fr/?skin=NameOfSkin
```

<p align="right">(<a href="#top">back to top</a>)</p>

## Roadmap

- [x] Optimising the code
- [ ] Adding more data for futur skin
- [ ] Add OBS Support
- [ ] Add more skin
    - [ ] Youtube Video skin (OBS Related)
    - [ ] Friday Night Funkin'
    - [ ] more ....
- [ ] *Twitch support ? (For custom things when channel point is used)*
    - [ ] *Create a PHP support to upload files for twitch by the overlay users*

<p align="right">(<a href="#top">back to top</a>)</p>

## Contact
You can contact me on Discord `Hyldra Zolxy#1910` to ask for various changes, improvements or even special requests!

##### Thanks all and cya <3
<p align="right">(<a href="#top">back to top</a>)</p>
