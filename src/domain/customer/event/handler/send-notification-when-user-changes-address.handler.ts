import EventHandlerInterface from "../../../@shared/event/event-handler.interface";
import CustomerChangedAddressEvent from "../customer-changed-address.event";


export default class SendNotificationWhenCustomerChangedAddressEvent
  implements EventHandlerInterface<CustomerChangedAddressEvent>
{
  handle(event: CustomerChangedAddressEvent): void {
    console.log(`Endereço do cliente: ${event.eventData.ID}, ${event.eventData.name} alterado para: ${event.eventData.Address}`); 
  }
}
