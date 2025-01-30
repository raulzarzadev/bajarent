# Estructura de Customers

Este documento describe la estructura del componente `Customers` en el proyecto.

## Componentes Principales

## Archivos y Directorios

## Dependencias

## Ejemplo de Uso

```jsx


```

## Compiled customers

Es una forma de guardar los clientes para minimisar las llamadas y los datos usados y a la hora de crear una orden esten mas accessibles

Cada que se cree o se actualice un customer se debera actualizar tambien en compiledCustomers

```json
// compliedCustomers
[{
  "storeId":"storeId",
  "customers":
   {
    "customerId1" :{
      "name":"customer 1",
      "neighborhood":"Palmira",
      "street":"Av Palma 123",
      "contacts":{
        "hermana":"+525543375014",
        "principal":"solomon@gmail.com"
      }
    }
   }
}]
```

## Contribuciones

Para contribuir a este componente, por favor sigue las directrices del proyecto y asegúrate de escribir pruebas unitarias para cualquier nueva funcionalidad.
