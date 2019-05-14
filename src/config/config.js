export const tokenEndpoint = process.env.VUE_APP_TOKEN_ENDPOINT
export const authorizeEndpoint = process.env.VUE_APP_AUTHORIZE_ENDPOINT
export const hotelApiId = process.env.VUE_APP_AUTH_ID
export const hotelApiSecret = process.env.VUE_APP_AUTH_SECRET
export const authCodeRedirectUrl = process.env.VUE_APP_AUTHORIZE_ENDPOINT_REDIRECT_URL
export const hotelApiUrl = process.env.VUE_APP_HOTEL_API_URL
export const hotelApiImageUrl = process.env.VUE_APP_HOTEL_API_IMAGE_URL
export const authURL = authorizeEndpoint + "?response_type=code&client_id=" + hotelApiId + "&redirect_url=" + window.location.origin + authCodeRedirectUrl