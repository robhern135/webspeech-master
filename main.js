$(function() {
  console.log("ready!");

  //init SpeechSynth API
  const synth = window.speechSynthesis;

  // DOM Elements
  const textForm = document.querySelector("form");
  const textInput = document.querySelector("#text-input");
  const voiceSelect = document.querySelector("#voice-select");
  const rate = document.querySelector("#rate");
  const rateValue = document.querySelector("#rate-value");
  const pitch = document.querySelector("#pitch");
  const pitchValue = document.querySelector("#pitch-value");
  const body = document.querySelector("body");

  //init voices array
  let voices = [];

  const getVoices = () => {
    voices = synth.getVoices();
    //just log one to see structure
    console.log(voices[0]);
    //loop through voices and create an option for each one
    voices.forEach(voice => {
      //create <option> element
      const option = document.createElement("option");

      //fill option with voice and language
      option.textContent = `${voice.name} (${voice.lang})`;

      //Set needed option attributes
      option.setAttribute("data-lang", voice.lang);
      option.setAttribute("data-name", voice.name);
      voiceSelect.appendChild(option);
    });
  };

  getVoices();

  if (synth.onvoiceschanged !== undefined) {
    synth.onvoiceschanged = getVoices;
  }

  //Speak
  const speak = () => {
    //check if speaking
    if (synth.speaking) {
      console.error("already speaking");
      return;
    }
    if (textInput.value !== "") {
      //add background gif
      body.style.background = '#141414 url("../img/wave.gif")';
      body.style.backgroundRepeat = "repeat-x";
      body.style.backgroundSize = "100% 100%";

      //get speak text
      const speakText = new SpeechSynthesisUtterance(textInput.value);

      // speak end
      speakText.onend = e => {
        console.log("Done speaking...");
        body.style.background = "#141414";
      };

      //speak error
      speakText.onerror = e => {
        console.error("Something went wrong");
      };

      //Selected voice
      const selectedVoice = voiceSelect.selectedOptions[0].getAttribute(
        "data-name"
      );

      //loop through voices to find selected voice
      voices.forEach(voice => {
        if (voice.name === selectedVoice) {
          speakText.voice = voice;
        }
      });
      //set pitch and rate
      speakText.rate = rate.value;
      speakText.pitch = pitch.value;
      //Speak!
      synth.speak(speakText);
    }
  };

  //EVENT LISTENERS

  //Text form submission
  textForm.addEventListener("submit", e => {
    e.preventDefault();
    speak();
    textInput.blur();
  });

  //Rate value change
  rate.addEventListener("change", e => {
    rateValue.textContent = rate.value;
    speak();
  });
  //Pitch value change
  pitch.addEventListener("change", e => {
    pitchValue.textContent = pitch.value;
    speak();
  });

  //After voice select, speak again
  voiceSelect.addEventListener("change", e => speak());
}); //end doc ready
