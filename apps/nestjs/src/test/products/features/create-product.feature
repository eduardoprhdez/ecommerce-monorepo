Feature: Create Products
  Scenario: Successful Creation
    Given a valid product command data
    When the system receives a request create the product
    Then a successful response should be retrieved
  Scenario: Product Price Non positive
    Given a product command data in which the price is not positive
    When the system receives a request create the product
    Then a bad request error should be retrieved
  Scenario: Product Stock Non Positive Integer
    Given a product command data in which the stock is not positive integer
    When the system receives a request create the product
    Then a bad request error should be retrieved