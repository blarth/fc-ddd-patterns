import SendEmailWhenProductIsCreatedHandler from "../../product/event/handler/send-email-when-product-is-created.handler";
import SendSendNotificationWhenCostumerIsCreatedHandler from "../../customer/event/handler/send-notification-when-user-changes-address.handler";
import ProductCreatedEvent from "../../product/event/product-created.event";
import CustomerChangedAddressEvent from "../../customer/event/customer-changed-address.event";
import EventDispatcher from "./event-dispatcher";
import Address from "../../customer/value-object/address";
import SendNotificationWhenCostumerIsCreatedHandler from "../../customer/event/handler/send-notfication-when-customer-is-created.handler";
import SendSecNotificationWhenCostumerIsCreatedHandler from "../../customer/event/handler/send-sec-notification-when-customer-is-created.handler";
import SendNotificationWhenCustomerChangedAddressEvent from "../../customer/event/handler/send-notification-when-user-changes-address.handler";
import CustomerCreatedEvent from "../../customer/event/customer-created.event";
import CustomerCreatedEvent2 from "../../customer/event/customer-created-second.event";

describe("Domain events tests", () => {
  it("should register an event handler", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();
    const eventCustomerHandler = new SendNotificationWhenCostumerIsCreatedHandler();
    const eventAddressHandler = new SendSendNotificationWhenCostumerIsCreatedHandler();

    eventDispatcher.register("ProductCreatedEvent", eventHandler);
    
    
    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"]
    ).toBeDefined();
    expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(
      1
    );
    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
    ).toMatchObject(eventHandler);

    eventDispatcher.register("CustomerChangedAddressEvent", eventAddressHandler);
    expect(
      eventDispatcher.getEventHandlers["CustomerChangedAddressEvent"]
    ).toBeDefined();
    expect(eventDispatcher.getEventHandlers["CustomerChangedAddressEvent"].length).toBe(
      1
    );
    expect(
      eventDispatcher.getEventHandlers["CustomerChangedAddressEvent"][0]
    ).toMatchObject(eventAddressHandler);

    eventDispatcher.register("CustomerCreatedEvent", eventCustomerHandler);
    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"]
    ).toBeDefined();
    expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"].length).toBe(
      1
    );
    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]
    ).toMatchObject(eventCustomerHandler);
  });

  it("should unregister an event handler", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();

    eventDispatcher.register("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
    ).toMatchObject(eventHandler);

    eventDispatcher.unregister("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"]
    ).toBeDefined();
    expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(
      0
    );
  });

  it("should unregister all event handlers", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();

    eventDispatcher.register("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
    ).toMatchObject(eventHandler);

    eventDispatcher.unregisterAll();

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"]
    ).toBeUndefined();
  });

  it("should notify all event handlers", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();
    const eventCustomerHandler = new SendNotificationWhenCostumerIsCreatedHandler()
    const secondEventCustomerHandler = new SendSecNotificationWhenCostumerIsCreatedHandler()
    const eventAddressHandler = new SendNotificationWhenCustomerChangedAddressEvent();
    const spyEventHandler = jest.spyOn(eventHandler, "handle");
    const spyEventCustomerAddressHandler = jest.spyOn(eventAddressHandler, "handle");
    const spyEventCustomerCreatedHandler = jest.spyOn(eventCustomerHandler, "handle");
    const spySecEventCustomerCreatedHandler = jest.spyOn(secondEventCustomerHandler, "handle");

    eventDispatcher.register("ProductCreatedEvent", eventHandler);
    

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
    ).toMatchObject(eventHandler);

    eventDispatcher.register("CustomerChangedAddressEvent", eventAddressHandler);

    expect(
      eventDispatcher.getEventHandlers["CustomerChangedAddressEvent"][0]
    ).toMatchObject(eventAddressHandler);

    eventDispatcher.register("CustomerCreatedEvent", eventCustomerHandler);
    eventDispatcher.register("CustomerCreatedEvent2", secondEventCustomerHandler);

    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]
    ).toMatchObject(eventCustomerHandler);
    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent2"][0]
    ).toMatchObject(secondEventCustomerHandler);
    

    const productCreatedEvent = new ProductCreatedEvent({
      name: "Product 1",
      description: "Product 1 description",
      price: 10.0,
    });
    const address = new Address("Street 1", 123, "13330-250", "São Paulo")
    const customerChangedAddressEvent = new CustomerChangedAddressEvent({
      ID: "123",
      name: "João Marcos",
      Address: address.toString()
    });

    const customerCreatedEvent = new CustomerCreatedEvent({
      name : "João Marcos",
      ID : "123"
    })
    const customerCreatedEvent2 = new CustomerCreatedEvent2({
      name : "João Marcos",
      ID : "123"
    })

    
    eventDispatcher.notify(productCreatedEvent);
    eventDispatcher.notify(customerChangedAddressEvent);
    eventDispatcher.notify(customerCreatedEvent);
    eventDispatcher.notify(customerCreatedEvent2);

    expect(spyEventHandler).toHaveBeenCalled();
    expect(spyEventCustomerAddressHandler).toHaveBeenCalled();
    expect(spyEventCustomerCreatedHandler).toHaveBeenCalled();
    expect(spySecEventCustomerCreatedHandler).toHaveBeenCalled();
  });
});
