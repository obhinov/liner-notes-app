# The Liner Notes App
A web application allowing the user to get detailed credits for a song they're listening to on Spotify. Made using ReactJS and Bootstrap.

## How it Works
The app first access the user's current playing song using the Spotify Web API through OAuth 2.0 authorization, specifically through the Spotify API's User Authorization Code flow (for more info: https://developer.spotify.com/documentation/general/guides/authorization/code-flow/).
<br /> <br />
Once the current playing song info is received, we can then access the Genius API to obtain the song's detailed credits, which includes info on the song's featured artists, writers, producers, arrangement credits, engineering credits, publishing info, and whatever else Genius can provide to us.

## Pictures
The login page:
<br />
<img width="807" alt="app-working-pic_loginPage_v1" src="https://user-images.githubusercontent.com/43919114/208756466-cf1aed38-6898-4ffe-9fac-466eeddf2ce6.PNG">
<br />
The credits page (desktop version):
<br />
<img width="831" alt="app-working-pic-thundercatfunnything_v1" src="https://user-images.githubusercontent.com/43919114/208756494-a83751f0-263a-48be-bc3b-062e52b05ed5.PNG">
<br />
The credits page (mobile version):
<br />
<img width="298" alt="app-working-pic_mobile-version_dualipaphysical_v1" src="https://user-images.githubusercontent.com/43919114/208756596-6e366504-db41-4a10-bb1a-0d674b026296.PNG">
