const API_ENDPOINT = 'https://random-data-api.com/api/color/random_color';

function fetchRandomColor() {
  /*
  The response data from the endpoint is in the following format:
  {
    id: number,
    uid: string,
    hex_value: string, // ex. "#baa4e7"
    color_name: string, // ex. "plum"
    hsl_value: number[], // ex. [127, 0.21, 0.76],
    hsla_value: number[] // ex. [235, 0.38, 0.1, 0.9],
  }
  */

  return fetch(API_ENDPOINT)
    .then(response => response.json());
}

function init() {
  // Set size of Custom Element viewport in Kontent with some extra space for good measure
  CustomElement.setHeight(
    document.querySelector('.container')
      .getBoundingClientRect()
      .height + 50
  );

  // Initialize the Alpine data and other UI functionality
  Alpine.data('color', () => ({
    colorHex: '',
    colorName: '',
    disabled: true,

    init() {
      // First we need to initialize the element in Kontent and connect everything up
      CustomElement.init(element => {
        const { value, disabled } = element;

        // The saved value from kontent comes in as a JSON string
        // so we will deserialize it first, giving it a default
        // value in case there is no value yet.
        const {colorHex, colorName} = JSON.parse(value) ?? {
          colorHex: "#ffffff",
          colorName: "(none)"
        };

        // Update state values
        this.disabled = disabled
        this.colorHex = colorHex;
        this.colorName = colorName;
      });

      // This will be called when the element is disabled or enabled in Kontent
      // (ex. when publishing or creating a new version)
      CustomElement.onDisabledChanged(isDisabled => this.disabled = isDisabled);
    },

    getRandomColor() {
      fetchRandomColor().then(data => {
        // Update state values
        this.colorHex = data.hex_value;
        this.colorName = data.color_name;

        // Save the updated data as a JSON string in Kontent
        CustomElement.setValue(JSON.stringify({
          colorHex: data.hex_value,
          colorName: data.color_name
        }));
      });
    }
  }));
}

// Wait until Alpine is initialized, then initialize our app
document.addEventListener('alpine:init', () => init());
