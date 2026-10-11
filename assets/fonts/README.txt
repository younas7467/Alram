Jameel Noori Nastaleeq is not included in this project.

To add it, place a properly licensed WOFF2 font file here as
JameelNooriNastaleeq.woff2. The build copies this assets directory into
www/assets for the web app and Capacitor Android package.

Then add this declaration near the top of style.css:

@font-face {
  font-family: "Jameel Noori Nastaleeq";
  src: url("assets/fonts/JameelNooriNastaleeq.woff2") format("woff2");
  font-display: swap;
}

Until the font is supplied, the Urdu heading uses the Nastaliq/Naskh system
fallbacks declared in style.css.
