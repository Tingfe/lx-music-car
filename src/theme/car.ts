/**
 * Fixed, high-contrast surfaces for the car edition.
 *
 * These colours intentionally stay independent from the many phone themes:
 * changing between day and night must not change the information hierarchy or
 * make the driving controls difficult to recognise.
 */
export const getCarTheme = (isDark: boolean) => isDark
  ? {
      page: '#0A1118',
      surface: '#101B25',
      nav: '#0D161F',
      active: '#18323A',
      border: '#263848',
      accent: '#35D7C2',
      text: '#EAF5F6',
      textMuted: '#B8C7D5',
      iconMuted: '#91A3B2',
    }
  : {
      page: '#DDE7E9',
      surface: '#EDF3F4',
      nav: '#C9D7DA',
      active: '#BDE9E3',
      border: '#8EA7AD',
      accent: '#006C65',
      text: '#10282E',
      textMuted: '#2F5058',
      iconMuted: '#41636B',
    }
