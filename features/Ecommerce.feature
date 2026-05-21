Feature: Ecommerce validation
  @Regression
  Scenario: Placing the order
    Given a login to Ecommerce application with "test_qa123@yahoo.com" and "Bambam123"
    When Add "ZARA COAT 3" to cart
    Then Verify "ZARA COAT 3" is displayed in the cart
    When Enter valid details and place the order
    Then Verify order is present in the order history

  @ErrorValidation
  Scenario Outline: Scenario Outline name: Placing the order
    Given a login to Ecommerce2 application with "<username>" and "<password>"
    Then Verify error message is displayed

    Examples:
        | username             | password | 
        | rahulshettyacademy2  | Learning@830$3mK2 |
        | rahulshettyacademy   | Learning@830$3mK3 |