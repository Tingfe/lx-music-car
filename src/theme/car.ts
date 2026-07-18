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
      page: '#F3F7F8',
      surface: '#FFFFFF',
      nav: '#E9F0F2',
      active: '#D8F3F0',
      border: '#C8D8DC',
      accent: '#007F78',
      text: '#10252B',
      textMuted: '#49636B',
      iconMuted: '#607982',
    }
