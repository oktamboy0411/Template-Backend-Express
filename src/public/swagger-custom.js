/* eslint-disable */
;(function () {
   const STORAGE_KEY = 'swagger_bearer_token'
   const POLL_INTERVAL = 300
   const BEARER_AUTH_NAME = 'bearerAuth'
   const AUTH_SCHEME_TYPE = 'http'
   const AUTH_SCHEME = 'bearer'

   function getAuthActions() {
      if (!window.ui || !window.ui.getSystem) {
         return null
      }
      const system = window.ui.getSystem()
      return system && system.authActions ? system.authActions : null
   }

   function saveToken(token) {
      try {
         localStorage.setItem(STORAGE_KEY, token)
      } catch (error) {
         console.error('Failed to save token:', error)
      }
   }

   function getStoredToken() {
      try {
         return localStorage.getItem(STORAGE_KEY)
      } catch (error) {
         console.error('Failed to retrieve token:', error)
         return null
      }
   }

   function createAuthPayload(token) {
      const payload = {}
      payload[BEARER_AUTH_NAME] = {
         name: BEARER_AUTH_NAME,
         schema: {
            type: AUTH_SCHEME_TYPE,
            scheme: AUTH_SCHEME,
         },
         value: token,
      }
      return payload
   }

   function setupAuthInterceptor(authActions) {
      const originalAuthorize = authActions.authorize

      authActions.authorize = function (payload) {
         if (
            payload &&
            payload[BEARER_AUTH_NAME] &&
            payload[BEARER_AUTH_NAME].value
         ) {
            saveToken(payload[BEARER_AUTH_NAME].value)
         }
         return originalAuthorize(payload)
      }
   }

   function autoAuthorizeFromStorage(authActions) {
      const storedToken = getStoredToken()
      if (storedToken) {
         try {
            const authPayload = createAuthPayload(storedToken)
            authActions.authorize(authPayload)
         } catch (error) {
            console.error('Failed to auto-authorize:', error)
         }
      }
   }

   function initialize() {
      const authActions = getAuthActions()
      if (!authActions) {
         return
      }

      setupAuthInterceptor(authActions)
      autoAuthorizeFromStorage(authActions)
   }

   function startPolling() {
      const pollInterval = setInterval(function () {
         const authActions = getAuthActions()
         if (authActions) {
            clearInterval(pollInterval)
            initialize()
         }
      }, POLL_INTERVAL)
   }

   startPolling()
})()
