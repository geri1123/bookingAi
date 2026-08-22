export enum EventName {
  // Konsumohet nga billing-service (publikohet nga core-service)
  BUSINESS_CREATED = "business.created",

  // Publikohen nga billing-service — te tjere shërbime (p.sh. notification-service)
  // mund t'i konsumojne me vone pa qene i lidhur direkt me billing-service.
  SUBSCRIPTION_CREATED = "subscription.created",
  SUBSCRIPTION_CANCELED = "subscription.canceled",
  SUBSCRIPTION_EXPIRED = "subscription.expired",
  SUBSCRIPTION_MESSAGE_LIMIT_REACHED = "subscription.message-limit-reached",
  
}
