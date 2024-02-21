const express = require('express');
const { v4: uuidv4 } = require('uuid');

const port = 3000;
const app = express();

app.use(express.json());

// Array para armazenar os pedidos
const orders = [];

// Middleware para console.log
app.use((request, response, next) => {
  console.log(`method: ${request.method}`);
  next();
});

// Middleware para verificar se o ID existe
const checkID = (request, response, next) => {
  const { id } = request.params;
  const orderExists = orders.some(order => order.id === id);
  if (!orderExists) {
    return response.status(404).json({ error: 'Order not found' });
  }
  next();
};

// Rota para listar pedidos
app.get('/order', (request, response) => {
  response.json(orders);
});

// Rota para criar um novo pedido
app.post('/order', (request, response) => {
  const { order, clientName, price } = request.body;
  const newOrder = { id: uuidv4(), order, clientName, price, status: "in preparation" };
  orders.push(newOrder);
  response.status(201).json(newOrder);
});

// Rota para obter um pedido específico
app.get('/order/:id', checkID, (request, response) => {
  const { id } = request.params;
  const order = orders.find(order => order.id === id);
  response.json(order);
});

// Rota para atualizar algum pedido
app.put('/order/:id', checkID, (request, response) => {
  const { id } = request.params;
  const { order, clientName, price } = request.body;
  const index = orders.findIndex(order => order.id === id);

  if (index >= 0) {
    orders[index] = { id, order, clientName, price, status: "in preparation" };
    response.json(orders[index]);
  } else {
    response.status(404).json({ error: "Order not found" });
  }
});

// Rota para marcar algum pedido como pronto
app.patch('/order/:id', checkID, (request, response) => {
  const { id } = request.params;
  const index = orders.findIndex(order => order.id === id);
  if (index !==1) {
    orders[index].status = "ready";
    response.json(orders[index]);
  } else {
    response.status(404).json({ error: "Order not found" });
  }
});

// Rota para deletar algum pedido
app.delete('/order/:id', checkID, (request, response) => {
  const { id } = request.params;
  orders = orders.filter(order => order.id !== id);
  response.status(204).end();
});

// Iniciando um servidor
app.listen(port, () => {
  console.log(`🚀 Server started on port ${port}`);
});
