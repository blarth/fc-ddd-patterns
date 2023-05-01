import EventHandlerInterface from "../../../@shared/event/event-handler.interface";
import CustomerCreatedEvent2 from "../customer-created-second.event";



export default class SendSecNotificationWhenCostumerIsCreatedHandler
  implements EventHandlerInterface<CustomerCreatedEvent2>
{
  handle(event: CustomerCreatedEvent2): void {
    console.log(`Esse é o segundo console.log do evento: CustomerCreatedEvent`); 
  }
}
