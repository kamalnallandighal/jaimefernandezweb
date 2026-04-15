interface Window {
  Calendly?: {
    initInlineWidget: (options: {
      url: string
      parentElement: HTMLElement
    }) => void
  }

  google?: {
    maps: {
      // New async loader — required when script uses loading=async
      importLibrary: (library: string) => Promise<Record<string, unknown>>
      places: {
        // Legacy class kept for type reference; runtime uses PlaceAutocompleteElement
        Autocomplete: new (
          input: HTMLInputElement,
          opts?: {
            types?: string[]
            componentRestrictions?: { country: string | string[] }
            fields?: string[]
          }
        ) => {
          addListener: (event: string, handler: () => void) => void
          getPlace: () => {
            formatted_address?: string
            address_components?: Array<{
              long_name: string
              short_name: string
              types: string[]
            }>
          }
        }
      }
    }
  }
}
