import { Sequelize } from "sequelize-typescript";
import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import Customer from "../../../../domain/customer/entity/customer";
import Address from "../../../../domain/customer/value-object/address";
import Product from "../../../../domain/product/entity/product";
import CustomerModel from "../../../customer/repository/sequelize/customer.model";
import CustomerRepository from "../../../customer/repository/sequelize/customer.repository";
import ProductModel from "../../../product/repository/sequelize/product.model";
import ProductRepository from "../../../product/repository/sequelize/product.repository";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";
import OrderRepository from "./order.repository";

describe("Order repository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([
      CustomerModel,
      OrderModel,
      OrderItemModel,
      ProductModel,
    ]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });
  

  it("should create a new order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("123", "Product 1", 10);
    await productRepository.create(product);

    const orderItem = new OrderItem(
      "1",
      product.name,
      product.price,
      product.id,
      2
    );

    const order = new Order("123", "123", [orderItem]);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"],
    });

    expect(orderModel.toJSON()).toStrictEqual({
      id: "123",
      customer_id: "123",
      total: order.total(),
      items: [
        {
          id: orderItem.id,
          name: orderItem.name,
          price: orderItem.price,
          quantity: orderItem.quantity,
          order_id: "123",
          product_id: "123",
        },
      ],
    });
  });
  

it("should change the order items for a existing order", async () => {
  const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);
    
    const productRepository = new ProductRepository();
    const product = new Product("123", "Product 1", 10);
    await productRepository.create(product);
    const product2 = new Product("1234", "Product 2", 20);
    await productRepository.create(product2);
    
    const orderItem = new OrderItem(
      "1",
      product.name,
      product.price,
      product.id,
      2
      );
      
      
      const order = new Order("123", "123", [orderItem]);
      const orderRepository = new OrderRepository();
      await orderRepository.create(order);     
      orderItem.changeProduct(product2)
      orderItem.changeQuantity(3)
    order.changeOrderItems([orderItem])
    await orderRepository.update(order)  
    const orderModel = await OrderModel.findOne({
          where: { id: order.id },
          include: ["items"],
        });
  expect(orderModel.toJSON()).toStrictEqual({
          id: "123",
          customer_id: "123",
          total: order.total(),
    items: [
        {
          id: orderItem.id,
          name: orderItem.name,
          price: orderItem.price,
          quantity: orderItem.quantity,
          order_id: "123",
          product_id: product2.id,
        },
      ],
    });
  })
it("should find an order", async() => {
  const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);
    
    const productRepository = new ProductRepository();
    const product = new Product("123", "Product 1", 10);
    await productRepository.create(product);

    const orderItem = new OrderItem(
      "1",
      product.name,
      product.price,
      product.id,
      2
    );

    const order = new Order("123", "123", [orderItem]);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    const orderResult = await orderRepository.find(order.id);

    expect(order).toStrictEqual(orderResult);
})

it("should find all orders", async () => {
  const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Customer 1");
    const customer2 = new Customer("1234", "Customer 2");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    const address2 = new Address("Street 2", 2, "Zipcode 2", "City 2");
    customer.changeAddress(address);
    customer2.changeAddress(address2);
    await customerRepository.create(customer);
    await customerRepository.create(customer2);
    
    const productRepository = new ProductRepository();
    const product = new Product("123", "Product 1", 10);
    await productRepository.create(product);
    const product2 = new Product("1234", "Product 2", 20);
    await productRepository.create(product2);
    
    const orderItem = new OrderItem(
      "1",
      product.name,
      product.price,
      product.id,
      2
      );
    const orderItem2 = new OrderItem(
      "2",
      product2.name,
      product2.price,
      product2.id,
      3
      );
        
  const order = new Order("123", "123", [orderItem]);
  const order2 = new Order("1234", "1234", [orderItem2]);
  const orderRepository = new OrderRepository();
  await orderRepository.create(order);     
  await orderRepository.create(order2);     
  const orderModel = await orderRepository.findAll()
        
    expect(orderModel).toHaveLength(2);
    expect(orderModel).toContainEqual(order);
    expect(orderModel).toContainEqual(order2);
})
});